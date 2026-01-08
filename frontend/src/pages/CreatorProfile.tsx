import { MapPin, Star, Mail, Phone, Globe, Instagram, Facebook, Building2, Eye, Heart, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const CreatorProfile = () => {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)

  const architect = {
    id: '1',
    name: 'Ana Silva Arquitetura',
    username: 'anasilva',
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
      website: 'www.anasilva.arq.br',
      instagram: '@anasilva.arquitetura',
      facebook: 'anasilva.arquitetura',
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
      {/* Cover Image */}
      <div className="relative h-80 bg-gray-900">
        <img
          src={architect.coverImage}
          alt="Cover"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors text-gray-900 font-medium flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <img
              src={architect.avatar}
              alt={architect.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{architect.name}</h1>
                  <p className="text-lg text-primary-600 font-medium mb-2">{architect.specialty}</p>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {architect.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      CAU {architect.cau}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-3 rounded-lg border transition-all ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <Link
                    to={`/contato/${architect.id}`}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    Solicitar Orçamento
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{architect.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">{architect.reviewsCount} avaliações</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 mb-1">{architect.projectsCount}</div>
                  <div className="text-sm text-gray-600">Projetos</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 mb-1">{architect.yearsExperience}</div>
                  <div className="text-sm text-gray-600">Anos</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Eye className="h-4 w-4 text-gray-600" />
                    <span className="font-bold text-gray-900">
                      {projects.reduce((sum, p) => sum + p.views, 0).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Visualizações</div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-700 mt-4 leading-relaxed">{architect.bio}</p>

              {/* Specialties */}
              <div className="mt-4 flex flex-wrap gap-2">
                {architect.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informações de Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {architect.contact.email && (
              <a
                href={`mailto:${architect.contact.email}`}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm truncate">{architect.contact.email}</span>
              </a>
            )}
            {architect.contact.phone && (
              <a
                href={`tel:${architect.contact.phone}`}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span className="text-sm">{architect.contact.phone}</span>
              </a>
            )}
            {architect.contact.website && (
              <a
                href={`https://${architect.contact.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm truncate">{architect.contact.website}</span>
              </a>
            )}
            {architect.contact.instagram && (
              <a
                href={`https://instagram.com/${architect.contact.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-sm">{architect.contact.instagram}</span>
              </a>
            )}
          </div>
        </div>

        {/* Projects Gallery */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfólio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projeto/${project.id}`}
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
                    <h3 className="font-bold text-lg">{project.title}</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium px-2 py-1 bg-primary-50 text-primary-700 rounded">
                      {project.category}
                    </span>
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Eye className="h-4 w-4" />
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

export default CreatorProfile
