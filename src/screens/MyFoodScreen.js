import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecipes } from '../context/RecipeContext';
import { MyRecipeCard } from '../components/MyRecipeCard';
import { COLORS, SHADOWS } from '../theme/colors';

export const MyFoodScreen = ({ navigation }) => {
  const { userRecipes, deleteRecipe, toggleFavorite, isFavorite } = useRecipes();

  const handleAddNew = () => {
    navigation.navigate('AddEditRecipe', {});
  };

  const handleEdit = (recipe) => {
    navigation.navigate('AddEditRecipe', { recipe });
  };

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetail', { recipeId: recipe.id });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>My Kitchen</Text>
          <Text style={styles.subtitle}>
            {userRecipes.length} custom recipe{userRecipes.length !== 1 ? 's' : ''} created
          </Text>
        </View>

        {/* Prominent Add New Recipe Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAddNew}
          style={[styles.addNewBtn, SHADOWS.medium]}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addNewBtnText}>Add Recipe</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bannerCard}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Chef's Note 📝</Text>
          <Text style={styles.bannerText}>
            Store your family secrets, experimental recipes, and favorite homemade snacks in one place!
          </Text>
        </View>
        <View style={styles.chefHatWrap}>
          <Ionicons name="restaurant" size={32} color={COLORS.primary} />
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="book-outline" size={48} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>Your Cookbook is Empty</Text>
      <Text style={styles.emptyText}>
        You haven't added any custom recipes yet. Tap the button below to create your very first masterpiece!
      </Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleAddNew}
        style={[styles.bigCreateBtn, SHADOWS.large]}
      >
        <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
        <Text style={styles.bigCreateBtnText}>Create Your First Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <FlatList
        data={userRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MyRecipeCard
            recipe={item}
            onPress={handleRecipePress}
            onEdit={handleEdit}
            onDelete={deleteRecipe}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 12,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
  },
  addNewBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  bannerCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.accentLight,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
    paddingRight: 10,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.secondary,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  chefHatWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 26,
  },
  bigCreateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8,
  },
  bigCreateBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
