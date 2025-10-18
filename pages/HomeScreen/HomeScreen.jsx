import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { Image } from "expo-image";
import { Heart, Pause, Play, Volume2, VolumeX } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteFavorite } from "../../redux/User/favourite/deleteFavorite/deleteFavoriteSlice.js";
import { getFavorite } from "../../redux/User/favourite/getFavorite/getFavoriteSlice.js";
import { postFavorite } from "../../redux/User/favourite/postFavortie/postFavoriteSlice.js";
import {
  fetchAllPodcast,
  selectPodcast,
} from "../../redux/User/fetchAllPodcast/getAllPodcastSlice.js";
import { fetchAllCategory } from "../../redux/User/fetchCategory/fetchCategorySlice.js";
import { fetchAllPodcastByCate } from "../../redux/User/fetchPodcastByCate/fetchPodcastByCateSlice.js";
import Header from "../../shared/header/Header.jsx";

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPlaying, setIsPlaying] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const soundRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);

  const prevVolumeRef = useRef(1);

  const dispatch = useDispatch();
  const { podcasts, loading, selectedPodcast, autoPlay } = useSelector(
    (state) => state.fetchAllPodcast
  );
  const { categories, loading: categoriesLoading } = useSelector(
    (state) => state.fetchAllCategory
  );
  const { podcastsByCate, loading: podcastsByCateLoading } = useSelector(
    (state) => state.fetchPodcastByCate
  );

  const { getFavo = [] } = useSelector((state) => state.getFavorite);

  const apiCategories = categories?.map((cat) => cat.name) || [];
  const sortedCategories = ["All", ...apiCategories];

  const displayPodcasts =
    selectedCategory === "All" ? podcasts : podcastsByCate;
  const isLoadingPodcasts =
    selectedCategory === "All" ? loading : podcastsByCateLoading;

  const filtered =
    search.trim().length > 0
      ? displayPodcasts?.filter((item) =>
          item.title?.toLowerCase().includes(search.toLowerCase())
        )
      : displayPodcasts;

  useEffect(() => {
    dispatch(getFavorite());
  }, [dispatch]);

  useEffect(() => {
    if (getFavo?.content) {
      const favIds = getFavo.content.map((item) => item.podcast?.id);
      setFavorites(favIds);
    }
  }, [getFavo]);

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory === "All") {
      dispatch(fetchAllPodcast());
    } else {
      dispatch(fetchAllPodcastByCate({ categoryName: selectedCategory }));
    }
  }, [selectedCategory, dispatch]);

  useEffect(() => {
    let mounted = true;
    const loadAndPlay = async () => {
      try {
        if (!selectedPodcast) {
          if (soundRef.current) {
            await soundRef.current.unloadAsync();
            soundRef.current = null;
          }
          setIsPlaying(false);
          return;
        }

        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const uri =
          selectedPodcast.audioUrl ||
          selectedPodcast.audio ||
          selectedPodcast.fileUrl ||
          selectedPodcast.url ||
          selectedPodcast.audioFile;

        if (!uri) return;

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: autoPlay },
          (status) => {
            if (status.isLoaded && status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        );

        if (!mounted) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        await sound.setVolumeAsync(volume);
        setIsPlaying(!!autoPlay);
      } catch (e) {
        setIsPlaying(false);
      }
    };

    loadAndPlay();
    return () => {
      mounted = false;
    };
  }, [selectedPodcast, autoPlay]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolumeAsync(volume).catch(() => {});
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = async () => {
    const sound = soundRef.current;
    if (!sound) return;
    try {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) return;
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (e) {}
  };

  const handleVolumeChange = (v) => {
    const val = Array.isArray(v) ? v[0] : v;
    setVolume(val);
    setMuted(val === 0);
  };

  const commitVolume = async (v) => {
    const val = Array.isArray(v) ? v[0] : v;
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(val);
    }
    setMuted(val === 0);
  };

  const toggleMute = async () => {
    const sound = soundRef.current;
    if (!sound) return;
    if (!muted) {
      prevVolumeRef.current = volume || 0.5;
      await sound.setVolumeAsync(0);
      setVolume(0);
      setMuted(true);
    } else {
      const newVol = prevVolumeRef.current || 1;
      await sound.setVolumeAsync(newVol);
      setVolume(newVol);
      setMuted(false);
    }
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setDescExpanded(false);
  };

  const handleFavorite = (id) => {
    if (!id) return;
    const isFav = favorites.includes(id);
    if (isFav) {
      dispatch(deleteFavorite(id));
    } else {
      dispatch(postFavorite(id));
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView>
          <Header />

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
                    <TouchableOpacity
                      onPress={() => setDescExpanded((v) => !v)}
                    >
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
                  onSlidingComplete={commitVolume}
                  disabled={!selectedPodcast}
                />
                <Text style={styles.volumeLabel}>
                  {Math.round(volume * 100)}%
                </Text>
              </View>
            </View>
          </View>

          <View style={{ padding: 10 }}>
            <View style={styles.searchBox}>
              <Ionicons
                name="search"
                size={20}
                color="#888"
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={styles.input}
                placeholder="Tìm kiếm..."
                value={search}
                onChangeText={setSearch}
              />
            </View>
            {search.length > 0 && (
              <Text style={styles.resultText}>
                Kết quả tìm kiếm ({filtered?.length || 0})
              </Text>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContent}
          >
            {categoriesLoading ? (
              <View style={styles.categoryLoadingContainer}>
                <Text style={styles.categoryLoadingText}>
                  Đang tải danh mục...
                </Text>
              </View>
            ) : (
              sortedCategories.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.categoryItem,
                    selectedCategory === c && styles.categoryItemActive,
                  ]}
                  onPress={() => handleCategoryPress(c)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === c && styles.categoryTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === "All"
                ? "Tập mới nhất"
                : `${selectedCategory}`}
            </Text>
            {isLoadingPodcasts ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Đang tải...</Text>
              </View>
            ) : filtered && filtered.length > 0 ? (
              filtered.map((ep) => (
                <TouchableOpacity
                  key={ep.id}
                  style={styles.episode}
                  onPress={() => {
                    setDescExpanded(false);
                    dispatch(selectPodcast(ep, true));
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{
                      uri: ep.imageUrl || "https://via.placeholder.com/60",
                    }}
                    style={styles.episodeImage}
                  />
                  <View style={styles.episodeInfo}>
                    <Text style={styles.episodeTitle} numberOfLines={2}>
                      {ep.title}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      handleFavorite(ep?.id);
                    }}
                    style={styles.heartButton}
                  >
                    <Heart
                      size={22}
                      color={favorites.includes(ep.id) ? "red" : "#8B5A2B"}
                      fill={favorites.includes(ep.id) ? "red" : "none"}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {search.trim().length > 0
                    ? "Không tìm thấy podcast phù hợp"
                    : selectedCategory === "All"
                    ? "Không có podcast nào"
                    : `Không có podcast nào trong danh mục ${selectedCategory}`}
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F0" },
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
    alignSelf: "flex-center",
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
  categoryScroll: { marginVertical: 8 },
  categoryContent: { paddingHorizontal: 16, paddingVertical: 4 },
  categoryItem: {
    backgroundColor: "#FFF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryItemActive: { backgroundColor: "#20B2AA", borderColor: "#20B2AA" },
  categoryText: { color: "#666", fontSize: 14, fontWeight: "500" },
  categoryTextActive: { color: "#fff", fontWeight: "600" },
  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1A1A1A",
  },
  episode: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  episodeImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: "#E0E0E0",
  },
  episodeInfo: { flex: 1, paddingRight: 8 },
  episodeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 20,
  },
  heartButton: { padding: 8 },
  loadingContainer: { paddingVertical: 40, alignItems: "center" },
  loadingText: { fontSize: 15, color: "#999" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    height: 45,
  },
  input: { flex: 1, fontSize: 16 },
  resultText: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  emptyContainer: { paddingVertical: 60, alignItems: "center" },
  emptyText: { fontSize: 15, color: "#999" },
  categoryLoadingContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  categoryLoadingText: { fontSize: 14, color: "#999" },
});
