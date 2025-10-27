import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import { deleteFavorite } from "../../redux/User/favourite/deleteFavorite/deleteFavoriteSlice";
import { getFavorite } from "../../redux/User/favourite/getFavorite/getFavoriteSlice";
import { getPodcastId } from "../../redux/User/fetchPodcastById/fetchPodcastByIdSlice";

export default function FavouriteScreen() {
  const dispatch = useDispatch();
  const { getFavo } = useSelector((state) => state.getFavorite);
  const { getPodId } = useSelector((state) => state.fetchPodcastById);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [favourites, setFavourites] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const soundRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const isCreatingAudioRef = useRef(false);

  // Dừng audio khi screen mất focus (chuyển sang tab khác)
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Cleanup khi screen mất focus - chỉ dừng nếu đang phát
        if (soundRef.current && isPlaying) {
          soundRef.current.pauseAsync().catch(() => {});
        }
      };
    }, [isPlaying])
  );

  useEffect(() => {
    dispatch(getFavorite());
  }, [dispatch]);

  useEffect(() => {
    if (getFavo?.content) setFavourites(getFavo.content);
  }, [getFavo]);

  // Cleanup khi getPodId thay đổi (chọn podcast khác)
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [getPodId]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  const handleSelectPodcast = async (item) => {
    try {
      // Dừng và cleanup audio cũ trước
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Reset trạng thái audio
      setIsPlaying(false);
      setPositionMillis(0);
      setDurationMillis(0);

      const index = favourites.findIndex((f) => f.podcastId === item.podcastId);
      setCurrentIndex(index);
      setSelectedId(item?.podcastId);
      dispatch(getPodcastId(item?.podcastId));
      setShouldPlay(true);
    } catch (e) {
      console.error("Select podcast error", e);
    }
  };

  const handleNext = async () => {
    if (currentIndex < favourites.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      await handleSelectPodcast(favourites[nextIndex]);
    } else {
      Toast.show({
        type: "info",
        text1: "Đã đến bài cuối cùng",
      });
    }
  };

  const handlePrev = async () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      await handleSelectPodcast(favourites[prevIndex]);
    } else {
      Toast.show({
        type: "info",
        text1: "Đang ở bài đầu tiên",
      });
    }
  };

  useEffect(() => {
    const play = async () => {
      if (!shouldPlay || !getPodId?.audioUrl || isCreatingAudioRef.current)
        return;

      isCreatingAudioRef.current = true;

      try {
        // Cleanup audio cũ trước khi tạo audio mới
        if (soundRef.current) {
          try {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
          } catch (e) {
            console.log("Cleanup error:", e);
          }
          soundRef.current = null;
        }

        // Reset trạng thái
        setIsPlaying(false);
        setPositionMillis(0);
        setDurationMillis(0);

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: getPodId.audioUrl },
          { shouldPlay: true, volume, isLooping: false },
          (status) => {
            if (!status?.isLoaded) return;

            const now = Date.now();
            if (now - lastUpdateRef.current > 500) {
              lastUpdateRef.current = now;

              setPositionMillis(status.positionMillis || 0);
              setDurationMillis(status.durationMillis || 0);
              setIsPlaying(status.isPlaying || false);

              if (status.didJustFinish) {
                setIsPlaying(false);
                setPositionMillis(0);
              }
            }
          }
        );

        soundRef.current = sound;
        setIsPlaying(true);
      } catch (e) {
        console.log("Play error", e);
        Toast.show({
          type: "error",
          text1: "Không thể phát podcast",
          text2: e.message,
        });
      } finally {
        setShouldPlay(false);
        isCreatingAudioRef.current = false;
      }
    };
    play();
  }, [shouldPlay, getPodId, volume]);

  const handlePlayPause = async () => {
    if (!soundRef.current) {
      console.log("No sound ref available");
      return;
    }

    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) {
        console.log("Sound not loaded");
        return;
      }

      if (status.isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        console.log("Paused");
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
        console.log("Playing");
      }
    } catch (e) {
      console.log("Play/Pause error:", e);
    }
  };

  const handleSeek = async (val) => {
    if (soundRef.current)
      await soundRef.current.setPositionAsync(Math.round(val * 1000));
  };

  const handleSeekStart = () => {
    // Pause updates during seeking
  };

  const handleSeekChange = (val) => {
    setPositionMillis(val * 1000);
  };

  const handleVolumeChange = async (val) => {
    setVolume(val);
    if (soundRef.current) await soundRef.current.setVolumeAsync(val);
    setMuted(val === 0);
  };

  const toggleMute = async () => {
    const m = !muted;
    setMuted(m);
    if (soundRef.current) await soundRef.current.setIsMutedAsync(m);
  };

  const handleRemove = async (id) => {
    dispatch(deleteFavorite(id));
    if (selectedId === id) {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setSelectedId(null);
      setIsPlaying(false);
      setPositionMillis(0);
      setDurationMillis(0);
    }
  };

  const formatTime = (ms) => {
    if (!ms || ms <= 0) return "0:00";
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="heart"
          size={20}
          color="#b66f3a"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.headerText}>Yêu thích</Text>
      </View>

      <View style={styles.cardPlayer}>
        <Image
          source={{
            uri:
              getPodId?.imageUrl ||
              "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=600",
          }}
          style={styles.playerImage}
        />
        <View style={styles.playerBody}>
          <Text style={styles.title} numberOfLines={2}>
            {getPodId?.title || "Chọn podcast để nghe"}
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {getPodId?.description || "Hãy chọn một podcast yêu thích bên dưới"}
          </Text>

          <View style={styles.progressRow}>
            <Text style={styles.timeText}>{formatTime(positionMillis)}</Text>
            <Slider
              style={styles.progressSlider}
              value={durationMillis ? positionMillis / 1000 : 0}
              minimumValue={0}
              maximumValue={
                durationMillis ? Math.ceil(durationMillis / 1000) : 0
              }
              minimumTrackTintColor="#f06f3a"
              maximumTrackTintColor="#eee"
              thumbTintColor="#f06f3a"
              onSlidingStart={handleSeekStart}
              onValueChange={handleSeekChange}
              onSlidingComplete={handleSeek}
              disabled={!getPodId?.audioUrl}
            />
            <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity style={styles.iconButton} onPress={handlePrev}>
              <Ionicons name="play-skip-back" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayPause}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={28}
                color="#fff"
                style={{ marginLeft: isPlaying ? 2 : 0 }}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={handleNext}>
              <Ionicons name="play-skip-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomRow}>
            <TouchableOpacity onPress={toggleMute} style={{ padding: 6 }}>
              <Ionicons
                name={muted || volume === 0 ? "volume-mute" : "volume-high"}
                size={20}
                color="#b66f3a"
              />
            </TouchableOpacity>

            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={volume}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#b66f3a"
              maximumTrackTintColor="#eee"
              thumbTintColor={Platform.OS === "android" ? "#b66f3a" : undefined}
            />
          </View>
        </View>
      </View>

      <FlatList
        data={favourites}
        keyExtractor={(it) => `${it.id}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemRow}
            onPress={() => handleSelectPodcast(item)}
          >
            <Image
              source={{ uri: item.podcastImage }}
              style={styles.itemImage}
            />
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.itemTitle}>{item.podcastTitle}</Text>
              <Text style={styles.itemSub} numberOfLines={1}>
                {item.podcast?.description}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Ionicons name="heart" size={22} color="#f45454" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
            Chưa có mục yêu thích nào
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f5f0" },
  header: { flexDirection: "row", alignItems: "center", padding: 16 },
  headerText: { fontSize: 18, fontWeight: "700", color: "#4b3b2b" },
  cardPlayer: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginBottom: 18,
  },
  playerImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#f0ebe6",
  },
  playerBody: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
    textAlign: "center",
  },
  desc: { fontSize: 13, color: "#666", textAlign: "center", marginBottom: 10 },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 6,
  },
  timeText: { width: 42, textAlign: "center", fontSize: 12, color: "#666" },
  progressSlider: { flex: 1 },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  iconButton: { padding: 12 },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#b98962",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 18,
    shadowColor: "#b98962",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 12,
    paddingHorizontal: 8,
  },
  volumeSlider: { flex: 1, marginHorizontal: 8 },
  commentBtn: {
    backgroundColor: "#fbf3ec",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  commentText: { color: "#b66f3a", fontWeight: "600" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#fffdfb",
    borderRadius: 12,
  },
  itemImage: {
    width: 52,
    height: 52,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  itemTitle: { fontSize: 15, fontWeight: "600", color: "#2a2a2a" },
  itemSub: { fontSize: 13, color: "#666" },
});
