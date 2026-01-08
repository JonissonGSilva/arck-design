import { useState } from 'react'
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  online: boolean
}

interface Message {
  id: string
  text: string
  sender: 'me' | 'other'
  time: string
}

const Chat = () => {
  const navigate = useNavigate()
  const [selectedContact, setSelectedContact] = useState<string>('1')
  const [messageText, setMessageText] = useState('')

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Marina Silva',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Obrigada pela proposta! O projeto ficou ótimo!',
      time: '10:30',
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Carolina Santos',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Quando podemos agendar a visita ao terreno?',
      time: '09:15',
      unread: 0,
      online: true,
    },
    {
      id: '3',
      name: 'João Pedro',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Recebi o orçamento, vamos confirmar!',
      time: 'Ontem',
      unread: 1,
      online: false,
    },
    {
      id: '4',
      name: 'Ana Paula Oliveira',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Gostaria de fazer algumas alterações no projeto',
      time: 'Ontem',
      unread: 0,
      online: false,
    },
    {
      id: '5',
      name: 'Roberto Almeida',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Perfeito! Estou ansioso para ver as plantas',
      time: '15/12',
      unread: 0,
      online: false,
    },
  ]

  const messages: Message[] = [
    {
      id: '1',
      text: 'Olá! Gostaria de agendar uma reunião para discutir o projeto',
      sender: 'other',
      time: '09:00',
    },
    {
      id: '2',
      text: 'Claro! Que dia seria melhor para você?',
      sender: 'me',
      time: '09:05',
    },
    {
      id: '3',
      text: 'Quinta-feira pela manhã seria perfeito',
      sender: 'other',
      time: '09:10',
    },
    {
      id: '4',
      text: 'Perfeito! Às 10h está bom?',
      sender: 'me',
      time: '09:15',
    },
    {
      id: '5',
      text: 'Sim, ótimo! No seu escritório?',
      sender: 'other',
      time: '09:20',
    },
    {
      id: '6',
      text: 'Isso mesmo! Te mando o endereço por aqui',
      sender: 'me',
      time: '09:25',
    },
    {
      id: '7',
      text: 'Obrigada pela proposta! O projeto ficou ótimo!',
      sender: 'other',
      time: '10:30',
    },
  ]

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log('Sending message:', messageText)
      setMessageText('')
    }
  }

  const selectedContactData = contacts.find(c => c.id === selectedContact)

  return (
    <div className="h-[calc(100vh-8rem)] max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate('/architect/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Mensagens</h1>
          <p className="text-gray-600 mt-1 text-xs md:text-sm">Converse com seus clientes</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 h-[calc(100%-5rem)] flex overflow-hidden shadow-sm">
        {/* Contacts List */}
        <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact.id)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedContact === contact.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="relative">
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {contact.name}
                    </h3>
                    <span className="text-xs text-gray-500">{contact.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unread > 0 && (
                  <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {contact.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col hidden md:flex">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedContactData?.avatar}
                  alt={selectedContactData?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {selectedContactData?.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedContactData?.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedContactData?.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Video className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'me'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'me' ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="h-5 w-5 text-gray-600" />
              </button>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
