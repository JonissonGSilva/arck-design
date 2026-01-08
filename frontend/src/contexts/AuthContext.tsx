import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type UserType = 'arquiteto' | 'cliente' | null

interface User {
  id: string
  name: string
  email: string
  type: UserType
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, type: UserType) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('arckdesign_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('arckdesign_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, type: UserType): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulação de login - em produção seria uma chamada à API
    // Aqui você pode criar usuários de teste diferentes
    const mockUsers: Record<string, { user: User; password: string }> = {
      // Arquitetos
      'arquiteto@arckdesign.com': {
        user: {
          id: '1',
          name: 'Carlos Mendes',
          email: 'arquiteto@arckdesign.com',
          type: 'arquiteto',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        },
        password: '123456',
      },
      'carlos@arckdesign.com': {
        user: {
          id: '1',
          name: 'Carlos Mendes',
          email: 'carlos@arckdesign.com',
          type: 'arquiteto',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        },
        password: '123456',
      },
      // Clientes
      'cliente@arckdesign.com': {
        user: {
          id: '2',
          name: 'Marina Silva',
          email: 'cliente@arckdesign.com',
          type: 'cliente',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        },
        password: '123456',
      },
      'marina@arckdesign.com': {
        user: {
          id: '2',
          name: 'Marina Silva',
          email: 'marina@arckdesign.com',
          type: 'cliente',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        },
        password: '123456',
      },
    }

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))

    const userData = mockUsers[email.toLowerCase()]
    
    if (userData && userData.password === password) {
      // Verificar se o tipo corresponde
      if (userData.user.type === type) {
        setUser(userData.user)
        localStorage.setItem('arckdesign_user', JSON.stringify(userData.user))
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('arckdesign_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

