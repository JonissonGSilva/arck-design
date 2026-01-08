import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Event {
  id: string
  title: string
  client: string
  date: string
  time: string
  location: string
  type: 'residencial' | 'comercial' | 'reforma' | 'consultoria'
  status: 'confirmado' | 'pendente' | 'concluido'
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const navigate = useNavigate()

  // Eventos atualizados para o contexto atual (Janeiro 2026)
  const events: Event[] = [
    {
      id: '1',
      title: 'Reunião - Residência Oliveira',
      client: 'Família Oliveira',
      date: '2026-01-15',
      time: '14:00',
      location: 'Escritório',
      type: 'residencial',
      status: 'confirmado',
    },
    {
      id: '2',
      title: 'Visita à Obra - Ed. Comercial',
      client: 'Construtora ABC',
      date: '2026-01-18',
      time: '09:30',
      location: 'Av. Paulista, 1000',
      type: 'comercial',
      status: 'confirmado',
    },
    {
      id: '3',
      title: 'Apresentação de Projeto',
      client: 'Construtora XYZ',
      date: '2026-01-20',
      time: '16:00',
      location: 'Cliente',
      type: 'comercial',
      status: 'pendente',
    },
    {
      id: '4',
      title: 'Consultoria - Reforma Apartamento',
      client: 'João Santos',
      date: '2026-01-22',
      time: '15:00',
      location: 'Rua das Flores, 123',
      type: 'reforma',
      status: 'confirmado',
    },
    {
      id: '5',
      title: 'Aprovação Municipal',
      client: 'Empresa Tech',
      date: '2026-01-25',
      time: '10:00',
      location: 'Prefeitura',
      type: 'comercial',
      status: 'pendente',
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(event => event.date === dateStr)
  }

  const getTypeColor = (type: string) => {
    const colors = {
      residencial: 'bg-blue-100 text-blue-700 border-blue-200',
      comercial: 'bg-green-100 text-green-700 border-green-200',
      reforma: 'bg-amber-100 text-amber-700 border-amber-200',
      consultoria: 'bg-purple-100 text-purple-700 border-purple-200',
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const filteredEvents = selectedDate 
    ? events.filter(e => e.date === `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`)
    : events

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/arquiteto')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-600 mt-1 text-xs md:text-sm">Gerencie seus compromissos e reuniões</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
          <Plus className="h-5 w-5" />
          <span className="hidden md:inline">Novo Evento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Hoje
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const dayEvents = getEventsForDate(day)
              const isToday = 
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
              const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
              const isSelected = selectedDate?.toDateString() === dateObj.toDateString()

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateObj)}
                  className={`aspect-square p-2 rounded-lg border transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : isToday
                      ? 'border-primary-300 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <span className={`text-sm font-semibold ${
                      isToday ? 'text-primary-600' : 'text-gray-900'
                    }`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${getTypeColor(event.type)}`}
                            title={event.title}
                          >
                            {event.time}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            {selectedDate 
              ? `Eventos - ${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}`
              : 'Próximos Eventos'
            }
          </h2>
          
          <div className="space-y-3">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-lg border-2 ${getTypeColor(event.type)} hover:shadow-md transition-all cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{event.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.status === 'confirmado' 
                        ? 'bg-green-100 text-green-700'
                        : event.status === 'pendente'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="h-3 w-3" />
                      <span>{event.client}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum evento para esta data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
