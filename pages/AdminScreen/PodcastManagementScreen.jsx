import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { deletePodcastRequest } from "../../redux/Admin/Podcast/deletePodcast/deletePodcastSlice";
import { postPodcastRequest } from "../../redux/Admin/Podcast/postPosdcast/postPodcastSlice";
import { updatePodcastRequest } from "../../redux/Admin/Podcast/updatePodcast/updatePodcastSlice";
import { fetchAllPodcast } from "../../redux/User/fetchAllPodcast/getAllPodcastSlice";
import { fetchAllCategory } from "../../redux/User/fetchCategory/fetchCategorySlice";

export default function PodcastManagementScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {
    loading: posting,
    postPodcast,
    error: postError,
  } = useSelector((s) => s.postPodcast || {});
  const { loading: loadingList, podcasts } = useSelector(
    (s) => s.fetchAllPodcast
  );
  const { updatePodcast } = useSelector((s) => s.updatePodcast || {});
  const { deletePodcast } = useSelector((s) => s.deletePodcast || {});
  const { categories } = useSelector((s) => s.fetchAllCategory);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [oldAudioUrl, setOldAudioUrl] = useState(null); // NEW: URL audio cũ

  // Audio preview states
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllPodcast(1, 50));
    dispatch(fetchAllCategory());
  }, [dispatch]);

  useEffect(() => {
    if (postPodcast) {
      Toast.show({ type: "success", text1: "Đăng podcast thành công" });
      setShowModal(false);
      resetForm();
      dispatch(fetchAllPodcast(1, 50));
    }
  }, [postPodcast, dispatch]);

  useEffect(() => {
    if (updatePodcast) {
      Toast.show({ type: "success", text1: "Cập nhật podcast thành công" });
      setShowModal(false);
      resetForm();
      dispatch(fetchAllPodcast(1, 50));
    }
  }, [updatePodcast, dispatch]);

  useEffect(() => {
    if (deletePodcast) {
      Toast.show({ type: "success", text1: "Xóa podcast thành công" });
      dispatch(fetchAllPodcast(1, 50));
    }
  }, [deletePodcast, dispatch]);

  useEffect(() => {
    if (postError) {
      Toast.show({ type: "error", text1: postError?.toString() });
    }
  }, [postError]);

  // NEW: Load audio (cũ hoặc mới)
  useEffect(() => {
    const loadAudio = async () => {
      // Ưu tiên audioFile mới, nếu không có thì dùng oldAudioUrl
      const audioUri = audioFile?.uri || oldAudioUrl;

      if (!audioUri) {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setPosition(0);
        setDuration(0);
        setIsPlaying(false);
        return;
      }

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: false },
          (status) => {
            if (status.isLoaded) {
              if (!isSeeking) {
                setPosition(status.positionMillis || 0);
              }
              setDuration(status.durationMillis || 0);
              if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
              }
            }
          }
        );

        soundRef.current = sound;
      } catch (error) {
        console.error("Load audio error:", error);
        Toast.show({ type: "error", text1: "Không thể load audio" });
      }
    };

    loadAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [audioFile?.uri, oldAudioUrl]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedCategories([]);
    setImageFile(null);
    setAudioFile(null);
    setOldAudioUrl(null); // NEW
    setIsEditing(false);
    setEditingId(null);
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    if (soundRef.current) {
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingId(item.id);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setSelectedCategories(item.category || []);
    setImageFile(item.imageUrl ? { uri: item.imageUrl } : null);

    // NEW: Lưu URL audio cũ để preview
    const audioUrl =
      item.audioUrl || item.audio || item.fileUrl || item.url || item.audioFile;
    setOldAudioUrl(audioUrl);

    setShowModal(true);
  };

  const handleDelete = (id) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa podcast này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          dispatch(deletePodcastRequest(id));
        },
      },
    ]);
  };

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({ type: "error", text1: "Cần quyền truy cập thư viện ảnh" });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.9,
    });
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setImageFile({
        uri: asset.uri,
        type: asset.mimeType || "image/jpeg",
        name: asset.fileName || "podcast.jpg",
      });
    }
  };

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "success" || !result.canceled) {
        const asset = result.assets?.[0] || result;
        setAudioFile({
          uri: asset.uri,
          type: asset.mimeType || "audio/mpeg",
          name: asset.name || "podcast.mp3",
        });
        Toast.show({
          type: "success",
          text1: `Đã chọn: ${asset.name}`,
        });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Lỗi chọn file audio" });
    }
  };

  const handlePlayPause = async () => {
    if (!soundRef.current) return;
    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) return;

      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Play/Pause error:", error);
    }
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
      } catch (error) {
        console.error("Seek error:", error);
      }
    }
  };

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getCategoryNames = (categoryIds) => {
    if (!categoryIds || categoryIds.length === 0) return "";
    return categoryIds
      .map((id) => {
        const cat = categories?.find((c) => c.id === id);
        return cat?.name || id;
      })
      .join(", ");
  };

  const submit = () => {
    if (!title?.trim() || !description?.trim()) {
      Toast.show({ type: "error", text1: "Nhập tiêu đề và mô tả" });
      return;
    }

    if (selectedCategories.length === 0) {
      Toast.show({ type: "error", text1: "Chọn ít nhất 1 danh mục" });
      return;
    }

    if (isEditing) {
      const params = {
        title: title.trim(),
        description: description.trim(),
        category: selectedCategories,
      };

      // LUÔN tạo FormData (rỗng nếu không có file)
      const formData = new FormData();

      // Chỉ append file nếu có thay đổi
      if (imageFile?.uri && !imageFile.uri.startsWith("http")) {
        formData.append("imageFile", {
          uri: imageFile.uri,
          name: imageFile.name || "podcast.jpg",
          type: imageFile.type || "image/jpeg",
        });
      }

      if (audioFile?.uri) {
        formData.append("file", {
          uri: audioFile.uri,
          name: audioFile.name || "podcast.mp3",
          type: audioFile.type || "audio/mpeg",
        });
      }

      console.log("Update params:", params);
      console.log("FormData parts:", formData._parts);

      dispatch(
        updatePodcastRequest({
          id: editingId,
          data: formData, // Luôn gửi FormData (có thể rỗng)
          params,
        })
      );
    } else {
      // CREATE PODCAST
      if (!imageFile?.uri) {
        Toast.show({ type: "error", text1: "Vui lòng chọn ảnh podcast" });
        return;
      }
      if (!audioFile?.uri) {
        Toast.show({ type: "error", text1: "Vui lòng chọn file audio" });
        return;
      }

      const formData = new FormData();

      formData.append("imageFile", {
        uri: imageFile.uri,
        name: imageFile.name || "podcast.jpg",
        type: imageFile.type || "image/jpeg",
      });

      formData.append("file", {
        uri: audioFile.uri,
        name: audioFile.name || "podcast.mp3",
        type: audioFile.type || "audio/mpeg",
      });

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      selectedCategories.forEach((cat) => formData.append("category", cat));

      dispatch(postPodcastRequest(formData));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            item.imageUrl || "https://via.placeholder.com/80x80.png?text=IMG",
        }}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title || "No title"}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description || ""}
        </Text>
        {item.category?.length > 0 && (
          <Text style={styles.cardCategory}>
            Danh mục: {getCategoryNames(item.category)}
          </Text>
        )}
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#20B2AA" }]}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="pencil" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#E74C3C" }]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Admin")}
          style={styles.backBtn}
        >
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backLabel}>Admin</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý Podcast</Text>
        <View style={{ width: 60 }} />
      </View>

      {loadingList ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={podcasts}
          keyExtractor={(it, idx) => String(it.id ?? idx)}
          renderItem={renderItem}
          contentContainerStyle={
            podcasts?.length ? { padding: 12 } : styles.center
          }
          refreshing={loadingList}
          onRefresh={() => dispatch(fetchAllPodcast(1, 50))}
          ListEmptyComponent={<Text>Chưa có podcast</Text>}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          resetForm();
          setShowModal(true);
        }}
      >
        <Text style={styles.fabPlus}>＋</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setShowModal(false);
          resetForm();
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? "Sửa podcast" : "Đăng podcast"}
              </Text>
              <Pressable
                onPress={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.closeText}>Đóng</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
              <Text style={styles.label}>Tiêu đề *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Nhập tiêu đề podcast"
              />

              <Text style={styles.label}>Mô tả *</Text>
              <TextInput
                style={[styles.input, styles.multiline]}
                value={description}
                onChangeText={setDescription}
                placeholder="Nhập mô tả podcast"
                multiline
                numberOfLines={4}
              />

              <Text style={styles.label}>Danh mục *</Text>
              <View style={styles.categoryContainer}>
                {categories?.length > 0 ? (
                  categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.checkboxRow}
                      onPress={() => toggleCategory(cat.id)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          selectedCategories.includes(cat.id) &&
                            styles.checkboxChecked,
                        ]}
                      >
                        {selectedCategories.includes(cat.id) && (
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noCategory}>Chưa có danh mục</Text>
                )}
              </View>

              <Text style={styles.label}>Hình ảnh *</Text>
              <View style={styles.imageRow}>
                <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
                  <Text style={styles.pickText}>Chọn ảnh</Text>
                </TouchableOpacity>
                {imageFile?.uri ? (
                  <Image
                    source={{ uri: imageFile.uri }}
                    style={styles.preview}
                  />
                ) : null}
              </View>

              {!isEditing && (
                <>
                  <Text style={styles.label}>File Audio *</Text>
                  <View style={styles.imageRow}>
                    <TouchableOpacity
                      style={styles.pickBtn}
                      onPress={pickAudio}
                    >
                      <Text style={styles.pickText}>Chọn audio</Text>
                    </TouchableOpacity>
                    {audioFile ? (
                      <Text style={styles.fileName} numberOfLines={1}>
                        {audioFile.name}
                      </Text>
                    ) : null}
                  </View>
                </>
              )}

              {isEditing && (
                <>
                  <Text style={styles.label}>File Audio (tùy chọn)</Text>
                  <View style={styles.imageRow}>
                    <TouchableOpacity
                      style={styles.pickBtn}
                      onPress={pickAudio}
                    >
                      <Text style={styles.pickText}>
                        {audioFile ? "Đổi audio" : "Chọn audio mới"}
                      </Text>
                    </TouchableOpacity>
                    {audioFile ? (
                      <Text style={styles.fileName} numberOfLines={1}>
                        {audioFile.name}
                      </Text>
                    ) : (
                      <Text style={styles.fileHint}>
                        {oldAudioUrl ? "Đang dùng audio cũ" : "Chưa có audio"}
                      </Text>
                    )}
                  </View>
                </>
              )}

              {/* NEW: Audio preview (hiển thị cho cả audio cũ và mới) */}
              {(audioFile?.uri || oldAudioUrl) && (
                <View style={styles.audioPreview}>
                  <Text style={styles.previewLabel}>
                    {audioFile?.uri
                      ? "Preview Audio Mới"
                      : "Preview Audio Hiện Tại"}
                  </Text>
                  <View style={styles.audioControls}>
                    <TouchableOpacity
                      style={styles.playPauseBtn}
                      onPress={handlePlayPause}
                    >
                      <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={20}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <View style={styles.seekContainer}>
                      <Text style={styles.timeText}>
                        {formatTime(position)}
                      </Text>
                      <Slider
                        style={styles.seekSlider}
                        minimumValue={0}
                        maximumValue={duration || 1}
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
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={[styles.submitBtn, posting && { opacity: 0.6 }]}
                onPress={submit}
                disabled={posting}
              >
                {posting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>
                    {isEditing ? "Cập nhật" : "Đăng podcast"}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "#F8FAFB", marginTop: 30 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent: "space-between",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingRight: 8,
  },
  backIcon: {
    fontSize: 24,
    color: "#FF6B35",
    lineHeight: 24,
    marginRight: 4,
  },
  backLabel: { color: "#FF6B35", fontWeight: "700", fontSize: 14 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1A1A1A" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardDesc: { color: "#666", marginTop: 4, fontSize: 12 },
  cardCategory: {
    color: "#2C3E50",
    marginTop: 2,
    fontWeight: "600",
    fontSize: 12,
  },
  cardActions: { justifyContent: "center", gap: 8 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF6B35",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  fabPlus: { color: "#fff", fontSize: 28, lineHeight: 28, marginTop: -3 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalSheet: {
    maxHeight: "85%",
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  closeText: { color: "#FF6B35", fontWeight: "700" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 10, marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  multiline: { height: 100, textAlignVertical: "top" },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#CED4DA",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#495057",
  },
  noCategory: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  imageRow: { flexDirection: "row", alignItems: "center" },
  pickBtn: {
    backgroundColor: "#20B2AA",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 12,
  },
  pickText: { color: "#fff", fontWeight: "600" },
  preview: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#eee" },
  fileName: { fontSize: 12, color: "#666", flex: 1 },
  fileHint: { fontSize: 12, color: "#999", fontStyle: "italic" },
  audioPreview: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 8,
  },
  audioControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  playPauseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#20B2AA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  seekContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  seekSlider: {
    flex: 1,
    marginHorizontal: 8,
    height: 30,
  },
  timeText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "600",
    width: 38,
    textAlign: "center",
  },
  submitBtn: {
    marginTop: 18,
    backgroundColor: "#FF6B35",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
