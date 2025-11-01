const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  // Dishes
  dishes: `${API_BASE_URL}/dishes`,
  dishCategories: `${API_BASE_URL}/dish-categories`,
  dishIngredients: `${API_BASE_URL}/dish-ingredients`,

  // Ingredients
  ingredients: `${API_BASE_URL}/ingredients`,
  ingredientCategories: `${API_BASE_URL}/ingredient-categories`,

  // Suppliers
  suppliers: `${API_BASE_URL}/suppliers`,

  // Purchases
  purchases: `${API_BASE_URL}/purchases`,

  // Sales
  sales: `${API_BASE_URL}/sales`,

  // Users
  users: `${API_BASE_URL}/users`,

  // Health
  health: `${API_BASE_URL}/health`
}

export default API_ENDPOINTS
