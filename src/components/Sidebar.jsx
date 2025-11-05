import { NavLink } from 'react-router'

import { ChartIcon, CubeAltIcon, CubeIcon, DollarIcon, LogoIcon, SettingsIcon, ShoppingCartIcon, TruckIcon, UserIcon } from './Icons'

import '@/styles/Sidebar.css'

const MENU = [
  {
    label: 'Dashboard',
    items: [
      { name: '', label: 'Inicio', icon: ChartIcon }
    ]
  },
  {
    label: 'Gestión',
    items: [
      { name: 'Dishes', label: 'Platos', icon: CubeIcon },
      { name: 'Ingredients', label: 'Ingredientes', icon: CubeAltIcon },
      { name: 'Purchases', label: 'Compras', icon: ShoppingCartIcon },
      { name: 'Sales', label: 'Ventas', icon: DollarIcon },
      { name: 'Suppliers', label: 'Proveedores', icon: TruckIcon }
    ]
  },
  {
    label: 'Sistema',
    items: [
      { name: 'Users', label: 'Usuarios', icon: UserIcon },
      { name: 'Settings', label: 'Configuración', icon: SettingsIcon }
    ]
  }
]

export function Sidebar () {
  return (
    <aside className='sidebar'>
      <header className='header'>
        <span className='logo'>
          <LogoIcon width={40} height={40} color='#1a202c' />
        </span>
        <h1 className='company-name'>Chicken Data</h1>
      </header>
      <nav className='nav'>
        <div className='nav-list'>
          {MENU.map((section) => (
            <div className='nav-section' key={section.label}>
              <div className='nav-separator'>
                <span className='nav-title'>{section.label}</span>
                <div className='separator-line' />
              </div>
              <ul className='nav-items'>
                {section.items.map((item) => (
                  <li key={item.name} name={item.name} className='nav-item'>
                    <NavLink
                      to={'/' + item.name.toLowerCase()}
                      className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                    >
                      {item.icon && <item.icon />}
                      <span className='nav-text'>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
      <footer className='footer'>
        <div className='user'>
          <div className='user-avatar'>
            <img src='https://avatar.iran.liara.run/public' alt='User Avatar' />
          </div>
          <div className='user-info'>
            <span className='user-name'>Usuario</span>
            <span className='user-role'>Administrador</span>
          </div>
        </div>
      </footer>
    </aside>
  )
}
