import { Route, Routes } from 'react-router'

import { Sidebar } from '@/components/Sidebar'

import { Dishes } from '@/pages/Dishes'
import { Home } from '@/pages/Home'
import { Ingredients } from '@/pages/Ingredients'
import { Purchases } from '@/pages/Purchases'
import { Sales } from '@/pages/Sales'
import { Suppliers } from '@/pages/Suppliers'

import '@/styles/App.css'
import '@fontsource-variable/onest'

export function App () {
  return (
    <main className='app'>
      <Sidebar />
      <div className='page-content'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/dishes' element={<Dishes />} />
          <Route path='/ingredients' element={<Ingredients />} />
          <Route path='/purchases' element={<Purchases />} />
          <Route path='/sales' element={<Sales />} />
          <Route path='/suppliers' element={<Suppliers />} />
          {/* <Route path='/users' element={<Users />} />
          <Route path='/settings' element={<Settings />} /> */}
        </Routes>
      </div>
    </main>
  )
}
