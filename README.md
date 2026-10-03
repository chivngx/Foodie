# Foodie 🍳 - Recipe Browser & Manager Mobile App

Ứng dụng mobile **Foodie** được xây dựng hoàn chỉnh bằng **React Native / Expo SDK 51**, hỗ trợ 100% khi chạy trên **Expo Go** và **Expo Snack**.

---

## 🌟 Tính Năng Nổi Bật

### 1. Categories Bar (Cuộn ngang)
- Hiển thị đầy đủ **12 danh mục**: `All`, `Breakfast`, `Lunch`, `Dinner`, `Dessert`, `Vegetarian`, `Seafood`, `Italian`, `Asian`, `Salad`, `Beverages`, và mục đặc biệt `My Food`.
- Lọc tức thì danh sách công thức theo từng danh mục.
- Khi chọn **"My Food"**, giao diện lập tức chuyển sang chế độ quản lý món ăn cá nhân với nút **"Add New Recipe"** nổi bật.

### 2. Main Feed & Recipe List
- Thẻ món ăn (Card) hiện đại với ảnh chất lượng cao từ Unsplash, thời gian chuẩn bị, độ khó, lượng calo và huy hiệu danh mục.
- **Nút Heart Icon**: Thêm/Hủy yêu thích tức thì và lưu trữ vĩnh viễn trên thiết bị (`AsyncStorage`).
- Thanh tìm kiếm tích hợp: Tìm kiếm món ăn theo tên hoặc theo nguyên liệu.

### 3. Recipe Detail (Chi tiết công thức)
- Nút **Back** chuẩn, hoạt động mượt mà.
- Nút **Favorite (Heart)** trên header để toggle yêu thích.
- **Hiển thị đầy đủ 6 thông số bắt buộc**:
  1. 🥗 **Nguyên liệu (Ingredients)**: Hỗ trợ tích chọn (checklist tương tác) để người dùng đánh dấu khi đang nấu.
  2. 📝 **Các bước hướng dẫn (Instructions)**: Từng bước đánh số trực quan, rõ ràng.
  3. ⏱️ **Thời gian chuẩn bị (Preparation time)** (ví dụ: "25 mins")
  4. 👥 **Khẩu phần ăn (Servings)** (ví dụ: "4 servings")
  5. 🔥 **Lượng calo (Calories)** (ví dụ: "350 kcal")
  6. ⚡ **Độ khó (Difficulty level)** ("Easy" | "Medium" | "Hard")
- Đối với món tự tạo: Cung cấp trực tiếp 2 nút **Edit** và **Delete** ngay tại màn hình chi tiết.

### 4. Favorites Screen (Mục yêu thích)
- Quản lý danh sách các món ăn đã đánh dấu yêu thích (cả món có sẵn và món tự tạo).
- Cho phép toggle bỏ yêu thích trực tiếp ngay tại danh sách.
- Hỗ trợ thanh tìm kiếm trong danh sách yêu thích và empty state sinh động.

### 5. Quản Lý Món Tự Tạo (My Food / My Recipes)
- **Nút "Add New Recipe"**: Nổi bật tại thanh danh mục và tab "My Food".
- **Form Add / Edit Recipe** hỗ trợ:
  - Tên món ăn (Recipe name)
  - Tải ảnh lên (`expo-image-picker`) hoặc nhập URL ảnh dự phòng
  - Danh sách nguyên liệu linh hoạt: Thêm từng dòng hoặc xóa từng dòng
  - Hướng dẫn từng bước linh hoạt: Thêm từng bước hoặc xóa từng bước
  - Các thông số mở rộng: Danh mục, thời gian, khẩu phần, calo, độ khó.
  - Nút **"Save Recipe"** lưu dữ liệu vào `AsyncStorage`.
- **Danh sách "My Recipes"**:
  - Tự động cập nhật ngay lập tức sau khi lưu.
  - Mỗi món hiển thị card gồm tên, ảnh và bắt buộc 2 nút:
    - **"Edit"**: Mở lại form điền sẵn dữ liệu để chỉnh sửa.
    - **"Delete"**: Xóa món ăn khỏi danh sách (có popup Alert xác nhận).

---

## 📁 Cấu Trúc Thư Mục (Clean Architecture)

```
Foodie/
├── App.js                         # Root component (SafeAreaProvider, RecipeProvider, AppNavigator)
├── app.json                       # Cấu hình Expo
├── package.json                   # Dependencies tương thích Expo SDK 51 & Snack
├── README.md                      # Tài liệu hướng dẫn
└── src/
    ├── theme/
    │   └── colors.js              # Bảng màu, shadow, typography
    ├── data/
    │   └── mockData.js            # Dữ liệu danh mục & 8 công thức chuẩn
    ├── context/
    │   └── RecipeContext.js       # Quản lý State tập trung & AsyncStorage CRUD
    ├── components/
    │   ├── Header.js              # Logo, lời chào & thanh Search
    │   ├── CategoryBar.js         # Thanh cuộn ngang danh mục & My Food
    │   ├── RecipeCard.js          # Card món ăn feed chính & Heart toggle
    │   ├── MyRecipeCard.js        # Card món tự tạo kèm nút Edit / Delete
    │   └── StatBadge.js           # Huy hiệu 6 thông số bắt buộc
    ├── screens/
    │   ├── HomeScreen.js          # Màn hình chính & lọc danh mục
    │   ├── RecipeDetailScreen.js  # Màn hình chi tiết công thức 6 thông số
    │   ├── FavoritesScreen.js     # Màn hình yêu thích
    │   ├── MyFoodScreen.js        # Màn hình quản lý món cá nhân (My Recipes)
    │   └── AddEditRecipeScreen.js # Form tạo / sửa công thức nấu ăn
    └── navigation/
        └── AppNavigator.js        # Bottom Tabs (Home, My Food, Favorites) + Stack
```

---

## 🚀 Hướng Dẫn Chạy Ứng Dụng

### Chạy trên máy cục bộ với Expo Go:
```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi động dự án
npx expo start
```
Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại iOS / Android.

### Sử dụng trên Expo Snack (https://snack.expo.dev):
1. Mở [Expo Snack](https://snack.expo.dev).
2. Tạo các file tương ứng trong cấu trúc thư mục hoặc tải thư mục dự án lên Snack.
3. Trong tab **Package.json** trên Snack, kiểm tra các package:
   - `@react-navigation/native`
   - `@react-navigation/native-stack`
   - `@react-navigation/bottom-tabs`
   - `react-native-screens`
   - `react-native-safe-area-context`
   - `@expo/vector-icons`
   - `@react-native-async-storage/async-storage`
   - `expo-image-picker`
