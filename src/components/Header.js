import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';

export const Header = ({ searchQuery, onSearchChange, onClearSearch }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <View style={styles.brandRow}>
            <Text style={styles.logoText}>Foodie</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Pro Chef</Text>
            </View>
          </View>
          <Text style={styles.subTitle}>What delicious dish will you cook today?</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Ionicons name="restaurant" size={20} color="#FFFFFF" />
        </View>
      </View>

      <View style={[styles.searchBar, SHADOWS.small]}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          placeholder="Search recipes, ingredients..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          style={styles.searchInput}
          returnKeyType="search"
        />
        {searchQuery?.length > 0 && (
          <TouchableOpacity onPress={onClearSearch} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: COLORS.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.warning,
  },
  subTitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
});
