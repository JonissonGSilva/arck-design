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
import { Link } from 'react-router-dom'
import { useState } from 'react'

const PublicProfile = () => {
  const [isFavorite, setIsFavorite] = useState(false)

  const architect = {
    id: '1',
    name: 'Ana Silva Arquitetura',
    location: 'São Paulo, SP',
    specialty: 'Arquitetura Residencial',
    rating: 4.9,
    reviewsCount: 127,
    projectsCount: 87,
    yearsExperience: '10+',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=400&fit=crop',
    bio: 'Arquiteta especializada em projetos residenciais modernos com mais de 10 anos de experiência. Meu trabalho é criar espaços que unem funcionalidade, estética e sustentabilidade, transformando sonhos em realidade.',
    cau: 'A12345678',
    specialties: ['Residencial', 'Sustentabilidade', 'Modernismo', 'Interiores'],
    contact: {
      email: 'contato@anasilva.arq.br',
      phone: '(11) 98765-4321',
      website: 'https://www.anasilva.arq.br',
      instagram: '@anasilva.arquitetura',
      instagramUrl: 'https://instagram.com/anasilva.arquitetura',
      facebook: 'anasilva.arquitetura',
      facebookUrl: 'https://facebook.com/anasilva.arquitetura',
    },
  }

  const projects = [
    {
      id: '1',
      title: 'Residência Oliveira',
      category: 'Residencial',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
      views: 1240,
    },
    {
      id: '2',
      title: 'Edifício Comercial Centro',
      category: 'Comercial',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      views: 892,
    },
    {
      id: '3',
      title: 'Design de Interiores Apto 302',
      category: 'Interiores',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop',
      views: 678,
    },
    {
      id: '4',
      title: 'Casa Sustentável Alphaville',
      category: 'Residencial',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
      views: 445,
    },
    {
      id: '5',
      title: 'Reforma Residencial Jardins',
      category: 'Reforma',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&h=400&fit=crop',
      views: 2156,
    },
    {
      id: '6',
      title: 'Consultório Médico',
      category: 'Comercial',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=400&fit=crop',
      views: 1567,
    },
  ]

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
                src={architect.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Avatar Overlapping */}
            <div className="px-4 md:px-6 pb-4 md:pb-6">
              <div className="relative -mt-12 md:-mt-16 inline-block">
                <img
                  src={architect.avatar}
                  alt={architect.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-4 md:px-6 pb-6 md:pb-8">
            {/* Header with Name and Actions */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{architect.name}</h1>
                <p className="text-sm md:text-base lg:text-lg text-primary-600 font-medium mb-2">{architect.specialty}</p>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-gray-600 text-xs md:text-sm">
                  <span className="flex items-center gap-1">
                    <LocationOnIcon sx={{ fontSize: 14 }} />
                    {architect.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <ApartmentIcon sx={{ fontSize: 14 }} />
                    CAU {architect.cau}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
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
                <Link
                  to={`/architect/${architect.id}`}
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
                  <span className="font-bold text-gray-900 text-sm md:text-base">{architect.rating}</span>
                </div>
                <div className="text-xs md:text-sm text-gray-600">{architect.reviewsCount} avaliações</div>
              </div>
              <div>
                <div className="text-lg md:text-xl font-bold text-gray-900 mb-1">{architect.projectsCount}</div>
                <div className="text-xs md:text-sm text-gray-600">Projetos</div>
              </div>
              <div>
                <div className="text-lg md:text-xl font-bold text-gray-900 mb-1">{architect.yearsExperience}</div>
                <div className="text-xs md:text-sm text-gray-600">Anos</div>
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                  <VisibilityIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                  <span className="font-bold text-gray-900 text-sm md:text-base">
                    {projects.reduce((sum, p) => sum + p.views, 0).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="text-xs md:text-sm text-gray-600">Visualizações</div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">{architect.bio}</p>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2">
              {architect.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-2 md:px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs md:text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">Informações de Contato</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {architect.contact.email && (
              <a
                href={`mailto:${architect.contact.email}`}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm"
              >
                <EmailIcon sx={{ fontSize: 18 }} />
                <span className="truncate">{architect.contact.email}</span>
              </a>
            )}
            {architect.contact.phone && (
              <a
                href={`tel:${architect.contact.phone}`}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm"
              >
                <PhoneIcon sx={{ fontSize: 18 }} />
                <span>{architect.contact.phone}</span>
              </a>
            )}
            {architect.contact.website && (
              <a
                href={architect.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm"
              >
                <LanguageIcon sx={{ fontSize: 18 }} />
                <span className="truncate">{architect.contact.website.replace('https://', '').replace('http://', '')}</span>
              </a>
            )}
            {architect.contact.instagramUrl && (
              <a
                href={architect.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm"
              >
                <InstagramIcon sx={{ fontSize: 18 }} />
                <span className="truncate">{architect.contact.instagram}</span>
              </a>
            )}
            {architect.contact.facebookUrl && (
              <a
                href={architect.contact.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors text-sm"
              >
                <FacebookIcon sx={{ fontSize: 18 }} />
                <span className="truncate">{architect.contact.facebook}</span>
              </a>
            )}
          </div>
        </div>

        {/* Projects Gallery */}
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
                    src={project.image}
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
                      {project.category}
                    </span>
                    <span className="text-xs md:text-sm text-gray-600 flex items-center gap-1">
                      <VisibilityIcon sx={{ fontSize: 14 }} />
                      {project.views}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicProfile
