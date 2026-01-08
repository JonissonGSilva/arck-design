import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FolderIcon from '@mui/icons-material/Folder'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AddIcon from '@mui/icons-material/Add'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { Link } from 'react-router-dom'

interface StatCard {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  trend: 'up' | 'down'
  color: string
  bgGradient: string
}

const Dashboard = () => {
  const stats: StatCard[] = [
    {
      title: 'Visualizações',
      value: '8.2k',
      change: '+15.3%',
      icon: <VisibilityIcon sx={{ fontSize: 20 }} />,
      trend: 'up',
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
    },
    {
      title: 'Projetos Ativos',
      value: '12',
      change: '+3',
      icon: <FolderIcon sx={{ fontSize: 20 }} />,
      trend: 'up',
      color: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100/50',
    },
    {
      title: 'Clientes',
      value: '48',
      change: '+8',
      icon: <PeopleIcon sx={{ fontSize: 20 }} />,
      trend: 'up',
      color: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100/50',
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 42k',
      change: '+22%',
      icon: <AttachMoneyIcon sx={{ fontSize: 20 }} />,
      trend: 'up',
      color: 'from-accent-500 to-accent-600',
      bgGradient: 'from-accent-50 to-accent-100/50',
    },
  ]

  const recentProjects = [
    {
      id: '1',
      title: 'Residência Silva - Alto da Boa Vista',
      client: 'Família Silva',
      date: '05 Jan 2026',
      status: 'Projeto Executivo',
      statusColor: 'bg-blue-100 text-blue-700 border-blue-200',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop',
      progress: 75,
    },
    {
      id: '2',
      title: 'Edifício Comercial Centro',
      client: 'Construtora ABC',
      date: '28 Dez 2025',
      status: 'Aprovação Municipal',
      statusColor: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
      progress: 45,
    },
    {
      id: '3',
      title: 'Design de Interiores - Apto 302',
      client: 'João Santos',
      date: '20 Dez 2025',
      status: 'Em Execução',
      statusColor: 'bg-green-100 text-green-700 border-green-200',
      image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=100&h=100&fit=crop',
      progress: 90,
    },
  ]

  const upcomingEvents = [
    {
      id: '1',
      title: 'Reunião - Residência Oliveira',
      date: '2026-01-11',
      time: '14:00',
      location: 'Escritório',
      type: 'reuniao',
    },
    {
      id: '2',
      title: 'Visita à Obra - Ed. Comercial',
      date: '2026-01-14',
      time: '09:30',
      location: 'Av. Paulista, 1000',
      type: 'visita',
    },
    {
      id: '3',
      title: 'Apresentação de Projeto',
      date: '2026-01-17',
      time: '16:00',
      location: 'Cliente - Construtora XYZ',
      type: 'apresentacao',
    },
  ]

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.']
    const months = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']
    const day = days[date.getDay()]
    const dayNum = date.getDate()
    const month = months[date.getMonth()]
    return `${day}, ${dayNum} de ${month}`
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 text-base md:text-lg">
              Bem-vindo de volta! Aqui está um resumo do seu escritório.
            </p>
          </div>
          <Link
            to="/architect/projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <AddIcon sx={{ fontSize: 22 }} />
            Novo Projeto
          </Link>
        </div>

        {/* Stats Grid - Design Compacto Horizontal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              {/* Background Gradient Principal */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-95 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Padrão decorativo de fundo */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
              
              <div className="relative p-4">
                <div className="flex items-center gap-3">
                  {/* Ícone à Esquerda */}
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 shadow-md">
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                  
                  {/* Dados à Direita */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md">
                          {stat.value}
                        </h3>
                        <p className="text-xs text-white/90 font-medium mt-0.5">
                          {stat.title}
                        </p>
                      </div>
                      {/* Badge de Tendência */}
                      <span className={`inline-flex items-center gap-1 flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm ${
                        stat.trend === 'up' 
                          ? 'bg-white/20 text-white border border-white/30' 
                          : 'bg-red-500/80 text-white border border-red-400/50'
                      }`}>
                        <TrendingUpIcon sx={{ fontSize: 11 }} />
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects - Novo Design */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Projetos Recentes</h2>
                <Link 
                  to="/architect/projects" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Ver todos
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/architect/projects/${project.id}`}
                  className="block p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group"
                >
                  <div className="flex items-start gap-5">
                    {/* Project Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border-2 border-gray-200 group-hover:border-primary-300 transition-colors shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center">
                        <CheckCircleIcon sx={{ fontSize: 14, color: '#10b981' }} />
                      </div>
                    </div>
                    
                    {/* Project Info */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg md:text-xl text-gray-900 mb-1.5 line-clamp-1 group-hover:text-primary-600 transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${project.statusColor}`}>
                            {project.status}
                          </span>
                          <span className="text-sm text-gray-600 font-medium">{project.client}</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Progresso</span>
                          <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full bg-gradient-to-r ${project.progress >= 75 ? 'from-green-500 to-green-600' : project.progress >= 50 ? 'from-primary-500 to-primary-600' : 'from-yellow-500 to-yellow-600'} rounded-full transition-all duration-500 shadow-sm`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarTodayIcon sx={{ fontSize: 16 }} />
                        <span className="font-medium">{project.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Upcoming Events - Novo Design */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100/50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Próximos Eventos</h2>
                <Link 
                  to="/architect/calendar" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Ver agenda
                  <ArrowForwardIcon sx={{ fontSize: 18 }} />
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  to="/architect/calendar"
                  className="block p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 group"
                >
                  <div className="space-y-3">
                    {/* Event Title */}
                    <h3 className="font-bold text-base md:text-lg text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h3>
                    
                    {/* Date and Time */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="p-1.5 bg-primary-100 rounded-lg">
                        <CalendarTodayIcon sx={{ fontSize: 16, color: '#2563eb' }} />
                      </div>
                      <span className="font-semibold">{formatEventDate(event.date)} às {event.time}</span>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="p-1.5 bg-gray-100 rounded-lg">
                        <LocationOnIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                      </div>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
