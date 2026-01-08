import { useState } from 'react'
import { Search, MapPin, Star, Building2, Filter, ChevronDown, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

interface Architect {
  id: string
  name: string
  location: string
  specialty: string
  rating: number
  projects: number
  avatar: string
  coverImage: string
  description: string
  tags: string[]
  price: string
}

const Explore = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [selectedLocation, setSelectedLocation] = useState('Todas')
  const [showFilters, setShowFilters] = useState(false)

  const architects: Architect[] = [
    {
      id: '1',
      name: 'Ana Silva',
      location: 'São Paulo, SP',
      specialty: 'Arquitetura Residencial',
      rating: 4.9,
      projects: 87,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=400&fit=crop',
      description: 'Especialista em projetos residenciais modernos com mais de 10 anos de experiência',
      tags: ['Residencial', 'Moderno', 'Sustentável'],
      price: 'A partir de R$ 8.000',
    },
    {
      id: '2',
      name: 'Carlos Mendes',
      location: 'Rio de Janeiro, RJ',
      specialty: 'Design Comercial',
      rating: 4.8,
      projects: 62,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
      description: 'Projetos comerciais e corporativos que transformam espaços em experiências',
      tags: ['Comercial', 'Corporativo', 'Minimalista'],
      price: 'A partir de R$ 12.000',
    },
    {
      id: '3',
      name: 'Mariana Costa',
      location: 'Belo Horizonte, MG',
      specialty: 'Design de Interiores',
      rating: 5.0,
      projects: 124,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=400&fit=crop',
      description: 'Design de interiores que une funcionalidade e estética com identidade única',
      tags: ['Interiores', 'Design', 'Personalizado'],
      price: 'A partir de R$ 6.000',
    },
    {
      id: '4',
      name: 'Roberto Oliveira',
      location: 'Curitiba, PR',
      specialty: 'Arquitetura Sustentável',
      rating: 4.9,
      projects: 53,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=400&fit=crop',
      description: 'Projetos sustentáveis com foco em eficiência energética e materiais ecológicos',
      tags: ['Sustentável', 'Eco-friendly', 'LEED'],
      price: 'A partir de R$ 10.000',
    },
    {
      id: '5',
      name: 'Juliana Santos',
      location: 'Porto Alegre, RS',
      specialty: 'Reforma e Retrofit',
      rating: 4.7,
      projects: 96,
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=400&fit=crop',
      description: 'Especialista em reformas e retrofit, valorizando o patrimônio existente',
      tags: ['Reforma', 'Retrofit', 'Restauração'],
      price: 'A partir de R$ 7.000',
    },
    {
      id: '6',
      name: 'Pedro Almeida',
      location: 'Brasília, DF',
      specialty: 'Urbanismo',
      rating: 4.8,
      projects: 41,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=400&fit=crop',
      description: 'Projetos urbanos e planejamento de espaços públicos',
      tags: ['Urbanismo', 'Planejamento', 'Público'],
      price: 'A partir de R$ 15.000',
    },
  ]

  const categories = [
    'Todos',
    'Residencial',
    'Comercial',
    'Interiores',
    'Sustentável',
    'Reforma',
    'Urbanismo',
  ]

  const locations = [
    'Todas',
    'São Paulo, SP',
    'Rio de Janeiro, RJ',
    'Belo Horizonte, MG',
    'Curitiba, PR',
    'Porto Alegre, RS',
    'Brasília, DF',
  ]

  const filteredArchitects = architects.filter((architect) => {
    const matchesSearch =
      architect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      architect.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      architect.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'Todos' ||
      architect.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      architect.specialty.toLowerCase().includes(selectedCategory.toLowerCase())

    const matchesLocation =
      selectedLocation === 'Todas' || architect.location === selectedLocation

    return matchesSearch && matchesCategory && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Encontre o Arquiteto Ideal
          </h1>
          <p className="text-gray-600 text-lg">
            Conecte-se com profissionais qualificados para o seu projeto
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nome, especialidade ou tipo de projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg mb-4"
          >
            <span className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </span>
            <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Filters */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredArchitects.length}</span>{' '}
            {filteredArchitects.length === 1 ? 'arquiteto encontrado' : 'arquitetos encontrados'}
          </p>
        </div>

        {/* Architects Grid */}
        {filteredArchitects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArchitects.map((architect) => (
              <Link
                key={architect.id}
                to={`/architect/${architect.id}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={architect.coverImage}
                    alt={architect.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-sm">{architect.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Avatar and Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={architect.avatar}
                      alt={architect.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {architect.name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {architect.location}
                      </p>
                    </div>
                  </div>

                  {/* Specialty */}
                  <div className="mb-2">
                    <span className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                      {architect.specialty}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {architect.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {architect.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Building2 className="h-4 w-4" />
                      <span>{architect.projects} projetos</span>
                    </div>
                    <span className="text-sm font-semibold text-primary-600">
                      {architect.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum arquiteto encontrado
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore
