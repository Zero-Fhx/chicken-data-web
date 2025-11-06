const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  dashboard: `${API_BASE_URL}/dashboard`,
  dishes: `${API_BASE_URL}/dishes`,
  dishCategories: `${API_BASE_URL}/dish-categories`,
  dishIngredients: `${API_BASE_URL}/dish-ingredients`,
  ingredients: `${API_BASE_URL}/ingredients`,
  ingredientCategories: `${API_BASE_URL}/ingredient-categories`,
  suppliers: `${API_BASE_URL}/suppliers`,
  purchases: `${API_BASE_URL}/purchases`,
  sales: `${API_BASE_URL}/sales`,
  users: `${API_BASE_URL}/users`,
  health: `${API_BASE_URL}/health`
}

export default API_ENDPOINTS
