import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';

export const MyRecipeCard = ({ recipe, onPress, onEdit, onDelete, onToggleFavorite, isFavorite }) => {
  const handleDeletePress = () => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(recipe.id),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
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
          <Text style={styles.categoryBadgeText}>{recipe.category || 'My Food'}</Text>
        </View>

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

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {recipe.name}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{recipe.prepTime || '20 mins'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="restaurant-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{recipe.servings || '2 servings'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="flame-outline" size={13} color={COLORS.primary} />
            <Text style={styles.infoText}>{recipe.calories || '350 kcal'}</Text>
          </View>
        </View>

        <View style={styles.actionDivider} />

        {/* 2 mandatory buttons: Edit and Delete */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onEdit(recipe)}
            style={[styles.actionBtn, styles.editBtn]}
          >
            <Ionicons name="create-outline" size={16} color={COLORS.primary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleDeletePress}
            style={[styles.actionBtn, styles.deleteBtn]}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  imageContainer: {
    width: '100%',
    height: 160,
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
    borderRadius: 10,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
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
  body: {
    padding: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  actionDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  editBtn: {
    backgroundColor: COLORS.primaryLight,
  },
  editBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: COLORS.dangerLight,
  },
  deleteBtnText: {
    color: COLORS.danger,
    fontWeight: '700',
    fontSize: 13,
  },
});
