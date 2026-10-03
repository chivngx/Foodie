import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_RECIPES, CATEGORIES } from '../data/mockData';

const FAVORITES_KEY = '@foodie_favorites_v1';
const USER_RECIPES_KEY = '@foodie_user_recipes_v1';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [userRecipes, setUserRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites & user recipes from AsyncStorage on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedFavs, storedUserRecipes] = await Promise.all([
        AsyncStorage.getItem(FAVORITES_KEY),
        AsyncStorage.getItem(USER_RECIPES_KEY),
      ]);

      if (storedFavs !== null) {
        setFavoriteIds(new Set(JSON.parse(storedFavs)));
      } else {
        // Initialize with default favorite items from mock data
        const initialFavs = INITIAL_RECIPES.filter(r => r.isFavorite).map(r => r.id);
        setFavoriteIds(new Set(initialFavs));
      }

      if (storedUserRecipes !== null) {
        setUserRecipes(JSON.parse(storedUserRecipes));
      }
    } catch (e) {
      console.error('Error loading data from AsyncStorage', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (recipeId) => {
    try {
      const newFavSet = new Set(favoriteIds);
      if (newFavSet.has(recipeId)) {
        newFavSet.delete(recipeId);
      } else {
        newFavSet.add(recipeId);
      }
      setFavoriteIds(newFavSet);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavSet)));
    } catch (e) {
      console.error('Error toggling favorite', e);
    }
  };

  // Add new recipe (My Food)
  const addRecipe = async (recipeData) => {
    try {
      const newRecipe = {
        id: `user_${Date.now()}`,
        name: recipeData.name?.trim() || 'Untitled Recipe',
        category: recipeData.category || 'Lunch',
        image: recipeData.image?.trim() || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
        prepTime: recipeData.prepTime?.trim() || '20 mins',
        servings: recipeData.servings?.trim() || '2 servings',
        calories: recipeData.calories?.trim() || '350 kcal',
        difficulty: recipeData.difficulty || 'Easy',
        ingredients: Array.isArray(recipeData.ingredients)
          ? recipeData.ingredients.filter(i => i && i.trim().length > 0)
          : [],
        instructions: Array.isArray(recipeData.instructions)
          ? recipeData.instructions.filter(i => i && i.trim().length > 0)
          : [],
        isUserRecipe: true,
        createdAt: new Date().toISOString(),
      };

      const updatedUserRecipes = [newRecipe, ...userRecipes];
      setUserRecipes(updatedUserRecipes);
      await AsyncStorage.setItem(USER_RECIPES_KEY, JSON.stringify(updatedUserRecipes));
      return newRecipe;
    } catch (e) {
      console.error('Error adding recipe', e);
      throw e;
    }
  };

  // Update existing recipe
  const updateRecipe = async (updatedData) => {
    try {
      const updatedUserRecipes = userRecipes.map(recipe => {
        if (recipe.id === updatedData.id) {
          return {
            ...recipe,
            ...updatedData,
            name: updatedData.name?.trim() || recipe.name,
            ingredients: Array.isArray(updatedData.ingredients)
              ? updatedData.ingredients.filter(i => i && i.trim().length > 0)
              : recipe.ingredients,
            instructions: Array.isArray(updatedData.instructions)
              ? updatedData.instructions.filter(i => i && i.trim().length > 0)
              : recipe.instructions,
            updatedAt: new Date().toISOString(),
          };
        }
        return recipe;
      });

      setUserRecipes(updatedUserRecipes);
      await AsyncStorage.setItem(USER_RECIPES_KEY, JSON.stringify(updatedUserRecipes));
      return true;
    } catch (e) {
      console.error('Error updating recipe', e);
      throw e;
    }
  };

  // Delete recipe
  const deleteRecipe = async (recipeId) => {
    try {
      const updatedUserRecipes = userRecipes.filter(r => r.id !== recipeId);
      setUserRecipes(updatedUserRecipes);
      await AsyncStorage.setItem(USER_RECIPES_KEY, JSON.stringify(updatedUserRecipes));

      if (favoriteIds.has(recipeId)) {
        const newFavSet = new Set(favoriteIds);
        newFavSet.delete(recipeId);
        setFavoriteIds(newFavSet);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavSet)));
      }
      return true;
    } catch (e) {
      console.error('Error deleting recipe', e);
      throw e;
    }
  };

  // All combined recipes with current favorite status
  const allRecipes = useMemo(() => {
    const list = [...userRecipes, ...INITIAL_RECIPES];
    return list.map(item => ({
      ...item,
      isFavorite: favoriteIds.has(item.id),
    }));
  }, [userRecipes, favoriteIds]);

  // Favorite recipes only
  const favoriteRecipes = useMemo(() => {
    return allRecipes.filter(r => favoriteIds.has(r.id));
  }, [allRecipes, favoriteIds]);

  // Filtered recipes for Main Feed
  const filteredFeedRecipes = useMemo(() => {
    let result = allRecipes;

    // Filter by category
    if (selectedCategory === 'my_food') {
      result = result.filter(r => r.isUserRecipe);
    } else if (selectedCategory !== 'all') {
      const catObj = CATEGORIES.find(c => c.id === selectedCategory);
      const catName = catObj ? catObj.name.toLowerCase() : selectedCategory.toLowerCase();
      result = result.filter(r => r.category?.toLowerCase() === catName);
    }

    // Filter by search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => {
        const matchName = r.name?.toLowerCase().includes(q);
        const matchCategory = r.category?.toLowerCase().includes(q);
        const matchIngredients = r.ingredients?.some(ing => ing.toLowerCase().includes(q));
        return matchName || matchCategory || matchIngredients;
      });
    }

    return result;
  }, [allRecipes, selectedCategory, searchQuery]);

  // Helper to find single recipe by ID
  const getRecipeById = (id) => {
    return allRecipes.find(r => r.id === id);
  };

  const isFavorite = (id) => favoriteIds.has(id);

  return (
    <RecipeContext.Provider
      value={{
        categories: CATEGORIES,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        allRecipes,
        userRecipes,
        favoriteRecipes,
        filteredFeedRecipes,
        toggleFavorite,
        isFavorite,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        getRecipeById,
        isLoading,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};
