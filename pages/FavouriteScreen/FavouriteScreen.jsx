import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { getFavorite } from "../../redux/User/favourite/getFavorite/getFavoriteSlice";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { Pause, Play, Volume2, VolumeX } from "lucide-react-native";
import { deleteFavorite } from "../../redux/User/favourite/deleteFavorite/deleteFavoriteSlice";

export default function FavouriteScreen() {
  const [favourites, setFavourites] = useState([]);
  const [checkFavo, setCheckFavo] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const dispatch = useDispatch();
  const { getFavo } = useSelector((state) => state.getFavorite);

  useEffect(() => {
    dispatch(getFavorite());
  }, [dispatch]);

  useEffect(() => {
    if (getFavo?.content) {
      const favIds = getFavo.content.map((item) => item?.podcast?.id);
      setCheckFavo(favIds);
    }
  }, [getFavo]);

  useEffect(() => {
    if (getFavo?.content) setFavourites(getFavo.content);
  }, [getFavo]);

  console.log("IDD", checkFavo);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleSelectPodcast = async (item) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }
      setSelectedPodcast(item.podcast);

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: item.podcast.audioUrl },
        { shouldPlay: true, volume: volume }
      );
      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi phát audio",
        text2: "Không thể phát podcast này",
      });
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = async (value) => {
    setVolume(value);
    if (sound) await sound.setVolumeAsync(value);
    if (value === 0) setMuted(true);
    else setMuted(false);
  };

  const toggleMute = async () => {
    const newMute = !muted;
    setMuted(newMute);
    if (sound) await sound.setIsMutedAsync(newMute);
  };

  const handleRemove = (id) => {
    if (!id) {
      return;
    }
    const check = checkFavo.includes(id);
    if (check) {
      dispatch(deleteFavorite(id));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="heart-outline"
          size={20}
          color="red"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.headerText}>Yêu thích</Text>
      </View>

      <View style={styles.featured}>
        <Image
          style={styles.featuredImage}
          source={{
            uri:
              selectedPodcast?.imageUrl ||
              "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
          }}
        />
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {selectedPodcast?.title || "Chọn podcast để nghe"}
          </Text>

          {!!selectedPodcast?.description && (
            <>
              <Text
                style={styles.featuredDesc}
                numberOfLines={descExpanded ? undefined : 2}
              >
                {selectedPodcast.description}
              </Text>
              {selectedPodcast.description.length > 100 && (
                <TouchableOpacity onPress={() => setDescExpanded((v) => !v)}>
                  <Text style={styles.expandText}>
                    {descExpanded ? "Thu gọn" : "Xem thêm"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPause}
            disabled={!selectedPodcast}
          >
            {isPlaying ? (
              <Pause size={16} color="#fff" fill="#fff" />
            ) : (
              <Play size={16} color="#fff" fill="#fff" />
            )}
            <Text style={styles.playButtonText}>
              {isPlaying ? "Đang phát" : "Phát"}
            </Text>
          </TouchableOpacity>

          <View style={styles.volumeRow}>
            <TouchableOpacity
              style={styles.volumeIconBtn}
              onPress={toggleMute}
              disabled={!selectedPodcast}
            >
              {muted || volume === 0 ? (
                <VolumeX size={18} color="#20B2AA" />
              ) : (
                <Volume2 size={18} color="#20B2AA" />
              )}
            </TouchableOpacity>
            <Slider
              style={styles.volumeSlider}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              value={volume}
              minimumTrackTintColor="#20B2AA"
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor="#20B2AA"
              onValueChange={handleVolumeChange}
              disabled={!selectedPodcast}
            />
            <Text style={styles.volumeLabel}>{Math.round(volume * 100)}%</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelectPodcast(item)}
          >
            <Image
              source={{ uri: item?.podcast?.imageUrl }}
              style={styles.image}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item?.podcast?.title}</Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {item?.podcast?.description}
              </Text>
            </View>

            <Ionicons
              onPress={() => handleRemove(item.id)}
              name="heart"
              size={22}
              color="#f45454"
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
            Chưa có mục yêu thích nào
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: { paddingBottom: 100 },
  featured: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: "#E0E0E0",
  },
  featuredInfo: { flex: 1, justifyContent: "center" },
  featuredTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  featuredDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 4,
  },
  expandText: {
    color: "#20B2AA",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20B2AA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  playButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  volumeRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  volumeIconBtn: { padding: 6 },
  volumeSlider: { flex: 1, marginHorizontal: 10, height: 30 },
  volumeLabel: {
    width: 42,
    textAlign: "right",
    fontSize: 12,
    color: "#333",
    fontWeight: "600",
  },
  container: {
    flex: 1,
    backgroundColor: "#fefcf7",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1e8df",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    cursor: "pointer",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
});
