import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRecipes } from '../context/RecipeContext';
import { COLORS, SHADOWS } from '../theme/colors';

const CATEGORY_OPTIONS = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Vegetarian',
  'Seafood',
  'Italian',
  'Asian',
  'Salad',
  'Beverages',
  'My Food',
];

const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];

const DEFAULT_FOOD_IMAGE =
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80';

export const AddEditRecipeScreen = ({ route, navigation }) => {
  const { recipe } = route.params || {};
  const isEditing = Boolean(recipe);
  const { addRecipe, updateRecipe } = useRecipes();

  // Form states
  const [name, setName] = useState(recipe?.name || '');
  const [category, setCategory] = useState(recipe?.category || 'Lunch');
  const [imageUri, setImageUri] = useState(recipe?.image || '');
  const [imageUrlInput, setImageUrlInput] = useState(
    recipe?.image && !recipe.image.startsWith('file:') ? recipe.image : ''
  );
  const [prepTime, setPrepTime] = useState(recipe?.prepTime || '25 mins');
  const [servings, setServings] = useState(recipe?.servings || '2 servings');
  const [calories, setCalories] = useState(recipe?.calories || '350 kcal');
  const [difficulty, setDifficulty] = useState(recipe?.difficulty || 'Easy');

  // Dynamic Ingredients list
  const [ingredients, setIngredients] = useState(
    recipe?.ingredients && recipe.ingredients.length > 0
      ? [...recipe.ingredients]
      : ['']
  );

  // Dynamic Instructions list
  const [instructions, setInstructions] = useState(
    recipe?.instructions && recipe.instructions.length > 0
      ? [...recipe.instructions]
      : ['']
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pick image from library via expo-image-picker
  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Needed',
          'Please allow access to your photo library to pick recipe images.'
        );
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const selectedUri = pickerResult.assets[0].uri;
        setImageUri(selectedUri);
        setImageUrlInput(selectedUri);
      }
    } catch (e) {
      console.warn('Image picker error', e);
      Alert.alert('Notice', 'Could not open image picker on this device. You can paste an image URL instead.');
    }
  };

  // Update ingredient row
  const updateIngredient = (text, index) => {
    const list = [...ingredients];
    list[index] = text;
    setIngredients(list);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length <= 1) {
      setIngredients(['']);
      return;
    }
    const list = ingredients.filter((_, i) => i !== index);
    setIngredients(list);
  };

  // Update instruction step
  const updateInstruction = (text, index) => {
    const list = [...instructions];
    list[index] = text;
    setInstructions(list);
  };

  const addInstructionField = () => {
    setInstructions([...instructions, '']);
  };

  const removeInstructionField = (index) => {
    if (instructions.length <= 1) {
      setInstructions(['']);
      return;
    }
    const list = instructions.filter((_, i) => i !== index);
    setInstructions(list);
  };

  // Save handler
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Field', 'Please enter a recipe name.');
      return;
    }

    const cleanIngredients = ingredients
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (cleanIngredients.length === 0) {
      Alert.alert('Missing Field', 'Please add at least one ingredient.');
      return;
    }

    const cleanInstructions = instructions
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    if (cleanInstructions.length === 0) {
      Alert.alert('Missing Field', 'Please add at least one instruction step.');
      return;
    }

    const finalImage =
      imageUri.trim() || imageUrlInput.trim() || DEFAULT_FOOD_IMAGE;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateRecipe({
          ...recipe,
          name: name.trim(),
          category,
          image: finalImage,
          prepTime: prepTime.trim() || '20 mins',
          servings: servings.trim() || '2 servings',
          calories: calories.trim() || '350 kcal',
          difficulty,
          ingredients: cleanIngredients,
          instructions: cleanInstructions,
        });
        Alert.alert('Success', 'Recipe updated successfully!');
      } else {
        await addRecipe({
          name: name.trim(),
          category,
          image: finalImage,
          prepTime: prepTime.trim() || '20 mins',
          servings: servings.trim() || '2 servings',
          calories: calories.trim() || '350 kcal',
          difficulty,
          ingredients: cleanIngredients,
          instructions: cleanInstructions,
        });
        Alert.alert('Success', 'Recipe added to your kitchen!');
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewImage =
    imageUri.trim() || imageUrlInput.trim() || DEFAULT_FOOD_IMAGE;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Recipe' : 'Add New Recipe'}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isSubmitting}
            style={[styles.saveHeaderBtn, isSubmitting && { opacity: 0.5 }]}
          >
            <Text style={styles.saveHeaderBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Recipe Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Recipe Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Grandma's Secret Apple Pie"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* 2. Image Upload & URL */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Recipe Image <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: previewImage }} style={styles.imagePreview} />
              <View style={styles.imageOverlayActions}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handlePickImage}
                  style={styles.pickImageBtn}
                >
                  <Ionicons name="camera" size={18} color="#FFFFFF" />
                  <Text style={styles.pickImageBtnText}>Choose Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Fallback Image URL Input */}
            <View style={styles.urlInputRow}>
              <Ionicons name="link-outline" size={18} color={COLORS.textSecondary} />
              <TextInput
                style={styles.urlTextInput}
                placeholder="Or paste image URL (Unsplash, etc.)"
                placeholderTextColor={COLORS.textMuted}
                value={imageUrlInput}
                onChangeText={(text) => {
                  setImageUrlInput(text);
                  setImageUri(text);
                }}
              />
            </View>
          </View>

          {/* Category Picker */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryChips}
            >
              {CATEGORY_OPTIONS.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    style={[
                      styles.chip,
                      isSelected ? styles.chipActive : styles.chipInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected ? styles.chipTextActive : styles.chipTextInactive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Quick Specifications: Prep Time, Servings, Calories, Difficulty */}
          <View style={styles.statsRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Prep Time</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="e.g. 25 mins"
                placeholderTextColor={COLORS.textMuted}
                value={prepTime}
                onChangeText={setPrepTime}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Servings</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="e.g. 4 servings"
                placeholderTextColor={COLORS.textMuted}
                value={servings}
                onChangeText={setServings}
              />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Calories</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="e.g. 450 kcal"
                placeholderTextColor={COLORS.textMuted}
                value={calories}
                onChangeText={setCalories}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.difficultyRow}>
                {DIFFICULTY_OPTIONS.map((diff) => {
                  const isSelected = difficulty === diff;
                  return (
                    <TouchableOpacity
                      key={diff}
                      onPress={() => setDifficulty(diff)}
                      style={[
                        styles.diffChip,
                        isSelected && styles.diffChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.diffChipText,
                          isSelected && styles.diffChipTextActive,
                        ]}
                      >
                        {diff}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* 3. Ingredients List */}
          <View style={styles.formGroup}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.label}>
                Ingredients <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                onPress={addIngredientField}
                style={styles.addItemBtn}
              >
                <Ionicons name="add-circle" size={18} color={COLORS.primary} />
                <Text style={styles.addItemBtnText}>Add Ingredient</Text>
              </TouchableOpacity>
            </View>

            {ingredients.map((item, index) => (
              <View key={`ing-${index}`} style={styles.dynamicRow}>
                <View style={styles.dotIndicator} />
                <TextInput
                  style={styles.dynamicInput}
                  placeholder={`Ingredient #${index + 1} (e.g. 200g Fresh Flour)`}
                  placeholderTextColor={COLORS.textMuted}
                  value={item}
                  onChangeText={(text) => updateIngredient(text, index)}
                />
                <TouchableOpacity
                  onPress={() => removeIngredientField(index)}
                  style={styles.removeRowBtn}
                >
                  <Ionicons name="close-circle-outline" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* 4. Step-by-Step Instructions */}
          <View style={styles.formGroup}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.label}>
                Instructions <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                onPress={addInstructionField}
                style={styles.addItemBtn}
              >
                <Ionicons name="add-circle" size={18} color={COLORS.primary} />
                <Text style={styles.addItemBtnText}>Add Step</Text>
              </TouchableOpacity>
            </View>

            {instructions.map((step, index) => (
              <View key={`inst-${index}`} style={styles.stepDynamicRow}>
                <View style={styles.stepNumWrap}>
                  <Text style={styles.stepNum}>{index + 1}</Text>
                </View>
                <TextInput
                  style={[styles.dynamicInput, styles.multilineStep]}
                  placeholder={`Step ${index + 1} instructions...`}
                  placeholderTextColor={COLORS.textMuted}
                  value={step}
                  onChangeText={(text) => updateInstruction(text, index)}
                  multiline
                />
                <TouchableOpacity
                  onPress={() => removeInstructionField(index)}
                  style={styles.removeRowBtn}
                >
                  <Ionicons name="close-circle-outline" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Big Bottom Save Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={isSubmitting}
            style={[styles.bottomSaveBtn, SHADOWS.large, isSubmitting && { opacity: 0.6 }]}
          >
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            <Text style={styles.bottomSaveBtnText}>
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Save Changes'
                : 'Save Recipe to My Food'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  saveHeaderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 12,
  },
  saveHeaderBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  required: {
    color: COLORS.danger,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    fontSize: 15,
    color: COLORS.text,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.borderLight,
    marginBottom: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imageOverlayActions: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  pickImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pickImageBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  urlInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 8,
  },
  urlTextInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },
  categoryChips: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipInactive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.borderLight,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextInactive: {
    color: COLORS.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  smallInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    fontSize: 14,
    color: COLORS.text,
  },
  difficultyRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    height: 44,
    alignItems: 'center',
  },
  diffChip: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
  },
  diffChipActive: {
    backgroundColor: COLORS.primary,
  },
  diffChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  diffChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addItemBtnText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  dynamicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  stepDynamicRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  stepNumWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  stepNum: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  dynamicInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    fontSize: 14,
    color: COLORS.text,
  },
  multilineStep: {
    minHeight: 64,
    height: 'auto',
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  removeRowBtn: {
    padding: 6,
  },
  bottomSaveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 10,
  },
  bottomSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
