import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { Image } from "expo-image";
import { Heart, MessageCircle, Pause, Play } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import { deleteComment } from "../../redux/User/comment/delete_comment/deleteCommentSlice.js";
import { getComments } from "../../redux/User/comment/fetch_comment/fetchCommentSlice.js";
import {
  postComment,
  resetPostComment,
} from "../../redux/User/comment/post_comment/postCommentSilce.js";
import { updateComment } from "../../redux/User/comment/update_comment/updateCommentSlice.js";
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
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  // Comment Modal States
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

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
  const { comments, loading: commentsLoading } = useSelector(
    (state) => state.getComments
  );
  const { success: commentSuccess } = useSelector((state) => state.postComment);
  const { success: updateSuccess } = useSelector(
    (state) => state.updateComment
  );
  const { success: deleteSuccess } = useSelector(
    (state) => state.deleteComment
  );
  const { user } = useSelector((state) => state.auth);

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

  // Fetch comments khi mở modal
  useEffect(() => {
    if (showCommentModal && selectedPodcast?.id) {
      dispatch(getComments(selectedPodcast.id));
    }
  }, [showCommentModal, selectedPodcast?.id, dispatch]);

  // Reset comment form khi thành công
  useEffect(() => {
    if (commentSuccess) {
      setCommentText("");
      dispatch(resetPostComment());
      if (selectedPodcast?.id) {
        dispatch(getComments(selectedPodcast.id));
      }
    }
  }, [commentSuccess, dispatch, selectedPodcast?.id]);

  // Xử lý khi update comment thành công
  useEffect(() => {
    if (updateSuccess) {
      setEditingCommentId(null);
      setEditContent("");
      if (selectedPodcast?.id) {
        dispatch(getComments(selectedPodcast.id));
      }
    }
  }, [updateSuccess, dispatch, selectedPodcast?.id]);

  // Xử lý khi delete comment thành công
  useEffect(() => {
    if (deleteSuccess) {
      if (selectedPodcast?.id) {
        dispatch(getComments(selectedPodcast.id));
      }
    }
  }, [deleteSuccess, dispatch, selectedPodcast?.id]);

  useEffect(() => {
    if (selectedPodcast && filtered) {
      const index = filtered.findIndex((p) => p.id === selectedPodcast.id);
      if (index >= 0) setCurrentIndex(index);
    }
  }, [selectedPodcast, filtered]);

  const playNext = () => {
    if (!filtered || filtered.length === 0) return;
    const nextIndex = (currentIndex + 1) % filtered.length;
    dispatch(selectPodcast(filtered[nextIndex], true));
    setDescExpanded(false);
  };

  const playPrevious = () => {
    if (!filtered || filtered.length === 0) return;
    const prevIndex =
      currentIndex === 0 ? filtered.length - 1 : currentIndex - 1;
    dispatch(selectPodcast(filtered[prevIndex], true));
    setDescExpanded(false);
  };

  useEffect(() => {
    dispatch(getFavorite());
  }, [dispatch]);

  useEffect(() => {
    if (getFavo?.content) {
      const favIds = getFavo.content.map((item) => item.podcastId);
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
          setPosition(0);
          setDuration(0);
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
            if (status.isLoaded) {
              if (!isSeeking) {
                setPosition(status.positionMillis || 0);
              }
              setDuration(status.durationMillis || 0);

              if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
                playNext();
              }
            }
          }
        );

        if (!mounted) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        await sound.setVolumeAsync(1);
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

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekChange = (value) => {
    setPosition(value);
  };

  const handleSeekComplete = async (value) => {
    setIsSeeking(false);
    if (soundRef.current) {
      try {
        await soundRef.current.setPositionAsync(value);
      } catch (e) {}
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
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

  const handleSubmitComment = () => {
    if (!commentText.trim()) {
      Toast.show({ type: "error", text1: "⚠ Bình luận không được để trống!" });
      return;
    }
    if (!selectedPodcast?.id) {
      Toast.show({ type: "error", text1: "⚠ Không tìm thấy podcast" });
      return;
    }
    if (!user) {
      Toast.show({
        type: "error",
        text1: "⚠ Vui lòng đăng nhập để bình luận!",
      });
      return;
    }

    dispatch(
      postComment({
        podcastId: selectedPodcast.id,
        commentUser: user.username || "Ẩn danh",
        content: commentText.trim(),
      })
    );
  };

  // Handle edit comment
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  // Handle update comment
  const handleUpdateComment = () => {
    if (!editContent.trim()) {
      Toast.show({ type: "error", text1: "⚠ Bình luận không được để trống!" });
      return;
    }
    if (!user) {
      Toast.show({
        type: "error",
        text1: "⚠ Vui lòng đăng nhập để thực hiện thao tác này!",
      });
      return;
    }

    dispatch(
      updateComment({
        commentId: editingCommentId,
        podcastId: selectedPodcast.id,
        commentUser: user.username || "Ẩn danh",
        content: editContent.trim(),
      })
    );

    // Reset edit state
    setEditingCommentId(null);
    setEditContent("");
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  // Handle delete comment
  const handleDeleteComment = (comment) => {
    // Kiểm tra quyền xóa - chỉ người comment mới xóa được
    if (!user) {
      Toast.show({
        type: "error",
        text1: "⚠ Vui lòng đăng nhập để thực hiện thao tác này!",
      });
      return;
    }

    if (comment.commentUser !== user.username) {
      Toast.show({
        type: "error",
        text1: "⚠ Bạn chỉ có thể xóa bình luận của chính mình!",
      });
      return;
    }

    dispatch(deleteComment({ id: comment.id }));
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView>
          <Header />
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

          <View style={styles.featured}>
            <Image
              style={styles.featuredImage}
              source={{
                uri:
                  selectedPodcast?.imageUrl ||
                  "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
              }}
            />

            <View style={styles.featuredContent}>
              <Text style={styles.featuredTitle} numberOfLines={2}>
                {selectedPodcast?.title || "Chọn podcast để nghe"}
              </Text>

              {!!selectedPodcast?.description && (
                <>
                  <Text
                    style={styles.featuredDesc}
                    numberOfLines={descExpanded ? undefined : 3}
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

              {selectedPodcast && (
                <View style={styles.playerContainer}>
                  {duration > 0 && (
                    <View style={styles.seekWrapper}>
                      <Text style={styles.timeText}>
                        {formatTime(position)}
                      </Text>
                      <Slider
                        style={styles.seekSlider}
                        minimumValue={0}
                        maximumValue={duration}
                        value={position}
                        onSlidingStart={handleSeekStart}
                        onValueChange={handleSeekChange}
                        onSlidingComplete={handleSeekComplete}
                        minimumTrackTintColor="#FF6B35"
                        maximumTrackTintColor="#E0E0E0"
                        thumbTintColor="#FF6B35"
                      />
                      <Text style={styles.timeText}>
                        {formatTime(duration)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.controlsRow}>
                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={playPrevious}
                    >
                      <Ionicons name="play-skip-back" size={24} color="#666" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.playButtonLarge}
                      onPress={handlePlayPause}
                      disabled={!selectedPodcast}
                    >
                      {isPlaying ? (
                        <Pause size={28} color="#fff" fill="#fff" />
                      ) : (
                        <Play size={28} color="#fff" fill="#fff" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.controlButton}
                      onPress={playNext}
                    >
                      <Ionicons
                        name="play-skip-forward"
                        size={24}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* COMMENT BUTTON */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setShowCommentModal(true)}
                    >
                      <MessageCircle size={20} color="#946f4a" />
                      <Text style={styles.actionText}>Bình luận</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* CATEGORIES */}
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

          {/* PODCAST LIST */}
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
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
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

      {/* COMMENT MODAL */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCommentModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bình luận</Text>
              <TouchableOpacity onPress={() => setShowCommentModal(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentList}>
              {commentsLoading ? (
                <Text style={styles.loadingText}>Đang tải...</Text>
              ) : comments?.length > 0 ? (
                comments.map((comment, index) => (
                  <View key={index} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUser}>
                        {comment.commentUser || "Ẩn danh"}
                      </Text>
                      <View style={styles.commentActions}>
                        <Text style={styles.commentTime}>
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString(
                                "vi-VN"
                              )
                            : ""}
                        </Text>
                        {/* Chỉ hiển thị nút Edit/Delete nếu user đã đăng nhập và là chủ sở hữu comment */}
                        {user && comment.commentUser === user.username && (
                          <View style={styles.commentButtons}>
                            <TouchableOpacity
                              style={styles.editButton}
                              onPress={() => handleEditComment(comment)}
                            >
                              <Ionicons
                                name="pencil"
                                size={16}
                                color="#946f4a"
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.deleteButton}
                              onPress={() => handleDeleteComment(comment)}
                            >
                              <Ionicons
                                name="trash"
                                size={16}
                                color="#ff4444"
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Hiển thị nội dung comment hoặc form edit */}
                    {editingCommentId === comment.id ? (
                      <View style={styles.editCommentWrapper}>
                        <TextInput
                          style={styles.editCommentInput}
                          placeholder="Chỉnh sửa bình luận..."
                          value={editContent}
                          onChangeText={setEditContent}
                          multiline
                        />
                        <View style={styles.editButtonWrapper}>
                          <TouchableOpacity
                            style={styles.saveEditButton}
                            onPress={handleUpdateComment}
                          >
                            <Text style={styles.saveEditButtonText}>Lưu</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.cancelEditButton}
                            onPress={handleCancelEdit}
                          >
                            <Text style={styles.cancelEditButtonText}>Hủy</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.commentContent}>
                        {comment.content}
                      </Text>
                    )}
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>Chưa có bình luận nào</Text>
              )}
            </ScrollView>

            <View style={styles.commentInputWrapper}>
              <TextInput
                style={styles.commentInput}
                placeholder="Viết bình luận..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSubmitComment}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F0" },
  contentContainer: { paddingBottom: 100 },

  featured: {
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: 280,
    backgroundColor: "#E0E0E0",
  },
  featuredContent: {
    padding: 20,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
    lineHeight: 28,
  },
  featuredDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 6,
  },
  expandText: {
    color: "#946f4a",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 12,
  },

  playerContainer: {
    marginTop: 16,
  },
  seekWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  seekSlider: {
    flex: 1,
    marginHorizontal: 12,
    height: 30,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    width: 40,
    textAlign: "center",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  playButtonLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#946f4a",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#946f4a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  actionText: {
    color: "#946f4a",
    fontWeight: "600",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  commentList: {
    maxHeight: 300,
    paddingHorizontal: 20,
  },
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  commentUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#946f4a",
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  commentInputWrapper: {
    flexDirection: "row",
    padding: 20,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F5F5F0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#946f4a",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
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
  categoryItemActive: { backgroundColor: "#946f4a", borderColor: "#946f4a" },
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
  loadingText: { fontSize: 15, color: "#999", textAlign: "center" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
  },
  input: { flex: 1, fontSize: 16 },
  resultText: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  emptyContainer: { paddingVertical: 60, alignItems: "center" },
  emptyText: { fontSize: 15, color: "#999", textAlign: "center" },
  categoryLoadingContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  categoryLoadingText: { fontSize: 14, color: "#999" },

  // Comment styles
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  commentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  commentTime: {
    fontSize: 12,
    color: "#999",
  },
  commentButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },

  // Edit comment styles
  editCommentWrapper: {
    marginTop: 8,
  },
  editCommentInput: {
    backgroundColor: "#F5F5F0",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  editButtonWrapper: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  saveEditButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#946f4a",
  },
  saveEditButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelEditButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cancelEditButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
});
