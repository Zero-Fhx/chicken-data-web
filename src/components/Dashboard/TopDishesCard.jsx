import { DashboardCard } from '@/components/Dashboard/DashboardCard'
import { PeriodSelector } from '@/components/Dashboard/PeriodSelector'
import { TopDishesList } from '@/components/Dashboard/TopDishesList'
import { useFetch } from '@/hooks/useFetch'
import API_ENDPOINTS from '@/services/api'
import { useState } from 'react'

export function TopDishesCard () {
  const [listType, setListType] = useState('topSelling')
  const { data: dishesData, loading, error, refetch } = useFetch(
    `${API_ENDPOINTS.dashboard}/stats/dishes`
  )
  const listToggleControls = (
    <PeriodSelector
      options={[
        { label: 'Más Vendidos', value: 'topSelling' },
        { label: 'Menos Vendidos', value: 'leastSelling' }
      ]}
      selectedPeriod={listType}
      onPeriodChange={setListType}
      groupName='dishes-type'
    />
  )
  const listData =
    listType === 'topSelling'
      ? dishesData?.data?.topSelling
      : dishesData?.data?.leastSelling

  return (
    <DashboardCard
      title='Platos del Mes'
      className='span-2'
      loading={loading}
      error={error}
      onRetry={refetch}
      cardControls={listToggleControls}
    >
      <TopDishesList
        loading={loading}
        data={listData}
        error={error}
      />
    </DashboardCard>
  )
}
