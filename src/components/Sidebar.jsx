import { LogoIcon, PlateIcon } from './Icons'

import { NavLink } from 'react-router'

import '@/styles/Sidebar.css'

const MENU = [
  {
    label: 'Dashboard',
    items: [
      { name: 'Home', label: 'Inicio', icon: PlateIcon }
    ]
  },
  {
    label: 'Gestión',
    items: [
      { name: 'Dishes', label: 'Platos', icon: PlateIcon },
      { name: 'Ingredients', label: 'Ingredientes', icon: PlateIcon },
      { name: 'Purchases', label: 'Compras', icon: PlateIcon },
      { name: 'Sales', label: 'Ventas', icon: PlateIcon },
      { name: 'Suppliers', label: 'Proveedores', icon: PlateIcon }
    ]
  },
  {
    label: 'Sistema',
    items: [
      { name: 'Users', label: 'Usuarios', icon: PlateIcon },
      { name: 'Settings', label: 'Configuración', icon: PlateIcon }
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
            <span className='user-name'>Erick Flores</span>
            <span className='user-role'>Administrador</span>
          </div>
        </div>
      </footer>
    </aside>
  )
}
