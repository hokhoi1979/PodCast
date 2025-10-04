import {
  CircleHelp as HelpCircle,
  Settings,
  ShoppingCart,
  User,
  UserCheck,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

export default function ProfileScreen() {
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const navigation = useNavigation();

  const openOrderModal = () => {
    setIsOrderModalVisible(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>PodcastVN</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <User size={40} color="#8B4513" />
          </View>
          <Text style={styles.userName}>Nguyễn Văn A</Text>
          <Text style={styles.userEmail}>user@example.com</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Thống kê</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Podcast đã nghe</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>156h</Text>
              <Text style={styles.statLabel}>Thời gian nghe</Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={openOrderModal}>
            <ShoppingCart size={20} color="#8B4513" />
            <Text style={styles.menuText}>Đơn hàng của tôi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <UserCheck size={20} color="#8B4513" />
            <Text style={styles.menuText}>Chế độ Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Settings size={20} color="#8B4513" />
            <Text style={styles.menuText}>Cài đặt</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle size={20} color="#8B4513" />
            <Text style={styles.menuText}>Hỗ trợ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Orders Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOrderModalVisible}
        onRequestClose={closeOrderModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Đơn hàng của tôi</Text>
              <TouchableOpacity
                onPress={closeOrderModal}
                style={styles.closeButton}
              >
                <X size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>

            {/* Modal Content */}
            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Order Card */}
              <View style={styles.orderCard}>
                {/* Order Header */}
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderNumber}>Đơn hàng #PV123456</Text>
                    <Text style={styles.orderDate}>15/1/2024 • MoMo</Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusText}>Hoàn thành</Text>
                  </View>
                </View>

                {/* Product Info */}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>Premium Năm</Text>
                  <Text style={styles.productDetails}>
                    Số lượng: 1 • 399,000đ
                  </Text>
                </View>

                {/* Total */}
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Tổng cộng:</Text>
                  <Text style={styles.totalAmount}>399,000đ</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Chi tiết</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Đặt lại</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.ratingButton]}
                  >
                    <Text
                      style={[styles.actionButtonText, styles.ratingButtonText]}
                    >
                      Đánh giá
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Order Status Progress */}
                <View style={styles.progressSection}>
                  <Text style={styles.progressTitle}>Trạng thái đơn hàng</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressStep}>
                      <View
                        style={[
                          styles.progressDot,
                          styles.progressDotCompleted,
                        ]}
                      />
                      <Text style={styles.progressLabel}>Đặt hàng</Text>
                    </View>
                    <View
                      style={[
                        styles.progressLine,
                        styles.progressLineCompleted,
                      ]}
                    />
                    <View style={styles.progressStep}>
                      <View
                        style={[
                          styles.progressDot,
                          styles.progressDotCompleted,
                        ]}
                      />
                      <Text style={styles.progressLabel}>Xử lý</Text>
                    </View>
                    <View
                      style={[
                        styles.progressLine,
                        styles.progressLineCompleted,
                      ]}
                    />
                    <View style={styles.progressStep}>
                      <View
                        style={[
                          styles.progressDot,
                          styles.progressDotCompleted,
                        ]}
                      />
                      <Text style={styles.progressLabel}>Hoàn thành</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F3",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#F5F5DC",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5DC",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5DC",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8DCC0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D2B48C",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#8B6914",
  },
  statsSection: {
    backgroundColor: "#E8DCC0",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#8B6914",
    textAlign: "center",
  },
  menuSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5DC",
  },
  menuText: {
    fontSize: 16,
    color: "#8B4513",
    marginLeft: 15,
    fontWeight: "400",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#F5F5DC",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    minHeight: height * 0.7,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5DC",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B4513",
  },
  closeButton: {
    padding: 5,
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E5DC",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: "#8B6914",
  },
  statusContainer: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
  productInfo: {
    marginBottom: 15,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B4513",
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 14,
    color: "#8B6914",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E5DC",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B4513",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B4513",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#F5F5DC",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#D2B48C",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    color: "#8B4513",
    fontWeight: "500",
  },
  ratingButton: {
    backgroundColor: "#E8DCC0",
  },
  ratingButtonText: {
    color: "#8B4513",
    fontWeight: "600",
  },
  progressSection: {
    marginTop: 10,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B4513",
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D2B48C",
    marginBottom: 8,
  },
  progressDotCompleted: {
    backgroundColor: "#8B4513",
  },
  progressLine: {
    height: 2,
    backgroundColor: "#D2B48C",
    flex: 1,
    marginHorizontal: 10,
  },
  progressLineCompleted: {
    backgroundColor: "#8B4513",
  },
  progressLabel: {
    fontSize: 12,
    color: "#8B6914",
    textAlign: "center",
  },
});
