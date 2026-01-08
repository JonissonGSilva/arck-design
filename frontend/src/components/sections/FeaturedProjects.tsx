import { Link } from 'react-router-dom'
import { ExternalLink, Eye } from 'lucide-react'
import { useState } from 'react'

interface Project {
  id: string
  title: string
  creator: string
  category: string
  image: string
  views: number
}

const FeaturedProjects = () => {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'Residência Moderna - Jardins',
      creator: 'Ana Silva Arquitetura',
      category: 'Residencial',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      views: 2840,
    },
    {
      id: '2',
      title: 'Edifício Comercial Centro',
      creator: 'Carlos Mendes & Associados',
      category: 'Comercial',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      views: 1892,
    },
    {
      id: '3',
      title: 'Loft Contemporâneo',
      creator: 'Mariana Costa Design',
      category: 'Interiores',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop',
      views: 3256,
    },
    {
      id: '4',
      title: 'Casa de Campo Minimalista',
      creator: 'Pedro Alves Arquitetura',
      category: 'Residencial',
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
      views: 2178,
    },
  ])

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Projetos reais de arquitetos na ArckDesign
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Explore projetos residenciais, comerciais e de interiores compartilhados pela nossa comunidade de arquitetos.
          </p>
          <Link to="/explore" className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2 mx-auto">
            Explorar projetos
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/3] cursor-pointer hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs font-medium text-primary-300 mb-1 block">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-300 mb-2">por {project.creator}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Eye className="h-4 w-4" />
                    <span>{project.views.toLocaleString('pt-BR')} visualizações</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProjects

