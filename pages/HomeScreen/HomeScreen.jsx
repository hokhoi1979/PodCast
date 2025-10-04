import { Audio } from "expo-av";
import { Image } from "expo-image";
import { Heart, Pause, Play } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

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

  // Use API categories with "All" as first option
  const apiCategories = categories?.map((cat) => cat.name) || [];
  const sortedCategories = ["All", ...apiCategories];

  // Determine which podcasts to show and loading state
  const displayPodcasts =
    selectedCategory === "All" ? podcasts : podcastsByCate;
  const isLoadingPodcasts =
    selectedCategory === "All" ? loading : podcastsByCateLoading;

  // Fetch categories on mount
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

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setDescExpanded(false); // Reset description expansion
  };

  return (
    <>
      <Header />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Podcast */}
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
          </View>
        </View>

        {/* Categories */}
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

        {/* Podcast List */}
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
          ) : displayPodcasts && displayPodcasts.length > 0 ? (
            displayPodcasts.map((ep) => (
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
                <TouchableOpacity style={styles.heartButton}>
                  <Heart size={22} color="#8B5A2B" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {selectedCategory === "All"
                  ? "Không có podcast nào"
                  : `Không có podcast nào trong danh mục ${selectedCategory}`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
  },
  contentContainer: {
    paddingBottom: 100, // Add padding to avoid taskbar overlap
  },
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
  featuredInfo: {
    flex: 1,
    justifyContent: "center",
  },
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

  categoryScroll: {
    marginVertical: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  categoryItem: {
    backgroundColor: "#FFF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryItemActive: {
    backgroundColor: "#20B2AA",
    borderColor: "#20B2AA",
  },
  categoryText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
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
  episodeInfo: {
    flex: 1,
    paddingRight: 8,
  },
  episodeTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    lineHeight: 20,
  },
  heartButton: {
    padding: 8,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 15,
    color: "#999",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
  },
  categoryLoadingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryLoadingText: {
    fontSize: 14,
    color: "#999",
  },
});
