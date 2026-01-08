import VisibilityIcon from '@mui/icons-material/Visibility'
import FolderIcon from '@mui/icons-material/Folder'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AddIcon from '@mui/icons-material/Add'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ScheduleIcon from '@mui/icons-material/Schedule'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Link } from 'react-router-dom'

interface StatCard {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: 'up' | 'down'
  color: string
}

const Dashboard = () => {
  const stats: StatCard[] = [
    {
      title: 'Visualizações',
      value: '8.2k',
      change: '+15.3%',
      icon: <VisibilityIcon sx={{ fontSize: 24 }} />,
      trend: 'up',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Projetos Ativos',
      value: '12',
      change: '+3',
      icon: <FolderIcon sx={{ fontSize: 24 }} />,
      trend: 'up',
      color: 'from-primary-500 to-primary-600',
    },
    {
      title: 'Clientes',
      value: '48',
      change: '+8',
      icon: <PeopleIcon sx={{ fontSize: 24 }} />,
      trend: 'up',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 42k',
      change: '+22%',
      icon: <AttachMoneyIcon sx={{ fontSize: 24 }} />,
      trend: 'up',
      color: 'from-accent-500 to-accent-600',
    },
  ]

  const recentProjects = [
    {
      id: '1',
      title: 'Residência Silva - Alto da Boa Vista',
      client: 'Família Silva',
      date: '05 Jan 2026',
      status: 'Projeto Executivo',
      statusColor: 'bg-blue-100 text-blue-700',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop',
      progress: 75,
    },
    {
      id: '2',
      title: 'Edifício Comercial Centro',
      client: 'Construtora ABC',
      date: '28 Dez 2025',
      status: 'Aprovação Municipal',
      statusColor: 'bg-yellow-100 text-yellow-700',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
      progress: 45,
    },
    {
      id: '3',
      title: 'Design de Interiores - Apto 302',
      client: 'João Santos',
      date: '20 Dez 2025',
      status: 'Em Execução',
      statusColor: 'bg-green-100 text-green-700',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=100&h=100&fit=crop',
      progress: 90,
    },
  ]

  const upcomingEvents = [
    {
      id: '1',
      title: 'Reunião - Residência Oliveira',
      date: '2026-01-12',
      time: '14:00',
      location: 'Escritório',
      type: 'reuniao',
    },
    {
      id: '2',
      title: 'Visita à Obra - Ed. Comercial',
      date: '2026-01-15',
      time: '09:30',
      location: 'Av. Paulista, 1000',
      type: 'visita',
    },
    {
      id: '3',
      title: 'Apresentação de Projeto',
      date: '2026-01-18',
      time: '16:00',
      location: 'Cliente - Construtora XYZ',
      type: 'apresentacao',
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      weekday: 'short'
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1 text-xs md:text-sm">Bem-vindo de volta! Aqui está um resumo do seu escritório.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/arquiteto/projetos"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <AddIcon sx={{ fontSize: 18 }} />
            Novo Projeto
          </Link>
        </div>
      </div>

      {/* Stats Grid - Redesenhado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
            
            <div className="relative p-4 md:p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                  {stat.icon}
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  <TrendingUpIcon sx={{ fontSize: 14 }} />
                  {stat.change}
                </span>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-xs md:text-sm text-gray-600 font-medium">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Projects - Redesenhado */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Projetos Recentes</h2>
              <Link 
                to="/arquiteto/projetos" 
                className="text-primary-600 hover:text-primary-700 text-xs md:text-sm font-medium flex items-center gap-1"
              >
                Ver todos
                <ArrowForwardIcon sx={{ fontSize: 14 }} />
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                to={`/arquiteto/projetos/${project.id}`}
                className="block p-4 md:p-5 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm md:text-base text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                        {project.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 ${project.statusColor}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mb-3 truncate">{project.client}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Progresso</span>
                        <span className="text-xs font-semibold text-gray-700">{project.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarTodayIcon sx={{ fontSize: 12 }} />
                        {project.date}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Events - Redesenhado */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-bold text-gray-900">Próximos Eventos</h2>
              <Link 
                to="/arquiteto/agenda" 
                className="text-primary-600 hover:text-primary-700 text-xs md:text-sm font-medium flex items-center gap-1"
              >
                Ver agenda
                <ArrowForwardIcon sx={{ fontSize: 14 }} />
              </Link>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                to="/arquiteto/agenda"
                className="block p-4 md:p-5 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-primary-50 rounded-lg flex-shrink-0">
                    <CalendarTodayIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <ScheduleIcon sx={{ fontSize: 14 }} />
                        <span>{formatDate(event.date)} às {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <LocationOnIcon sx={{ fontSize: 14 }} />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions - Redesenhado */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-xl p-6 md:p-8 text-white shadow-xl overflow-hidden relative">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative max-w-3xl">
          <h2 className="text-lg md:text-xl font-bold mb-2">Pronto para iniciar um novo projeto?</h2>
          <p className="text-primary-100 mb-5 md:mb-6 text-sm md:text-base">
            Crie um novo projeto arquitetônico, agende uma reunião ou explore seu portfólio.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/arquiteto/projetos"
              className="px-5 py-2.5 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-all font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <AddIcon sx={{ fontSize: 18 }} />
              Novo Projeto
            </Link>
            <Link
              to="/arquiteto/agenda"
              className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all font-semibold text-sm flex items-center gap-2"
            >
              <CalendarTodayIcon sx={{ fontSize: 18 }} />
              Agendar Reunião
            </Link>
            <Link
              to="/arquiteto/perfil-publico"
              className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all font-semibold text-sm flex items-center gap-2"
            >
              <PeopleIcon sx={{ fontSize: 18 }} />
              Ver Portfólio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
