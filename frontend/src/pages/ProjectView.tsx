import { useState } from 'react'
import { 
  ArrowLeft, Heart, Share2, Download, MapPin, Calendar, 
  Building2, Eye, Star, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const ProjectView = () => {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const project = {
    id: '1',
    title: 'Residência Oliveira - Alto da Boa Vista',
    description: 'Projeto residencial moderno que une funcionalidade e estética. A casa foi pensada para aproveitar ao máximo a iluminação natural e as vistas privilegiadas do terreno.',
    category: 'Residencial',
    location: 'Rio de Janeiro, RJ',
    date: '15 de Dezembro, 2025',
    views: 1240,
    architect: {
      id: '1',
      name: 'Ana Silva Arquitetura',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      projects: 87,
    },
    tags: ['Residencial', 'Rio de Janeiro', 'Moderno', 'Sustentável'],
    specs: {
      area: '450 m²',
      quartos: '4 suítes',
      garagem: '4 vagas',
      estilo: 'Moderno',
    },
  }

  const images = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop',
      caption: 'Fachada Principal',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&h=800&fit=crop',
      caption: 'Sala de Estar',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop',
      caption: 'Cozinha Integrada',
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
      caption: 'Área Externa',
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=800&fit=crop',
      caption: 'Piscina e Deck',
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&h=800&fit=crop',
      caption: 'Suíte Master',
    },
  ]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Voltar</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-lg border transition-all ${
                  isFavorite
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Viewer */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="relative aspect-video bg-gray-900">
                <img
                  src={images[currentImageIndex].url}
                  alt={images[currentImageIndex].caption}
                  className="w-full h-full object-contain"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-900" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                >
                  <ChevronRight className="h-6 w-6 text-gray-900" />
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Caption */}
                <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-lg text-white text-sm">
                  {images[currentImageIndex].caption}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="p-4 grid grid-cols-6 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-primary-600 ring-2 ring-primary-200'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {project.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {project.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {project.views} visualizações
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">{project.description}</p>

              {/* Specifications */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Especificações</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(project.specs).map(([key, value]) => (
                    <div key={key} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 capitalize mb-1">{key}</p>
                      <p className="font-semibold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/explore?tag=${tag}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Architect Info */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Link
                to={`/architect/${project.architect.id}`}
                className="flex items-center gap-3 mb-4 group"
              >
                <img
                  src={project.architect.avatar}
                  alt={project.architect.name}
                  className="w-16 h-16 rounded-full border-2 border-gray-200 group-hover:border-primary-300 transition-colors"
                />
                <div>
                  <div className="text-sm text-gray-600 mb-1">Arquiteto</div>
                  <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {project.architect.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      {project.architect.rating}
                    </span>
                    <span>•</span>
                    <span>{project.architect.projects} projetos</span>
                  </div>
                </div>
              </Link>

              <Link
                to={`/architect/${project.architect.id}`}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-center block"
              >
                Solicitar Orçamento
              </Link>
            </div>

            {/* Related Projects */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 mb-4">Outros Projetos</h3>
              <div className="space-y-3">
                {images.slice(0, 3).map((image, index) => (
                  <Link
                    key={image.id}
                    to={`/project/${index + 2}`}
                    className="group flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  >
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {image.caption}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">{project.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectView
