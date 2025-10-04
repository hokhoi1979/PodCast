import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Crown, Check } from "lucide-react-native";
import Header from "../../shared/header/Header";

export default function PremiumScreen() {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Crown size={32} color="#FFD700" />
          <Text style={styles.title}>Nâng cấp Premium</Text>
          <Text style={styles.subtitle}>
            Trải nghiệm podcast không giới hạn
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {/* Monthly Plan */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === "monthly" && styles.selectedPlan,
            ]}
            onPress={() => setSelectedPlan("monthly")}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Premium Tháng</Text>
              {selectedPlan === "monthly" && (
                <Check size={20} color="#8B4513" />
              )}
            </View>
            <Text style={styles.planPrice}>
              49,000đ<Text style={styles.planPeriod}>/tháng</Text>
            </Text>
            <View style={styles.planFeatures}>
              <Text style={styles.feature}>✓ Nghe không quảng cáo</Text>
              <Text style={styles.feature}>✓ Tải xuống không giới hạn</Text>
              <Text style={styles.feature}>✓ Chất lượng âm thanh cao</Text>
              <Text style={styles.feature}>✓ Nghe offline mọi lúc</Text>
            </View>
          </TouchableOpacity>

          {/* Yearly Plan - Popular */}
          <TouchableOpacity
            style={[
              styles.planCard,
              styles.popularPlan,
              selectedPlan === "yearly" && styles.selectedPlan,
            ]}
            onPress={() => setSelectedPlan("yearly")}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Tiết kiệm nhất</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Premium Năm</Text>
              {selectedPlan === "yearly" && <Check size={20} color="#8B4513" />}
            </View>
            <Text style={styles.planPrice}>
              399,000đ<Text style={styles.planPeriod}>/năm</Text>
            </Text>
            <Text style={styles.savings}>Tiết kiệm 32% so với gói tháng</Text>
            <View style={styles.planFeatures}>
              <Text style={styles.feature}>✓ Nghe không quảng cáo</Text>
              <Text style={styles.feature}>✓ Tải xuống không giới hạn</Text>
              <Text style={styles.feature}>✓ Chất lượng âm thanh cao</Text>
              <Text style={styles.feature}>✓ Nghe offline mọi lúc</Text>
              <Text style={styles.feature}>✓ Ưu tiên hỗ trợ khách hàng</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.subscribeButton}>
          <Text style={styles.subscribeText}>
            Đăng ký {selectedPlan === "monthly" ? "gói tháng" : "gói năm"}
          </Text>
        </TouchableOpacity>

        <View style={styles.benefits}>
          <Text style={styles.benefitsTitle}>Lợi ích Premium</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🎧</Text>
            <Text style={styles.benefitText}>
              Nghe không quảng cáo, tập trung hoàn toàn vào nội dung
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>📱</Text>
            <Text style={styles.benefitText}>
              Tải xuống và nghe offline, không cần kết nối internet
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🔊</Text>
            <Text style={styles.benefitText}>
              Chất lượng âm thanh cao, trải nghiệm nghe tuyệt vời
            </Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>⭐</Text>
            <Text style={styles.benefitText}>
              Truy cập nội dung Premium độc quyền
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F3",
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B4513",
    marginTop: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#8B6914",
    marginTop: 5,
    textAlign: "center",
  },
  plansContainer: {
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: "#F0E6D2",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#D2B48C",
    position: "relative",
  },
  selectedPlan: {
    borderColor: "#8B4513",
    backgroundColor: "#EDE0CC",
  },
  popularPlan: {
    borderColor: "#8B4513",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    left: 20,
    backgroundColor: "#8B4513",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
  },
  planPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 5,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: "normal",
  },
  savings: {
    color: "#228B22",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
  },
  planFeatures: {
    marginTop: 15,
  },
  feature: {
    fontSize: 14,
    color: "#6B4423",
    marginBottom: 8,
    paddingLeft: 5,
  },
  subscribeButton: {
    backgroundColor: "#8B4513",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  subscribeText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  benefits: {
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 20,
    textAlign: "center",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#F0E6D2",
    padding: 15,
    borderRadius: 12,
  },
  benefitIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: "#6B4423",
    lineHeight: 20,
  },
});
