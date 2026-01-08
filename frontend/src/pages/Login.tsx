import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Building2, Eye, EyeOff, Briefcase, Ruler } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { UserType } from '../contexts/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<UserType>('arquiteto')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as any)?.from?.pathname || (userType === 'arquiteto' ? '/arquiteto' : '/cliente')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password, userType)
      
      if (success) {
        navigate(from, { replace: true })
      } else {
        setError('Email ou senha incorretos, ou tipo de conta não corresponde.')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center py-8 md:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-md w-full mx-auto relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary-600 rounded-xl shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">ArckDesign</span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Bem-vindo de volta
          </h2>
          <p className="mt-2 text-stone-300">
            Entre na sua conta para continuar
          </p>
        </div>

        {/* User Type Selection */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setUserType('arquiteto')}
            className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
              userType === 'arquiteto'
                ? 'border-primary-500 bg-primary-600/20 shadow-lg shadow-primary-500/30'
                : 'border-stone-700 hover:border-stone-600 bg-stone-800/50'
            }`}
          >
            <div className={`flex flex-col items-center ${
              userType === 'arquiteto' ? 'text-white' : 'text-stone-400'
            }`}>
              <Ruler className={`h-7 w-7 mb-2 ${
                userType === 'arquiteto' ? 'text-primary-400' : 'text-stone-500'
              }`} />
              <div className="text-sm font-semibold">Arquiteto</div>
              <div className="text-xs mt-1 opacity-75">Profissional</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setUserType('cliente')}
            className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
              userType === 'cliente'
                ? 'border-accent-500 bg-accent-600/20 shadow-lg shadow-accent-500/30'
                : 'border-stone-700 hover:border-stone-600 bg-stone-800/50'
            }`}
          >
            <div className={`flex flex-col items-center ${
              userType === 'cliente' ? 'text-white' : 'text-stone-400'
            }`}>
              <Briefcase className={`h-7 w-7 mb-2 ${
                userType === 'cliente' ? 'text-accent-400' : 'text-stone-500'
              }`} />
              <div className="text-sm font-semibold">Cliente</div>
              <div className="text-xs mt-1 opacity-75">Contratar</div>
            </div>
          </button>
        </div>

        {/* Login Form */}
        <div className="bg-stone-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-stone-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-900/50 border border-stone-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-stone-500"
                  placeholder="seu@email.com"
                />
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {userType === 'arquiteto' 
                  ? 'Teste: arquiteto@arckdesign.com ou carlos@arckdesign.com'
                  : 'Teste: cliente@arckdesign.com ou marina@arckdesign.com'
                }
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-stone-900/50 border border-stone-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all placeholder-stone-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-stone-400 mt-1">Senha padrão: 123456</p>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-stone-600 rounded focus:ring-primary-500 bg-stone-900/50"
                />
                <span className="ml-2 text-sm text-stone-300">Lembrar de mim</span>
              </label>
              <Link to="/recuperar-senha" className="text-sm text-primary-400 hover:text-primary-300 font-medium">
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                userType === 'arquiteto'
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-accent-500 hover:bg-accent-600 text-white'
              }`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-stone-800/80 text-stone-400">Ou continue com</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center px-4 py-3 border border-stone-700 rounded-lg hover:bg-stone-700/50 transition-colors bg-stone-900/30">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium text-stone-300">Google</span>
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-stone-700 rounded-lg hover:bg-stone-700/50 transition-colors bg-stone-900/30">
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium text-stone-300">Facebook</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center text-sm text-stone-300">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="text-primary-400 hover:text-primary-300 font-semibold">
            Cadastre-se gratuitamente
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
