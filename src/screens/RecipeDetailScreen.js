import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRecipes } from '../context/RecipeContext';
import { StatBadge } from '../components/StatBadge';
import { COLORS, SHADOWS } from '../theme/colors';

export const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipeId } = route.params || {};
  const { getRecipeById, toggleFavorite, isFavorite, deleteRecipe } = useRecipes();

  // Find the recipe in context
  const recipe = getRecipeById(recipeId);

  // Checked ingredients for interactive cooking checklist
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());

  if (!recipe) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={60} color={COLORS.textMuted} />
        <Text style={styles.notFoundTitle}>Recipe Not Found</Text>
        <TouchableOpacity
          style={styles.backBtnFallback}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backBtnFallbackText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isFav = isFavorite(recipe.id);

  const toggleCheckIngredient = (index) => {
    const nextSet = new Set(checkedIngredients);
    if (nextSet.has(index)) {
      nextSet.delete(index);
    } else {
      nextSet.add(index);
    }
    setCheckedIngredients(nextSet);
  };

  const handleEdit = () => {
    navigation.navigate('AddEditRecipe', { recipe });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteRecipe(recipe.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />

          {/* Top Floating Actions: Back and Favorite */}
          <SafeAreaView style={styles.topBar}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              style={[styles.floatingCircleBtn, SHADOWS.medium]}
            >
              <Ionicons name="arrow-back" size={22} color={COLORS.text} />
            </TouchableOpacity>

            <View style={styles.topRightActions}>
              {recipe.isUserRecipe && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleEdit}
                  style={[styles.floatingCircleBtn, SHADOWS.medium, { marginRight: 8 }]}
                >
                  <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleFavorite(recipe.id)}
                style={[styles.floatingCircleBtn, SHADOWS.medium]}
              >
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFav ? COLORS.heart : COLORS.text}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Title on Image */}
          <View style={styles.imageTextContainer}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{recipe.category}</Text>
            </View>
            <Text style={styles.recipeTitle}>{recipe.name}</Text>
          </View>
        </View>

        {/* 6 Mandatory Recipe Specifications */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionHeader}>Recipe Overview</Text>
          <View style={styles.statsGrid}>
            {/* 1. Preparation Time */}
            <StatBadge
              icon="time-outline"
              label="Prep Time"
              value={recipe.prepTime}
              color={COLORS.primary}
            />

            {/* 2. Number of Servings */}
            <StatBadge
              icon="people-outline"
              label="Servings"
              value={recipe.servings}
              color={COLORS.warning}
            />

            {/* 3. Calories */}
            <StatBadge
              icon="flame-outline"
              label="Calories"
              value={recipe.calories}
              color="#E11D48"
            />

            {/* 4. Difficulty Level */}
            <StatBadge
              icon="speedometer-outline"
              label="Difficulty"
              value={recipe.difficulty}
              color={
                recipe.difficulty?.toLowerCase() === 'easy'
                  ? COLORS.success
                  : recipe.difficulty?.toLowerCase() === 'medium'
                  ? COLORS.warning
                  : COLORS.danger
              }
            />

            {/* 5. Ingredients Count */}
            <StatBadge
              icon="basket-outline"
              label="Ingredients"
              value={`${recipe.ingredients?.length || 0} items`}
              color="#0284C7"
            />

            {/* 6. Instructions Steps Count */}
            <StatBadge
              icon="list-outline"
              label="Directions"
              value={`${recipe.instructions?.length || 0} steps`}
              color="#7C3AED"
            />
          </View>
        </View>

        {/* 5. Ingredients Section */}
        <View style={styles.cardSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionLeft}>
              <View style={[styles.sectionIconWrap, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="restaurant-outline" size={20} color="#0284C7" />
              </View>
              <Text style={styles.sectionTitleText}>Ingredients</Text>
            </View>
            <Text style={styles.countBadge}>
              {recipe.ingredients?.length || 0} items
            </Text>
          </View>

          <Text style={styles.tipText}>
            Tap ingredients to check them off as you prepare!
          </Text>

          <View style={styles.ingredientsList}>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((item, index) => {
                const isChecked = checkedIngredients.has(index);
                return (
                  <TouchableOpacity
                    key={`ing-${index}`}
                    activeOpacity={0.7}
                    onPress={() => toggleCheckIngredient(index)}
                    style={[
                      styles.ingredientItem,
                      isChecked && styles.ingredientItemChecked,
                    ]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && styles.checkboxChecked,
                      ]}
                    >
                      {isChecked && (
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.ingredientText,
                        isChecked && styles.ingredientTextChecked,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={styles.emptyNotice}>No ingredients listed.</Text>
            )}
          </View>
        </View>

        {/* 6. Instructions Section */}
        <View style={styles.cardSection}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionLeft}>
              <View style={[styles.sectionIconWrap, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="reader-outline" size={20} color="#7C3AED" />
              </View>
              <Text style={styles.sectionTitleText}>Instructions</Text>
            </View>
            <Text style={styles.countBadge}>
              {recipe.instructions?.length || 0} steps
            </Text>
          </View>

          <View style={styles.instructionsList}>
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((step, index) => (
                <View key={`step-${index}`} style={styles.stepItem}>
                  <View style={styles.stepNumberBadge}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyNotice}>No instructions provided.</Text>
            )}
          </View>
        </View>

        {/* Actions for User Recipe */}
        {recipe.isUserRecipe && (
          <View style={styles.ownerActions}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleEdit}
              style={[styles.ownerBtn, styles.editOwnerBtn]}
            >
              <Ionicons name="create" size={18} color="#FFFFFF" />
              <Text style={styles.ownerBtnText}>Edit This Recipe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDelete}
              style={[styles.ownerBtn, styles.deleteOwnerBtn]}
            >
              <Ionicons name="trash" size={18} color="#FFFFFF" />
              <Text style={styles.ownerBtnText}>Delete Recipe</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 50,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  topBar: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  floatingCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageTextContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  cardSection: {
    backgroundColor: COLORS.surface,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.small,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  countBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 14,
    fontStyle: 'italic',
  },
  ingredientsList: {
    gap: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  ingredientItemChecked: {
    backgroundColor: '#F3F4F6',
    opacity: 0.65,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  ingredientText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  instructionsList: {
    marginTop: 12,
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  stepNumberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 24,
  },
  ownerBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  editOwnerBtn: {
    backgroundColor: COLORS.primary,
  },
  deleteOwnerBtn: {
    backgroundColor: COLORS.danger,
  },
  ownerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyNotice: {
    color: COLORS.textMuted,
    fontStyle: 'italic',
    paddingVertical: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 20,
  },
  backBtnFallback: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnFallbackText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
