import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";

import { getFavorite } from "../../redux/User/favourite/getFavorite/getFavoriteSlice";
import { deleteFavorite } from "../../redux/User/favourite/deleteFavorite/deleteFavoriteSlice";
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

  // Load favorites
  useEffect(() => {
    dispatch(getFavorite());
  }, [dispatch]);

  // Update list
  useEffect(() => {
    if (getFavo?.content) setFavourites(getFavo.content);
  }, [getFavo]);

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  // Handle select podcast
  const handleSelectPodcast = async (item) => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const index = favourites.findIndex((f) => f.podcastId === item.podcastId);
      setCurrentIndex(index);
      setSelectedId(item?.podcastId);
      dispatch(getPodcastId(item?.podcastId));
      setShouldPlay(true);
    } catch (e) {
      console.error("Select podcast error", e);
    }
  };

  const handleNext = () => {
    if (currentIndex < favourites.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      handleSelectPodcast(favourites[nextIndex]);
    } else {
      Toast.show({
        type: "info",
        text1: "Đã đến bài cuối cùng",
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      handleSelectPodcast(favourites[prevIndex]);
    } else {
      Toast.show({
        type: "info",
        text1: "Đang ở bài đầu tiên",
      });
    }
  };

  // When getPodId updated → play audio
  useEffect(() => {
    const play = async () => {
      if (!shouldPlay || !getPodId?.audioUrl) return;

      try {
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
        }

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
            // chỉ update mỗi 500ms
            if (now - lastUpdateRef.current > 500) {
              lastUpdateRef.current = now;

              setPositionMillis(status.positionMillis || 0);
              setDurationMillis(status.durationMillis || 0);
              setIsPlaying(status.isPlaying || false);

              if (status.didJustFinish) setIsPlaying(false);
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
        });
      } finally {
        setShouldPlay(false);
      }
    };
    play();
  }, [getPodId]);

  // Play / pause
  const handlePlayPause = async () => {
    if (!soundRef.current) return;
    const status = await soundRef.current.getStatusAsync();
    if (!status.isLoaded) return;
    if (status.isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const handleSeek = async (val) => {
    if (soundRef.current)
      await soundRef.current.setPositionAsync(Math.round(val * 1000));
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

  const handleRemove = (id) => {
    dispatch(deleteFavorite(id));
    if (selectedId === id) {
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setSelectedId(null);
      setIsPlaying(false);
    }
  };

  const formatTime = (ms) => {
    if (!ms || ms <= 0) return "0:00";
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="heart"
          size={20}
          color="#b66f3a"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.headerText}>Yêu thích</Text>
      </View>

      {/* Player */}
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

          {/* Progress */}
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
              onSlidingComplete={handleSeek}
              disabled={!getPodId?.audioUrl}
            />
            <Text style={styles.timeText}>{formatTime(durationMillis)}</Text>
          </View>

          {/* Controls */}
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

          {/* Volume + comment */}
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

            <TouchableOpacity style={styles.commentBtn}>
              <Text style={styles.commentText}>Bình luận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* List */}
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
