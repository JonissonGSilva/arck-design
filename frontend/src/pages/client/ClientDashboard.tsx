import { FolderTree, Calendar, Building2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ClientDashboard = () => {
  const projects = [
    {
      id: '1',
      title: 'Residência Silva - Projeto Completo',
      architect: 'Ana Silva Arquitetura',
      filesCount: 45,
      lastUpdate: '15/12/2025',
      coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop',
      status: 'em-andamento',
    },
    {
      id: '2',
      title: 'Reforma Apartamento Centro',
      architect: 'Carlos Mendes',
      filesCount: 28,
      lastUpdate: '10/12/2025',
      coverImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=300&h=200&fit=crop',
      status: 'aguardando-aprovacao',
    },
  ]

  const appointments = [
    {
      id: '1',
      title: 'Apresentação de Projeto',
      architect: 'Ana Silva Arquitetura',
      date: '20 de Janeiro',
      time: '14:00',
      type: 'reuniao',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta!</h1>
        <p className="text-gray-600 mt-2">Acompanhe seus projetos e reuniões agendadas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Projetos Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <FolderTree className="h-8 w-8 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Próximas Reuniões</p>
              <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
            </div>
            <div className="p-3 bg-accent-50 rounded-lg">
              <Calendar className="h-8 w-8 text-accent-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Arquitetos Favoritos</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Projetos Recentes</h2>
          <Link 
            to="/cliente/projetos"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/cliente/projeto/${project.id}`}
              className="group flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:-translate-y-1"
            >
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">por {project.architect}</p>
                <p className="text-xs text-gray-500">
                  {project.filesCount} arquivos • Atualizado em {project.lastUpdate}
                </p>
                <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                  project.status === 'em-andamento'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {project.status === 'em-andamento' ? 'Em Andamento' : 'Aguardando Aprovação'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Próximas Reuniões</h2>
          <Link 
            to="/cliente/agendamentos"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1"
          >
            Ver agenda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-3 bg-primary-50 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{appointment.title}</h3>
                <p className="text-sm text-gray-600 mb-2">com {appointment.architect}</p>
                <p className="text-xs text-gray-500">
                  {appointment.date} às {appointment.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Precisa de um arquiteto?</h2>
            <p className="text-primary-100">
              Explore nossa comunidade de profissionais e encontre o arquiteto perfeito para seu projeto.
            </p>
          </div>
          <Link
            to="/explorar"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold whitespace-nowrap flex items-center gap-2"
          >
            Explorar Arquitetos
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
