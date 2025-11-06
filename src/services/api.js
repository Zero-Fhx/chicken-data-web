const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_URL = `${API_BASE_URL}/api`

/**
 * @typedef {Object} ApiEndpoints
 * @property {string} dashboard - Endpoint para los datos del dashboard.
 * @property {string} dishes - Endpoint para los platillos.
 * @property {string} dishCategories - Endpoint para las categorías de platillos.
 * @property {string} dishIngredients - Endpoint para los ingredientes de los platillos.
 * @property {string} ingredients - Endpoint para los ingredientes.
 * @property {string} ingredientCategories - Endpoint para las categorías de ingredientes.
 * @property {string} suppliers - Endpoint para los proveedores.
 * @property {string} purchases - Endpoint para las compras.
 * @property {string} sales - Endpoint para las ventas.
 * @property {string} users - Endpoint para los usuarios.
 * @property {string} health - Endpoint para el chequeo de salud del API.
 */

/**
 * Objeto que contiene los endpoints de la API para las diferentes entidades.
 * * Construye las URLs completas para cada recurso de la API, facilitando la gestión centralizada de las rutas.
 *
 * @type {ApiEndpoints}
 */
export const API_ENDPOINTS = {
  dashboard: `${API_URL}/dashboard`, // /api/dashboard
  dishes: `${API_URL}/dishes`, // /api/dishes
  dishCategories: `${API_URL}/dish-categories`, // /api/dish-categories
  dishIngredients: `${API_URL}/dish-ingredients`, // /api/dish-ingredients
  ingredients: `${API_URL}/ingredients`, // /api/ingredients
  ingredientCategories: `${API_URL}/ingredient-categories`, // /api/ingredient-categories
  suppliers: `${API_URL}/suppliers`, // /api/suppliers
  purchases: `${API_URL}/purchases`, // /api/purchases
  sales: `${API_URL}/sales`, // /api/sales
  users: `${API_URL}/users`, // /api/users
  health: `${API_BASE_URL}/health` // /health
}

export default API_ENDPOINTS
