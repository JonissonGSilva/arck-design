import { Link } from 'react-router-dom'
import { MapPin, Star, Building2 } from 'lucide-react'

interface Creator {
  id: string
  name: string
  location: string
  specialty: string
  rating: number
  projects: number
  avatar: string
}

const Community = () => {
  const creators: Creator[] = [
    {
      id: '1',
      name: 'Ana Silva Arquitetura',
      location: 'São Paulo, SP',
      specialty: 'Projetos Residenciais',
      rating: 4.9,
      projects: 45,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '2',
      name: 'Carlos Mendes & Associados',
      location: 'Rio de Janeiro, RJ',
      specialty: 'Arquitetura Comercial',
      rating: 4.8,
      projects: 62,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '3',
      name: 'Mariana Costa Design',
      location: 'Belo Horizonte, MG',
      specialty: 'Design de Interiores',
      rating: 5.0,
      projects: 78,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    {
      id: '4',
      name: 'Pedro Alves Arquitetura',
      location: 'Porto Alegre, RS',
      specialty: 'Arquitetura Sustentável',
      rating: 4.7,
      projects: 53,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
  ]

  return (
    <section id="comunidade" className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Comunidade de arquitetos
          </h2>
          <p className="text-xl text-gray-600">
            Encontre arquitetos e designers por região. Descubra escritórios e profissionais especializados em projetos residenciais, comerciais e interiores.
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {creators.map((creator) => (
            <Link
              key={creator.id}
              to={`/architect/${creator.id}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
            >
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{creator.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{creator.location}</span>
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                  {creator.specialty}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{creator.rating}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {creator.projects} projetos
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-semibold text-lg">
            Ver todos os arquitetos →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Community

