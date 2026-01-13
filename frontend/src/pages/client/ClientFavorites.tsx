import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { favoritesService } from '../../services'

interface FavoriteArchitect {
  id: string
  username: string
  displayName: string
  avatar?: string
  city?: string
  state?: string
  specialties: string[]
  rating: number
  reviewCount: number
}

const ClientFavorites: React.FC = () => {
  const { showToast } = useToast()
  const [favorites, setFavorites] = useState<FavoriteArchitect[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    setIsLoading(true)
    try {
      const response = await favoritesService.listFavorites()
      if (response.data) {
        setFavorites(response.data as unknown as FavoriteArchitect[])
      }
    } catch {
      showToast('Erro ao carregar favoritos', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveFavorite = async (architectId: string) => {
    try {
      await favoritesService.removeFavorite(architectId)
      setFavorites(prev => prev.filter(f => f.id !== architectId))
      showToast('Arquiteto removido dos favoritos', 'success')
    } catch {
      showToast('Erro ao remover dos favoritos', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Arquitetos Favoritos</h1>
        <p className="text-gray-600">Seus arquitetos salvos para referência rápida</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum favorito ainda
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Explore nossos arquitetos e salve seus favoritos clicando no ícone de coração.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Explorar Arquitetos
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map(architect => (
            <div key={architect.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {architect.avatar ? (
                      <img src={architect.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">
                        {architect.displayName?.charAt(0).toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{architect.displayName}</h3>
                    <p className="text-sm text-gray-500">
                      {architect.city && architect.state ? `${architect.city}, ${architect.state}` : 'Localização não informada'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(architect.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                  title="Remover dos favoritos"
                >
                  ❤️
                </button>
              </div>

              {/* Especialidades */}
              <div className="flex flex-wrap gap-2 mb-4">
                {architect.specialties?.slice(0, 3).map((spec, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-500">⭐</span>
                <span className="font-medium">{architect.rating?.toFixed(1) || '—'}</span>
                <span className="text-gray-400">({architect.reviewCount || 0} avaliações)</span>
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Link
                  to={`/portfolio/${architect.username}`}
                  className="flex-1 px-4 py-2 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                >
                  Ver perfil
                </Link>
                <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm">
                  Mensagem
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClientFavorites

