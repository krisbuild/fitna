import { FoodItem } from "@/lib/types";

// Approximate values per stated serving — a starting reference database.
// In production this is backed by the `foods` table and can be extended
// per region/cuisine pack without touching app code.
export const FOODS: FoodItem[] = [
  { id: "jollof-rice", name: "Jollof Rice", category: "Rice & Grains", region: "Nationwide", servingLabel: "1 cup", servingGrams: 200, calories: 350, proteinG: 7, carbsG: 55, fatG: 10, fiberG: 2 },
  { id: "white-rice-stew", name: "White Rice & Stew", category: "Rice & Grains", region: "Nationwide", servingLabel: "1 plate", servingGrams: 300, calories: 480, proteinG: 10, carbsG: 70, fatG: 16 },
  { id: "fried-rice", name: "Nigerian Fried Rice", category: "Rice & Grains", region: "Nationwide", servingLabel: "1 plate", servingGrams: 250, calories: 420, proteinG: 10, carbsG: 60, fatG: 14 },
  { id: "ofada-ayamase", name: "Ofada Rice & Ayamase", category: "Rice & Grains", region: "South West", servingLabel: "1 plate", servingGrams: 300, calories: 520, proteinG: 14, carbsG: 62, fatG: 24 },
  { id: "eba", name: "Eba", nameLocal: "Garri", category: "Swallow", region: "Nationwide", servingLabel: "1 wrap", servingGrams: 200, calories: 300, proteinG: 1, carbsG: 72, fatG: 0.5, fiberG: 2 },
  { id: "amala", name: "Amala", category: "Swallow", region: "South West", servingLabel: "1 wrap", servingGrams: 200, calories: 260, proteinG: 2, carbsG: 60, fatG: 0.5 },
  { id: "pounded-yam", name: "Pounded Yam", category: "Swallow", region: "Nationwide", servingLabel: "1 wrap", servingGrams: 250, calories: 340, proteinG: 3, carbsG: 78, fatG: 0.3 },
  { id: "fufu", name: "Fufu", category: "Swallow", region: "South South / South East", servingLabel: "1 wrap", servingGrams: 200, calories: 280, proteinG: 1.5, carbsG: 68, fatG: 0.3 },
  { id: "egusi-soup", name: "Egusi Soup", category: "Soup", region: "Nationwide", servingLabel: "1 bowl", servingGrams: 250, calories: 420, proteinG: 18, carbsG: 10, fatG: 34 },
  { id: "efo-riro", name: "Efo Riro", category: "Soup", region: "South West", servingLabel: "1 bowl", servingGrams: 250, calories: 260, proteinG: 12, carbsG: 8, fatG: 20 },
  { id: "okra-soup", name: "Okra Soup", category: "Soup", region: "Nationwide", servingLabel: "1 bowl", servingGrams: 250, calories: 220, proteinG: 14, carbsG: 9, fatG: 14 },
  { id: "ogbono-soup", name: "Ogbono Soup", category: "Soup", region: "South East / South South", servingLabel: "1 bowl", servingGrams: 250, calories: 380, proteinG: 16, carbsG: 8, fatG: 30 },
  { id: "ewedu-soup", name: "Ewedu Soup", category: "Soup", region: "South West", servingLabel: "1 bowl", servingGrams: 200, calories: 120, proteinG: 6, carbsG: 8, fatG: 7 },
  { id: "pepper-soup", name: "Pepper Soup (Goat Meat)", category: "Soup", region: "Nationwide", servingLabel: "1 bowl", servingGrams: 350, calories: 300, proteinG: 30, carbsG: 6, fatG: 18 },
  { id: "fish-stew", name: "Fish Stew (Titus)", category: "Soup", region: "Nationwide", servingLabel: "1 bowl", servingGrams: 250, calories: 320, proteinG: 22, carbsG: 8, fatG: 22 },
  { id: "beans-porridge", name: "Beans Porridge", nameLocal: "Ewa Agoyin style", category: "Legumes", region: "Nationwide", servingLabel: "1 bowl", servingGrams: 300, calories: 420, proteinG: 18, carbsG: 60, fatG: 12, fiberG: 10 },
  { id: "moi-moi", name: "Moi Moi", category: "Legumes", region: "Nationwide", servingLabel: "1 wrap", servingGrams: 150, calories: 220, proteinG: 14, carbsG: 18, fatG: 10, fiberG: 5 },
  { id: "akara", name: "Akara", category: "Legumes", region: "Nationwide", servingLabel: "3 pieces", servingGrams: 120, calories: 260, proteinG: 10, carbsG: 20, fatG: 16 },
  { id: "suya", name: "Suya (Beef)", category: "Protein", region: "Nationwide", servingLabel: "1 skewer (100g)", servingGrams: 100, calories: 260, proteinG: 28, carbsG: 4, fatG: 15 },
  { id: "grilled-chicken", name: "Grilled Chicken", category: "Protein", region: "Nationwide", servingLabel: "1 piece (150g)", servingGrams: 150, calories: 250, proteinG: 40, carbsG: 0, fatG: 9 },
  { id: "boiled-eggs", name: "Boiled Eggs", category: "Protein", region: "Nationwide", servingLabel: "2 eggs", servingGrams: 100, calories: 155, proteinG: 13, carbsG: 1, fatG: 11 },
  { id: "dodo", name: "Fried Plantain", nameLocal: "Dodo", category: "Sides", region: "Nationwide", servingLabel: "6 slices", servingGrams: 150, calories: 320, proteinG: 2, carbsG: 55, fatG: 12 },
  { id: "boiled-plantain", name: "Boiled Plantain (Unripe)", category: "Sides", region: "Nationwide", servingLabel: "1 serving", servingGrams: 200, calories: 232, proteinG: 2.4, carbsG: 61, fatG: 0.4 },
  { id: "boli", name: "Roasted Plantain", nameLocal: "Boli", category: "Sides", region: "Nationwide", servingLabel: "1 medium", servingGrams: 150, calories: 220, proteinG: 2, carbsG: 52, fatG: 0.5 },
  { id: "boiled-yam", name: "Boiled Yam", category: "Sides", region: "Nationwide", servingLabel: "1 serving", servingGrams: 200, calories: 260, proteinG: 3, carbsG: 60, fatG: 0.4 },
  { id: "asaro", name: "Yam Porridge", nameLocal: "Asaro", category: "Sides", region: "Nationwide", servingLabel: "1 bowl", servingGrams: 300, calories: 400, proteinG: 6, carbsG: 70, fatG: 12 },
  { id: "plantain-porridge", name: "Plantain Porridge", category: "Sides", region: "Nationwide", servingLabel: "1 bowl", servingGrams: 300, calories: 380, proteinG: 8, carbsG: 62, fatG: 12 },
  { id: "chin-chin", name: "Chin Chin", category: "Snack", region: "Nationwide", servingLabel: "1 cup", servingGrams: 100, calories: 470, proteinG: 7, carbsG: 60, fatG: 22 },
  { id: "puff-puff", name: "Puff Puff", category: "Snack", region: "Nationwide", servingLabel: "4 pieces", servingGrams: 120, calories: 340, proteinG: 6, carbsG: 45, fatG: 15 },
  { id: "meat-pie", name: "Meat Pie", category: "Snack", region: "Nationwide", servingLabel: "1 pie", servingGrams: 120, calories: 330, proteinG: 8, carbsG: 34, fatG: 18 },
  { id: "groundnuts", name: "Roasted Groundnuts", category: "Snack", region: "Nationwide", servingLabel: "1 small cup", servingGrams: 30, calories: 170, proteinG: 7, carbsG: 5, fatG: 14 },
  { id: "tiger-nuts", name: "Tiger Nuts", nameLocal: "Aya", category: "Snack", region: "Nationwide", servingLabel: "1 handful", servingGrams: 50, calories: 130, proteinG: 2, carbsG: 24, fatG: 4, fiberG: 5 },
  { id: "kunu", name: "Kunu (Millet Drink)", category: "Drinks", region: "North", servingLabel: "1 cup", servingGrams: 250, calories: 110, proteinG: 3, carbsG: 22, fatG: 1.5 },
  { id: "zobo", name: "Zobo (Unsweetened)", category: "Drinks", region: "Nationwide", servingLabel: "1 cup", servingGrams: 250, calories: 45, proteinG: 0.3, carbsG: 11, fatG: 0 },
  { id: "fura-da-nono", name: "Fura da Nono", category: "Drinks", region: "North", servingLabel: "1 cup", servingGrams: 250, calories: 180, proteinG: 7, carbsG: 22, fatG: 7 },
  { id: "pap", name: "Custard", nameLocal: "Ogi / Pap (unsweetened)", category: "Breakfast", region: "Nationwide", servingLabel: "1 bowl", servingGrams: 250, calories: 130, proteinG: 2, carbsG: 28, fatG: 1 },
  { id: "bread-egg", name: "Bread & Fried Egg", category: "Breakfast", region: "Nationwide", servingLabel: "2 slices + 1 egg", servingGrams: 150, calories: 340, proteinG: 14, carbsG: 36, fatG: 15 },
  { id: "oatmeal", name: "Oatmeal (Plain)", category: "Breakfast", region: "Nationwide", servingLabel: "1 bowl, cooked", servingGrams: 250, calories: 200, proteinG: 7, carbsG: 34, fatG: 4, fiberG: 5 },
  { id: "nigerian-salad", name: "Nigerian Salad", category: "Sides", region: "Nationwide", servingLabel: "1 bowl", servingGrams: 200, calories: 210, proteinG: 4, carbsG: 20, fatG: 13 },
  { id: "watermelon", name: "Watermelon", category: "Fruit", region: "Nationwide", servingLabel: "1 slice", servingGrams: 200, calories: 60, proteinG: 1.2, carbsG: 15, fatG: 0.3, fiberG: 1 },
  { id: "banana", name: "Banana", category: "Fruit", region: "Nationwide", servingLabel: "1 medium", servingGrams: 120, calories: 105, proteinG: 1.3, carbsG: 27, fatG: 0.4, fiberG: 3 },
  { id: "pawpaw", name: "Pawpaw", nameLocal: "Papaya", category: "Fruit", region: "Nationwide", servingLabel: "1 cup", servingGrams: 150, calories: 60, proteinG: 0.7, carbsG: 15, fatG: 0.2, fiberG: 2 },
];

export function searchFoods(query: string): FoodItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return FOODS.slice(0, 12);
  return FOODS.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.nameLocal?.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
  );
}

export function getFoodById(id: string): FoodItem | undefined {
  return FOODS.find((f) => f.id === id);
}
