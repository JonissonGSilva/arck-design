import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import StarIcon from '@mui/icons-material/Star'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LanguageIcon from '@mui/icons-material/Language'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import ApartmentIcon from '@mui/icons-material/Apartment'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VerifiedIcon from '@mui/icons-material/Verified'
import { profileService, favoritesService, projectService } from '../services'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'
import type { Project } from '../types/api'
import type { PublicProfile as PublicProfileType } from '../services/profile.service'

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { isAuthenticated, user } = useAuth()

  const [profile, setProfile] = useState<PublicProfileType | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) return

      setLoading(true)

      const response = await profileService.getPublicProfile(username)

      if (response.data) {
        setProfile(response.data)
        // Carregar projetos do arquiteto
        if (response.data.userId) {
          const projectsResponse = await projectService.list()
          if (projectsResponse.data) {
            // Filtrar projetos do arquiteto (se necessário implementar no backend)
            setProjects(projectsResponse.data.data || [])
          }
        }
      } else if (response.error) {
        showToast('Perfil não encontrado', 'error')
        navigate('/explore')
      }

      setLoading(false)
    }

    loadProfile()
  }, [username])

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      showToast('Faça login para adicionar aos favoritos', 'warning')
      navigate('/login')
      return
    }

    if (!profile?.userId) return

    if (isFavorite) {
      const response = await favoritesService.removeFavorite(profile.userId)
      if (response.data) {
        setIsFavorite(false)
        showToast('Removido dos favoritos', 'success')
      }
    } else {
      const response = await favoritesService.addFavorite(profile.userId)
      if (response.data) {
        setIsFavorite(true)
        showToast('Adicionado aos favoritos', 'success')
      }
    }
  }

  // Formatar localização
  const formatLocation = (): string => {
    if (!profile?.location?.address) return 'Localização não informada'
    const { city, state } = profile.location.address
    if (city && state) return `${city}, ${state}`
    if (city) return city
    if (state) return state
    return 'Localização não informada'
  }

  // Avatar fallback
  const renderAvatar = () => {
    if (profile?.avatar) {
      return (
        <img
          src={profile.avatar}
          alt={profile.displayName}
          className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl"
        />
      )
    }
    return (
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-4xl font-bold">
        {profile?.displayName?.charAt(0).toUpperCase() || 'A'}
      </div>
    )
  }

  // Cover image fallback
  const getCoverImage = (): string => {
    if (profile?.coverImage) return profile.coverImage
    return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=400&fit=crop'
  }

  // Project cover fallback
  const getProjectCover = (project: Project): string => {
    if (project.coverImage) return project.coverImage
    return 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil não encontrado</h2>
          <p className="text-gray-600 mb-4">O arquiteto que você procura não existe.</p>
          <Link to="/explore" className="text-primary-600 hover:underline">
            Voltar para explorar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-12">
        {/* Back Button */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-1 mb-4 md:mb-6 px-3 md:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm font-medium shadow-sm"
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          Voltar
        </Link>

        {/* Profile Header - LinkedIn Style */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6 md:mb-8">
          {/* Cover Image with Overlapping Avatar */}
          <div className="relative">
            {/* Cover Image */}
            <div className="relative h-48 md:h-56 bg-gray-900">
              <img
                src={getCoverImage()}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Avatar Overlapping */}
            <div className="px-4 md:px-6 pb-4 md:pb-6">
              <div className="relative -mt-12 md:-mt-16 inline-block">
                {renderAvatar()}
                {profile.verification?.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <VerifiedIcon sx={{ fontSize: 20, color: 'white' }} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-4 md:px-6 pb-6 md:pb-8">
            {/* Header with Name and Actions */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 md:mb-2">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                    {profile.displayName}
                  </h1>
                  {profile.verification?.verified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verificado
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base lg:text-lg text-primary-600 font-medium mb-2">
                  {profile.specialty || 'Arquiteto(a)'}
                </p>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-gray-600 text-xs md:text-sm">
                  <span className="flex items-center gap-1">
                    <LocationOnIcon sx={{ fontSize: 14 }} />
                    {formatLocation()}
                  </span>
                  {profile.cau && (
                    <span className="flex items-center gap-1">
                      <ApartmentIcon sx={{ fontSize: 14 }} />
                      CAU {profile.cau}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                {user?.role !== 'arquiteto' && (
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 md:p-2.5 rounded-lg border transition-all ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {isFavorite ? (
                      <FavoriteIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                    )}
                  </button>
                )}
                <Link
                  to={isAuthenticated ? `/client/messages?architect=${profile.username}` : '/login'}
                  className="px-4 md:px-6 py-2 md:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-xs md:text-sm"
                >
                  Solicitar Orçamento
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 py-3 md:py-4 border-t border-b border-gray-200 mb-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-1 text-gray-600 mb-1">
                  <StarIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
                  <span className="font-bold text-gray-900 text-sm md:text-base">
                    {profile.ratings?.average?.toFixed(1) || 'Novo'}
                  </span>
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {profile.ratings?.total || 0} avaliações
                </div>
              </div>
              <div>
                <div className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  {profile.projectsCount || 0}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Projetos</div>
              </div>
              <div>
                <div className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                  {profile.experience || '-'}
                </div>
                <div className="text-xs md:text-sm text-gray-600">Anos</div>
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                  <VisibilityIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                  <span className="font-bold text-gray-900 text-sm md:text-base">
                    {profile.viewsCount?.toLocaleString('pt-BR') || 0}
                  </span>
                </div>
                <div className="text-xs md:text-sm text-gray-600">Visualizações</div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                {profile.bio}
              </p>
            )}

            {/* Specialties */}
            {profile.specialties && profile.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 md:px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs md:text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        {(profile.contact?.email || profile.contact?.phone || profile.contact?.website || profile.social) && (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">Informações de Contato</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {profile.contact?.email && (
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm"
                >
                  <EmailIcon sx={{ fontSize: 18 }} />
                  <span className="truncate">{profile.contact.email}</span>
                </a>
              )}
              {profile.contact?.phone && (
                <a
                  href={`tel:${profile.contact.phone}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm"
                >
                  <PhoneIcon sx={{ fontSize: 18 }} />
                  <span>{profile.contact.phone}</span>
                </a>
              )}
              {profile.contact?.website && (
                <a
                  href={profile.contact.website.startsWith('http') ? profile.contact.website : `https://${profile.contact.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm"
                >
                  <LanguageIcon sx={{ fontSize: 18 }} />
                  <span className="truncate">{profile.contact.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
              {profile.social?.instagram && (
                <a
                  href={profile.social.instagram.url || `https://instagram.com/${profile.social.instagram.username?.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm"
                >
                  <InstagramIcon sx={{ fontSize: 18 }} />
                  <span className="truncate">{profile.social.instagram.username || ''}</span>
                </a>
              )}
              {profile.social?.facebook && (
                <a
                  href={profile.social.facebook.url || `https://facebook.com/${profile.social.facebook.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm"
                >
                  <FacebookIcon sx={{ fontSize: 18 }} />
                  <span className="truncate">{profile.social.facebook.username || ''}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Projects Gallery */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Portfólio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={getProjectCover(project)}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="font-bold text-base md:text-lg">{project.title}</h3>
                    </div>
                  </div>

                  <div className="p-3 md:p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium px-2 py-1 bg-primary-50 text-primary-700 rounded">
                        {project.category || 'Projeto'}
                      </span>
                      <span className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                        <VisibilityIcon sx={{ fontSize: 14 }} />
                        {project.views || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {projects.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <ApartmentIcon sx={{ fontSize: 48, color: '#d1d5db' }} />
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">Nenhum projeto publicado</h3>
            <p className="text-gray-600">Este arquiteto ainda não publicou projetos no portfólio.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicProfile
