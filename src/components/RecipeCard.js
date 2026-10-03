import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';

export const RecipeCard = ({ recipe, onPress, onToggleFavorite, isFavorite }) => {
  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return { bg: COLORS.successLight, text: COLORS.success };
      case 'medium':
        return { bg: COLORS.warningLight, text: COLORS.warning };
      case 'hard':
        return { bg: COLORS.dangerLight, text: COLORS.danger };
      default:
        return { bg: COLORS.borderLight, text: COLORS.textSecondary };
    }
  };

  const diffStyle = getDifficultyColor(recipe.difficulty);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(recipe)}
      style={[styles.card, SHADOWS.medium]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{recipe.category}</Text>
        </View>

        {recipe.isUserRecipe && (
          <View style={styles.userRecipeBadge}>
            <Ionicons name="person" size={10} color="#FFFFFF" />
            <Text style={styles.userRecipeBadgeText}>My Recipe</Text>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onToggleFavorite(recipe.id)}
          style={[styles.favoriteBtn, SHADOWS.small]}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? COLORS.heart : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.name}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{recipe.prepTime}</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="flame-outline" size={14} color={COLORS.primary} />
            <Text style={styles.metaText}>{recipe.calories}</Text>
          </View>

          <View style={[styles.difficultyBadge, { backgroundColor: diffStyle.bg }]}>
            <Text style={[styles.difficultyText, { color: diffStyle.text }]}>
              {recipe.difficulty}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: COLORS.borderLight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(28, 30, 33, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  userRecipeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  userRecipeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
