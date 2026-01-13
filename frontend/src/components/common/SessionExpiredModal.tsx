import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SessionExpiredModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsVisible(true)
    }

    window.addEventListener('auth:logout', handleSessionExpired)
    return () => window.removeEventListener('auth:logout', handleSessionExpired)
  }, [])

  const handleLogin = () => {
    setIsVisible(false)
    navigate('/login')
  }

  const handleClose = () => {
    setIsVisible(false)
    navigate('/')
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-fade-in">
        {/* Ícone */}
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">⏰</span>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Sua sessão expirou
        </h2>

        {/* Mensagem */}
        <p className="text-gray-600 mb-8">
          Por segurança, sua sessão foi encerrada após um período de inatividade.
          Faça login novamente para continuar.
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Ir para Home
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Fazer Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionExpiredModal


