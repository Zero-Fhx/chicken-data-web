import '@/styles/MobileNavbar.css'
import { LogoIcon, MenuIcon } from './Icons'

/**
 * Barra de navegación superior para dispositivos móviles.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.onMenuClick - Función que se ejecuta al hacer click en el botón de menú.
 * @returns {React.ReactElement} El elemento JSX renderizado.
 */
export function MobileNavbar ({ onMenuClick }) {
  return (
    <nav className='mobile-navbar'>
      <div className='mobile-menu'>
        <button className='menu-btn' onClick={onMenuClick} aria-label='Abrir menú'>
          <MenuIcon />
        </button>
      </div>

      <div className='mobile-logo'>
        <LogoIcon width={32} height={32} color='#1a202c' />
        <span className='mobile-title'>Chicken Data</span>
      </div>

      <div className='mobile-actions'>
        <div className='mobile-user-avatar'>
          <img src='https://avatar.iran.liara.run/public' alt='User Avatar' />
        </div>
      </div>
    </nav>
  )
}
