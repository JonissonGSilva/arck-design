import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { UserType } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedTypes?: UserType[]
}

const ProtectedRoute = ({ children, allowedTypes }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedTypes && user && !allowedTypes.includes(user.type)) {
    // Redirecionar baseado no tipo de usuário
    if (user.type === 'arquiteto') {
      return <Navigate to="/architect/dashboard" replace />
    } else if (user.type === 'cliente') {
      return <Navigate to="/client/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

