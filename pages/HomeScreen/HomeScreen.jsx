import { Image } from "expo-image";
import { Download, Heart, Play } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { categories, episodes } from "../../data/index.js";
import Header from "../../shared/header/Header.jsx";

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPlaying, setIsPlaying] = useState(false);
  const { user = [] } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("uSeR", user);
  }, [user]);
  return (
    <>
      <Header />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.featured}>
          <Image
            style={styles.featuredImage}
            source={{
              uri: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
            }}
          />
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredTitle}>Giao Hạt Tự Tin</Text>
            <Text style={styles.featuredAuthor}>Quang Minh</Text>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Play size={18} color="#fff" />
              <Text style={styles.playButtonText}>
                {isPlaying ? "Đang phát" : "Phát"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.categoryItem,
                selectedCategory === c && styles.categoryItemActive,
              ]}
              onPress={() => setSelectedCategory(c)}
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
          ))}
        </ScrollView>

        {/* --- Danh sách tập mới --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tập mới nhất</Text>
          {episodes.map((ep) => (
            <View key={ep.id} style={styles.episode}>
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop",
                }}
                style={styles.episodeImage}
              />
              <View style={styles.episodeInfo}>
                <Text style={styles.episodeTitle}>{ep.title}</Text>
                <Text style={styles.episodeDetail}>
                  {ep.author} • {ep.duration}
                </Text>
                <Text style={styles.episodeTime}>{ep.timeAgo}</Text>
              </View>
              <View style={styles.episodeActions}>
                <Heart size={20} color="#8B5A2B" />
                <Download size={20} color="#8B5A2B" style={{ marginLeft: 8 }} />
                <Play size={20} color="#8B5A2B" style={{ marginLeft: 8 }} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F0" },
  featured: {
    flexDirection: "row",
    backgroundColor: "#E8E2D9",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  featuredImage: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  featuredInfo: { flex: 1, justifyContent: "center" },
  featuredTitle: { fontSize: 18, fontWeight: "700", color: "#2C1810" },
  featuredAuthor: { fontSize: 14, color: "#6B5B4F", marginBottom: 8 },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#20B2AA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  playButtonText: { color: "#fff", marginLeft: 6, fontWeight: "600" },

  categoryScroll: { marginVertical: 12, paddingLeft: 16 },
  categoryItem: {
    backgroundColor: "#EEE",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryItemActive: { backgroundColor: "#8B5A2B" },
  categoryText: { color: "#333", fontSize: 14 },
  categoryTextActive: { color: "#fff" },

  section: { paddingHorizontal: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  episode: {
    flexDirection: "row",
    backgroundColor: "#F0EDE8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  episodeImage: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  episodeInfo: { flex: 1 },
  episodeTitle: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  episodeDetail: { fontSize: 13, color: "#6B5B4F" },
  episodeTime: { fontSize: 12, color: "#999" },
  episodeActions: { flexDirection: "row", marginLeft: 8 },
});
