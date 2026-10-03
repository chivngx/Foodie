import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecipes } from '../context/RecipeContext';
import { Header } from '../components/Header';
import { CategoryBar } from '../components/CategoryBar';
import { RecipeCard } from '../components/RecipeCard';
import { MyRecipeCard } from '../components/MyRecipeCard';
import { COLORS, SHADOWS } from '../theme/colors';

export const HomeScreen = ({ navigation }) => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredFeedRecipes,
    toggleFavorite,
    isFavorite,
    deleteRecipe,
  } = useRecipes();

  const isMyFoodActive = selectedCategory === 'my_food';

  const handleRecipePress = (recipe) => {
    navigation.navigate('RecipeDetail', { recipeId: recipe.id });
  };

  const handleAddNewRecipe = () => {
    navigation.navigate('AddEditRecipe', {});
  };

  const handleEditRecipe = (recipe) => {
    navigation.navigate('AddEditRecipe', { recipe });
  };

  const renderHeader = () => (
    <View>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
      />

      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Prominent banner & Add Button when "My Food" is active */}
      {isMyFoodActive ? (
        <View style={styles.myFoodSection}>
          <View style={styles.myFoodHeader}>
            <View>
              <Text style={styles.sectionTitle}>My Custom Recipes</Text>
              <Text style={styles.sectionSubtitle}>
                {filteredFeedRecipes.length} dish{filteredFeedRecipes.length !== 1 ? 'es' : ''} created
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAddNewRecipe}
              style={[styles.addBtnSmall, SHADOWS.medium]}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.addBtnSmallText}>Add New Recipe</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.feedHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedCategory === 'all'
              ? 'Popular Recipes'
              : `${categories.find((c) => c.id === selectedCategory)?.name || ''} Recipes`}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {filteredFeedRecipes.length} recipe{filteredFeedRecipes.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons
          name={isMyFoodActive ? 'restaurant-outline' : 'search-outline'}
          size={42}
          color={COLORS.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>
        {isMyFoodActive
          ? 'No personal recipes yet'
          : searchQuery
          ? 'No recipes found'
          : 'No recipes in this category'}
      </Text>
      <Text style={styles.emptyText}>
        {isMyFoodActive
          ? 'Tap the button below to add your first delicious secret culinary recipe!'
          : searchQuery
          ? 'Try searching with a different term or keyword.'
          : 'Try selecting another category from the list above.'}
      </Text>
      {isMyFoodActive && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAddNewRecipe}
          style={[styles.primaryAddBtn, SHADOWS.large]}
        >
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <Text style={styles.primaryAddBtnText}>Add New Recipe</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <FlatList
        data={filteredFeedRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          item.isUserRecipe && isMyFoodActive ? (
            <MyRecipeCard
              recipe={item}
              onPress={handleRecipePress}
              onEdit={handleEditRecipe}
              onDelete={deleteRecipe}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite(item.id)}
            />
          ) : (
            <RecipeCard
              recipe={item}
              onPress={handleRecipePress}
              onToggleFavorite={toggleFavorite}
              isFavorite={isFavorite(item.id)}
            />
          )
        }
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
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  feedHeader: {
    marginTop: 14,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  myFoodSection: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: COLORS.accentLight,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  myFoodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  addBtnSmallText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  primaryAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 16,
  },
  primaryAddBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
