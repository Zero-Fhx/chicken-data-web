import { PageHeader } from '@/components/PageHeader'
import { Separator } from '@/components/Separator'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'
import { formatDateInput, formatDateTime } from '@/services/dateUtils'

const API_STATS = `${API_ENDPOINTS.dashboard}/stats`
const API_ALERTS = `${API_ENDPOINTS.dashboard}/alerts`
const API_TRENDS = `${API_ENDPOINTS.dashboard}/trends?period=7d&granularity=daily`
const API_PROJECTIONS = `${API_ENDPOINTS.dashboard}/projections?days=30`
const API_COMPARISONS = `${API_ENDPOINTS.dashboard}/comparisons`
const API_BREAKDOWN_SALES = `${API_ENDPOINTS.dashboard}/breakdown/sales`
const API_BREAKDOWN_PURCHASES = `${API_ENDPOINTS.dashboard}/breakdown/purchases`

export function Home () {
  const { data, loading, error } = useFetch(API_STATS)
  const { data: alertsData, loading: alertsLoading } = useFetch(API_ALERTS)
  const { data: trendsData, loading: trendsLoading } = useFetch(API_TRENDS)
  const { data: projectionsData, loading: projectionsLoading } = useFetch(API_PROJECTIONS)
  const { data: comparisonsData, loading: comparisonsLoading } = useFetch(API_COMPARISONS)
  const { data: salesBreakdownData, loading: salesBreakdownLoading } = useFetch(API_BREAKDOWN_SALES)
  const { data: purchasesBreakdownData, loading: purchasesBreakdownLoading } = useFetch(API_BREAKDOWN_PURCHASES)

  const { success, data: metrics } = data || {}

  const { sales, purchases, inventory, dishes, suppliers, recentActivity, financial } = metrics || {}

  const { data: alerts } = alertsData || {}

  const { data: trends } = trendsData || {}

  const { data: projections } = projectionsData || {}

  const { data: comparisons } = comparisonsData || {}

  const { data: salesBreakdown } = salesBreakdownData || {}
  const { data: purchasesBreakdown } = purchasesBreakdownData || {}

  return (
    <div>
      <PageHeader
        title='Dashboard'
        description='Resumen ejecutivo de ventas, compras, inventario y métricas clave del negocio.'
      />

      <Separator />

      {loading && <p>Cargando métricas del dashboard...</p>}
      {error && <p>Error al cargar las métricas: {error.message}</p>}

      {success && metrics && (
        <>
          <section>
            <h2>Ventas</h2>
            <article>
              <h3>Hoy</h3>
              <p>Total: S/. {sales?.today?.total ?? 0}</p>
              <p>Transacciones: {sales?.today?.count ?? 0}</p>
              <p>Promedio: S/. {sales?.today?.average ?? 0}</p>
              <p>Crecimiento: {sales?.today?.growth ?? 0}%</p>
            </article>
            <article>
              <h3>Esta Semana</h3>
              <p>Total: S/. {sales?.week?.total ?? 0}</p>
              <p>Transacciones: {sales?.week?.count ?? 0}</p>
              <p>Promedio: S/. {sales?.week?.average ?? 0}</p>
              <p>Crecimiento: {sales?.week?.growth ?? 0}%</p>
            </article>
            <article>
              <h3>Este Mes</h3>
              <p>Total: S/. {sales?.month?.total ?? 0}</p>
              <p>Transacciones: {sales?.month?.count ?? 0}</p>
              <p>Promedio: S/. {sales?.month?.average ?? 0}</p>
              <p>Crecimiento: {sales?.month?.growth ?? 0}%</p>
            </article>
            <article>
              <h3>Este Año</h3>
              <p>Total: S/. {sales?.year?.total ?? 0}</p>
            </article>
          </section>

          <Separator />

          <section>
            <h2>Compras</h2>
            <article>
              <h3>Hoy</h3>
              <p>Total: S/. {purchases?.today?.total ?? 0}</p>
              <p>Transacciones: {purchases?.today?.count ?? 0}</p>
            </article>
            <article>
              <h3>Esta Semana</h3>
              <p>Total: S/. {purchases?.week?.total ?? 0}</p>
              <p>Transacciones: {purchases?.week?.count ?? 0}</p>
            </article>
            <article>
              <h3>Este Mes</h3>
              <p>Total: S/. {purchases?.month?.total ?? 0}</p>
              <p>Transacciones: {purchases?.month?.count ?? 0}</p>
              <p>Crecimiento: {purchases?.month?.growth ?? 0}%</p>
            </article>
            <article>
              <h3>Este Año</h3>
              <p>Total: S/. {purchases?.year?.total ?? 0}</p>
            </article>
          </section>

          <Separator />

          <section>
            <h2>Inventario</h2>
            <article>
              <h3>Resumen</h3>
              <p>Total de ingredientes: {inventory?.total ?? 0}</p>
              <p>Activos: {inventory?.active ?? 0}</p>
              <p>Inactivos: {inventory?.inactive ?? 0}</p>
              <p>Valor total: S/. {inventory?.totalValue ?? 0}</p>
            </article>
            <article>
              <h3>Alertas de Stock</h3>
              <p>Stock bajo: {inventory?.alerts?.lowStock ?? 0}</p>
              <p>Sin stock: {inventory?.alerts?.outOfStock ?? 0}</p>
              <p>Stock óptimo: {inventory?.alerts?.optimal ?? 0}</p>
            </article>
            {inventory?.criticalIngredients && inventory.criticalIngredients.length > 0 && (
              <article>
                <h3>Ingredientes Críticos</h3>
                <ul>
                  {inventory.criticalIngredients.map(ingredient => (
                    <li key={ingredient.id}>
                      <strong>{ingredient.name}</strong>
                      <p>Stock actual: {ingredient.currentStock} {ingredient.unit}</p>
                      <p>Stock mínimo: {ingredient.minimumStock} {ingredient.unit}</p>
                      <p>Porcentaje: {ingredient.stockPercentage}%</p>
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </section>

          <Separator />

          <section>
            <h2>Platos</h2>
            <article>
              <h3>Resumen</h3>
              <p>Total: {dishes?.total ?? 0}</p>
              <p>Activos: {dishes?.active ?? 0}</p>
              <p>Inactivos: {dishes?.inactive ?? 0}</p>
            </article>
            {dishes?.topSelling && dishes.topSelling.length > 0 && (
              <article>
                <h3>Platos Más Vendidos</h3>
                <ol>
                  {dishes.topSelling.map(dish => (
                    <li key={dish.id}>
                      <strong>{dish.name}</strong>
                      <p>Cantidad vendida: {dish.quantitySold}</p>
                      <p>Ingresos: S/. {dish.revenue}</p>
                      <p>Porcentaje de ingresos: {dish.revenuePercentage}%</p>
                    </li>
                  ))}
                </ol>
              </article>
            )}
            {dishes?.leastSelling && dishes.leastSelling.length > 0 && (
              <article>
                <h3>Platos Menos Vendidos</h3>
                <ol>
                  {dishes.leastSelling.map(dish => (
                    <li key={dish.id}>
                      <strong>{dish.name}</strong>
                      <p>Cantidad vendida: {dish.quantitySold}</p>
                    </li>
                  ))}
                </ol>
              </article>
            )}
          </section>

          <Separator />

          <section>
            <h2>Proveedores</h2>
            <article>
              <h3>Resumen</h3>
              <p>Total: {suppliers?.total ?? 0}</p>
              <p>Activos: {suppliers?.active ?? 0}</p>
              <p>Inactivos: {suppliers?.inactive ?? 0}</p>
            </article>
            {suppliers?.topSuppliers && suppliers.topSuppliers.length > 0 && (
              <article>
                <h3>Proveedores Principales</h3>
                <ol>
                  {suppliers.topSuppliers.map(supplier => (
                    <li key={supplier.id}>
                      <strong>{supplier.name}</strong>
                      <p>Compras realizadas: {supplier.purchaseCount}</p>
                      <p>Total gastado: S/. {supplier.totalSpent}</p>
                    </li>
                  ))}
                </ol>
              </article>
            )}
          </section>

          <Separator />

          <section>
            <h2>Actividad Reciente</h2>
            {recentActivity?.lastSale && (
              <article>
                <h3>Última Venta</h3>
                <p>Fecha: {formatDateTime(recentActivity.lastSale.timestamp)}</p>
                <p>Tiempo transcurrido: {recentActivity.lastSale.timeAgo}</p>
              </article>
            )}
            {recentActivity?.lastPurchase && (
              <article>
                <h3>Última Compra</h3>
                <p>Fecha: {formatDateTime(recentActivity.lastPurchase.timestamp)}</p>
                <p>Tiempo transcurrido: {recentActivity.lastPurchase.timeAgo}</p>
              </article>
            )}
            {recentActivity?.today && (
              <article>
                <h3>Resumen del Día</h3>
                <p>Platos vendidos hoy: {recentActivity.today.dishesSold ?? 0}</p>
                {recentActivity.today.mostUsedIngredient && (
                  <>
                    <p>Ingrediente más usado: {recentActivity.today.mostUsedIngredient.name}</p>
                    <p>Cantidad usada: {recentActivity.today.mostUsedIngredient.quantityUsed} kg</p>
                  </>
                )}
              </article>
            )}
          </section>

          <Separator />

          <section>
            <h2>Métricas Financieras</h2>
            {financial?.profitMargin && (
              <article>
                <h3>Margen de Utilidad</h3>
                <p>Hoy: {financial.profitMargin.today ?? 0}%</p>
                <p>Esta semana: {financial.profitMargin.week ?? 0}%</p>
                <p>Este mes: {financial.profitMargin.month ?? 0}%</p>
              </article>
            )}
            {financial?.roi && (
              <article>
                <h3>ROI (Retorno de Inversión)</h3>
                <p>Este mes: {financial.roi.month ?? 0}%</p>
              </article>
            )}
            {financial?.costs && (
              <article>
                <h3>Costos</h3>
                <p>Costo promedio por plato: S/. {financial.costs.averageCostPerDish ?? 0}</p>
                <p>Porcentaje de costo de alimentos: {financial.costs.foodCostPercentage ?? 0}%</p>
              </article>
            )}
            {financial?.profit && (
              <article>
                <h3>Utilidades</h3>
                <p>Hoy: S/. {financial.profit.today ?? 0}</p>
                <p>Esta semana: S/. {financial.profit.week ?? 0}</p>
                <p>Este mes: S/. {financial.profit.month ?? 0}</p>
                <p>Utilidad promedio por plato: S/. {financial.profit.averageProfitPerDish ?? 0}</p>
              </article>
            )}
          </section>

          <Separator />

          <section>
            <h2>Alertas y Notificaciones</h2>
            {alertsLoading && <p>Cargando alertas...</p>}
            {alerts && (
              <>
                {alerts.summary && (
                  <article>
                    <h3>Resumen de Alertas</h3>
                    <p>Total: {alerts.summary.total ?? 0}</p>
                    <p>Críticas: {alerts.summary.critical ?? 0}</p>
                    <p>Advertencias: {alerts.summary.warning ?? 0}</p>
                    <p>Informativas: {alerts.summary.info ?? 0}</p>
                  </article>
                )}

                {alerts.critical && alerts.critical.length > 0 && (
                  <article>
                    <h3>🔴 Alertas Críticas</h3>
                    <ul>
                      {alerts.critical.map((alert, index) => (
                        <li key={index}>
                          <strong>{alert.title}</strong>
                          <p>{alert.message}</p>
                        </li>
                      ))}
                    </ul>
                  </article>
                )}

                {alerts.warning && alerts.warning.length > 0 && (
                  <article>
                    <h3>⚠️ Advertencias</h3>
                    <ul>
                      {alerts.warning.slice(0, 5).map((alert, index) => (
                        <li key={index}>
                          <strong>{alert.title}</strong>
                          <p>{alert.message}</p>
                        </li>
                      ))}
                    </ul>
                    {alerts.warning.length > 5 && (
                      <p>... y {alerts.warning.length - 5} advertencias más</p>
                    )}
                  </article>
                )}
              </>
            )}
          </section>

          <Separator />

          <section>
            <h2>Proyecciones (30 días)</h2>
            {projectionsLoading && <p>Cargando proyecciones...</p>}
            {projections && (
              <>
                {projections.sales && (
                  <article>
                    <h3>Proyección de Ventas</h3>
                    <p>Total proyectado: S/. {projections.sales.projectedTotal ?? 0}</p>
                    <p>Promedio diario: S/. {projections.sales.dailyAverage ?? 0}</p>
                    <p>Confianza: {projections.sales.confidence ?? 'N/A'}</p>
                    <p>Tendencia: {projections.sales.trend ?? 'N/A'}</p>
                  </article>
                )}

                {projections.purchaseRecommendations && projections.purchaseRecommendations.length > 0 && (
                  <article>
                    <h3>Recomendaciones de Compra</h3>
                    <ul>
                      {projections.purchaseRecommendations.map((rec) => (
                        <li key={rec.ingredientId}>
                          <strong>{rec.ingredientName}</strong>
                          <p>Cantidad recomendada: {rec.recommendedQuantity} {rec.unit}</p>
                          <p>Costo estimado: S/. {rec.estimatedCost}</p>
                          <p>Prioridad: {rec.priority}</p>
                          <p>Razón: {rec.reason}</p>
                        </li>
                      ))}
                    </ul>
                    {projections.summary && (
                      <p><strong>Costo total estimado: S/. {projections.summary.totalEstimatedCost ?? 0}</strong></p>
                    )}
                  </article>
                )}

                {projections.stock?.criticalIngredients && projections.stock.criticalIngredients.length > 0 && (
                  <article>
                    <h3>Ingredientes que se Agotarán Pronto</h3>
                    <ul>
                      {projections.stock.criticalIngredients.map((item) => (
                        <li key={item.ingredientId}>
                          <strong>{item.ingredientName}</strong>
                          <p>Stock actual: {item.currentStock} {item.unit}</p>
                          <p>Se agota en: {item.daysUntilDepletion} días ({item.projectedDepletionDate})</p>
                          <p>Estado: {item.status}</p>
                        </li>
                      ))}
                    </ul>
                  </article>
                )}
              </>
            )}
          </section>

          <Separator />

          <section>
            <h2>Comparaciones con Períodos Anteriores</h2>
            {comparisonsLoading && <p>Cargando comparaciones...</p>}
            {comparisons?.sales && (
              <>
                <article>
                  <h3>Comparación de Ventas - Esta Semana</h3>
                  <p>Ventas actuales: S/. {comparisons.sales.week?.current ?? 0}</p>
                  {comparisons.sales.week?.vsLastWeek && (
                    <>
                      <p>Semana anterior: S/. {comparisons.sales.week.vsLastWeek.value ?? 0}</p>
                      <p>Cambio: {comparisons.sales.week.vsLastWeek.change ?? 0}%</p>
                    </>
                  )}
                </article>

                <article>
                  <h3>Comparación de Ventas - Este Mes</h3>
                  <p>Ventas actuales: S/. {comparisons.sales.month?.current ?? 0}</p>
                  {comparisons.sales.month?.vsLastMonth && (
                    <>
                      <p>Mes anterior: S/. {comparisons.sales.month.vsLastMonth.value ?? 0}</p>
                      <p>Cambio: {comparisons.sales.month.vsLastMonth.change ?? 0}%</p>
                    </>
                  )}
                </article>
              </>
            )}

            {comparisons?.dishes?.topDishes && comparisons.dishes.topDishes.length > 0 && (
              <article>
                <h3>Comparación de Platos Principales</h3>
                <ul>
                  {comparisons.dishes.topDishes.map((dish) => (
                    <li key={dish.id}>
                      <strong>{dish.name}</strong>
                      <p>Este mes: {dish.currentMonth?.quantitySold ?? 0} vendidos (S/. {dish.currentMonth?.revenue ?? 0})</p>
                      <p>Mes anterior: {dish.lastMonth?.quantitySold ?? 0} vendidos (S/. {dish.lastMonth?.revenue ?? 0})</p>
                      {dish.change && (
                        <p>Cambio: {dish.change.quantityPercent ?? 0}% en cantidad, {dish.change.revenuePercent ?? 0}% en ingresos</p>
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            )}
          </section>

          <Separator />

          <section>
            <h2>Ventas por Categoría</h2>
            {salesBreakdownLoading && <p>Cargando desglose de ventas...</p>}
            {salesBreakdown?.byCategory && salesBreakdown.byCategory.length > 0 && (
              <>
                <article>
                  <h3>Esta Semana</h3>
                  <ul>
                    {salesBreakdown.byCategory.map((category) => (
                      <li key={category.categoryId}>
                        <strong>{category.categoryName}</strong>
                        <p>{category.description}</p>
                        <p>Ingresos: S/. {category.week?.revenue ?? 0} ({category.week?.percentage ?? 0}%)</p>
                        <p>Cantidad: {category.week?.quantity ?? 0} platos vendidos</p>
                      </li>
                    ))}
                  </ul>
                </article>

                <article>
                  <h3>Este Mes</h3>
                  <ul>
                    {salesBreakdown.byCategory.map((category) => (
                      <li key={category.categoryId}>
                        <strong>{category.categoryName}</strong>
                        <p>Ingresos: S/. {category.month?.revenue ?? 0} ({category.month?.percentage ?? 0}%)</p>
                        <p>Cantidad: {category.month?.quantity ?? 0} platos vendidos</p>
                      </li>
                    ))}
                  </ul>
                </article>
              </>
            )}
            {salesBreakdown?.totals && (
              <article>
                <h3>Totales</h3>
                <p>Semana: S/. {salesBreakdown.totals.week ?? 0}</p>
                <p>Mes: S/. {salesBreakdown.totals.month ?? 0}</p>
                <p>Año: S/. {salesBreakdown.totals.year ?? 0}</p>
              </article>
            )}
          </section>

          <Separator />

          <section>
            <h2>Compras por Categoría</h2>
            {purchasesBreakdownLoading && <p>Cargando desglose de compras...</p>}
            {purchasesBreakdown?.byCategory && purchasesBreakdown.byCategory.length > 0 && (
              <>
                <article>
                  <h3>Esta Semana</h3>
                  <ul>
                    {purchasesBreakdown.byCategory.map((category) => (
                      <li key={category.categoryId}>
                        <strong>{category.categoryName}</strong>
                        <p>{category.description}</p>
                        <p>Costo: S/. {category.week?.cost ?? 0} ({category.week?.percentage ?? 0}%)</p>
                        <p>Cantidad: {category.week?.quantity ?? 0} unidades</p>
                      </li>
                    ))}
                  </ul>
                </article>

                <article>
                  <h3>Este Mes</h3>
                  <ul>
                    {purchasesBreakdown.byCategory.map((category) => (
                      <li key={category.categoryId}>
                        <strong>{category.categoryName}</strong>
                        <p>Costo: S/. {category.month?.cost ?? 0} ({category.month?.percentage ?? 0}%)</p>
                        <p>Cantidad: {category.month?.quantity ?? 0} unidades</p>
                      </li>
                    ))}
                  </ul>
                </article>
              </>
            )}
            {purchasesBreakdown?.totals && (
              <article>
                <h3>Totales</h3>
                <p>Semana: S/. {purchasesBreakdown.totals.week ?? 0}</p>
                <p>Mes: S/. {purchasesBreakdown.totals.month ?? 0}</p>
                <p>Año: S/. {purchasesBreakdown.totals.year ?? 0}</p>
              </article>
            )}
          </section>

          <Separator />

          <section>
            <h2>Tendencias (Últimos 7 días)</h2>
            {trendsLoading && <p>Cargando tendencias...</p>}
            {trends && (
              <>
                {trends.sales && trends.sales.length > 0
                  ? (
                    <article>
                      <h3>Tendencia de Ventas</h3>
                      <table>
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Total (S/.)</th>
                            <th>Transacciones</th>
                            <th>Promedio (S/.)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trends.sales.map((day, index) => (
                            <tr key={index}>
                              <td>{formatDateInput(day.period || day.date) || `Día ${index + 1}`}</td>
                              <td>{day.revenue ?? day.total ?? 0}</td>
                              <td>{day.count ?? 0}</td>
                              <td>{day.average ?? 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </article>
                    )
                  : (
                    <article>
                      <h3>Tendencia de Ventas</h3>
                      <p>No hay datos de tendencias de ventas disponibles</p>
                    </article>
                    )}

                {trends.purchases && trends.purchases.length > 0
                  ? (
                    <article>
                      <h3>Tendencia de Compras</h3>
                      <table>
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Total (S/.)</th>
                            <th>Transacciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trends.purchases.map((day, index) => (
                            <tr key={index}>
                              <td>{formatDateInput(day.period || day.date) || `Día ${index + 1}`}</td>
                              <td>{day.cost ?? day.total ?? 0}</td>
                              <td>{day.count ?? 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </article>
                    )
                  : (
                    <article>
                      <h3>Tendencia de Compras</h3>
                      <p>No hay datos de tendencias de compras disponibles</p>
                    </article>
                    )}

                {trends.inventory && trends.inventory.length > 0
                  ? (
                    <article>
                      <h3>Tendencia de Inventario</h3>
                      <table>
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Valor Total (S/.)</th>
                            <th>Items con Stock Bajo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trends.inventory.map((day, index) => (
                            <tr key={index}>
                              <td>{formatDateInput(day.period || day.date) || `Día ${index + 1}`}</td>
                              <td>{day.total_value ?? day.totalValue ?? 0}</td>
                              <td>{day.low_stock_count ?? day.lowStockCount ?? 0}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </article>
                    )
                  : (
                    <article>
                      <h3>Tendencia de Inventario</h3>
                      <p>No hay datos de tendencias de inventario disponibles</p>
                    </article>
                    )}
              </>
            )}
            {!trends && !trendsLoading && (
              <article>
                <p>No se pudieron cargar las tendencias</p>
              </article>
            )}
          </section>
        </>
      )}
    </div>
  )
}
