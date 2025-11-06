const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

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
