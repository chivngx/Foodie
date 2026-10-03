import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';

export const CategoryBar = ({ categories, selectedCategory, onSelectCategory }) => {
  const renderItem = ({ item }) => {
    const isSelected = selectedCategory === item.id;
    const isMyFood = item.id === 'my_food';

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelectCategory(item.id)}
        style={[
          styles.categoryPill,
          isSelected ? styles.categoryPillActive : styles.categoryPillInactive,
          isMyFood && !isSelected && styles.myFoodPill,
          isSelected && SHADOWS.medium,
        ]}
      >
        <Ionicons
          name={item.icon || 'restaurant-outline'}
          size={16}
          color={isSelected ? '#FFFFFF' : isMyFood ? COLORS.primary : COLORS.textSecondary}
          style={styles.icon}
        />
        <Text
          style={[
            styles.categoryText,
            isSelected ? styles.categoryTextActive : styles.categoryTextInactive,
            isMyFood && !isSelected && styles.myFoodText,
          ]}
        >
          {item.name}
        </Text>
        {isMyFood && (
          <View style={[styles.starBadge, isSelected && { backgroundColor: '#FFFFFF' }]}>
            <Ionicons
              name="sparkles"
              size={10}
              color={isSelected ? COLORS.primary : '#FFFFFF'}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillInactive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.borderLight,
  },
  myFoodPill: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  icon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  categoryTextInactive: {
    color: COLORS.textSecondary,
  },
  myFoodText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  starBadge: {
    marginLeft: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
