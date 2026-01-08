import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useAuth } from '../../contexts/AuthContext'
import arkLogo from '../../assets/ark-logo.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => location.pathname === path

  const navLinkClass = (path: string) =>
    `transition-colors text-sm ${
      isActive(path)
        ? 'text-primary-700 font-medium'
        : 'text-gray-600 hover:text-gray-900'
    }`

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const getDashboardPath = () => {
    if (user?.type === 'arquiteto') return '/architect/dashboard'
    if (user?.type === 'cliente') return '/client/dashboard'
    return '/'
  }

  const getProfilePath = () => {
    if (user?.type === 'arquiteto') return '/architect/profile'
    if (user?.type === 'cliente') return '/client/dashboard'
    return '/'
  }

  const getSettingsPath = () => {
    if (user?.type === 'arquiteto') return '/architect/settings'
    if (user?.type === 'cliente') return '/client/settings'
    return '/'
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src={arkLogo} alt="ArckDesign" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/explore" className={navLinkClass('/explore')}>
              Explorar
            </Link>
            <Link to="/pricing" className={navLinkClass('/pricing')}>
              Planos
            </Link>
            <a href="#como-funciona" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Como Funciona
            </a>
            <a href="#comunidade" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Comunidade
            </a>
          </div>

          {/* User Menu or CTA Buttons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <KeyboardArrowDownIcon sx={{ fontSize: 18, color: '#6b7280' }} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to={getDashboardPath()}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <DashboardIcon sx={{ fontSize: 18 }} />
                        Dashboard
                      </Link>
                      <Link
                        to={getProfilePath()}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <PersonIcon sx={{ fontSize: 18 }} />
                        Meu Perfil
                      </Link>
                      <Link
                        to={getSettingsPath()}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <SettingsIcon sx={{ fontSize: 18 }} />
                        Configurações
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogoutIcon sx={{ fontSize: 18 }} />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5"
                >
                  Entrar
                </Link>
                <Link
                  to="/signup"
                  className="bg-gray-900 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Começar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-1.5 text-gray-600 hover:text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <CloseIcon sx={{ fontSize: 24 }} />
            ) : (
              <MenuIcon sx={{ fontSize: 24 }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-gray-100">
            <Link
              to="/explore"
              className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Explorar
            </Link>
            <Link
              to="/pricing"
              className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Planos
            </Link>
            <a
              href="#como-funciona"
              className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Como Funciona
            </a>
            <a
              href="#comunidade"
              className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Comunidade
            </a>
            {isAuthenticated && user ? (
              <div className="pt-3 space-y-2 border-t border-gray-100">
                <div className="flex items-center gap-3 px-2 py-2">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors py-2 px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <DashboardIcon sx={{ fontSize: 18 }} />
                  Dashboard
                </Link>
                <Link
                  to={getProfilePath()}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors py-2 px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PersonIcon sx={{ fontSize: 18 }} />
                  Meu Perfil
                </Link>
                <Link
                  to={getSettingsPath()}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors py-2 px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <SettingsIcon sx={{ fontSize: 18 }} />
                  Configurações
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors py-2 px-2"
                >
                  <LogoutIcon sx={{ fontSize: 18 }} />
                  Sair
                </button>
              </div>
            ) : (
              <div className="pt-3 space-y-2 border-t border-gray-100">
                <Link
                  to="/login"
                  className="block text-sm text-gray-600 hover:text-gray-900 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/signup"
                  className="block w-full bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Começar
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
