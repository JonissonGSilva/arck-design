import { useState, useEffect, useRef } from 'react'
import { Search, Send, Paperclip, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { messageService } from '../../services'
import { useToast } from '../../contexts/ToastContext'
import LoadingButton from '../../components/common/LoadingButton'
import { sanitizeText, limitLength } from '../../utils/inputUtils'

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
  const { showToast } = useToast()
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Carregar conversas
  useEffect(() => {
    const loadConversations = async () => {
      setLoading(true)
      const response = await messageService.getConversations()
      
      if (response.data) {
        const mappedContacts: Contact[] = response.data.map((conv) => ({
          id: conv.id,
          name: conv.otherParticipant?.name || 'Usuário',
          avatar: conv.otherParticipant?.avatar || '',
          lastMessage: conv.lastMessageData?.text || 'Sem mensagens',
          time: conv.lastMessageAt 
            ? messageService.formatMessageDate(conv.lastMessageAt.toString())
            : '',
          unread: (conv.unreadCount as Record<string, number>)?.[conv.id] || 0,
          online: false, // TODO: Implementar status online via WebSocket
        }))
        setContacts(mappedContacts)
        
        // Selecionar primeira conversa se existir
        if (mappedContacts.length > 0 && !selectedContact) {
          setSelectedContact(mappedContacts[0].id)
        }
      } else if (response.error) {
        showToast(response.error, 'error')
      }
      
      setLoading(false)
    }

    loadConversations()
  }, [])

  // Carregar mensagens quando selecionar contato
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedContact) return

      const response = await messageService.getMessages(selectedContact)
      
      if (response.data) {
        const mappedMessages: Message[] = response.data.data.map((msg) => ({
          id: msg.id,
          text: msg.text,
          sender: msg.senderId === selectedContact ? 'other' : 'me',
          time: messageService.formatMessageDate(msg.createdAt.toString()),
        }))
        setMessages(mappedMessages.reverse())
        
        // Marcar como lidas
        await messageService.markAsRead(selectedContact)
      }
    }

    loadMessages()
  }, [selectedContact])

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedContact || sendingMessage) return

    setSendingMessage(true)
    
    // Encontrar o receiverId do contato selecionado
    const contact = contacts.find(c => c.id === selectedContact)
    if (!contact) {
      showToast('Conversa não encontrada', 'error')
      setSendingMessage(false)
      return
    }

    // Sanitizar mensagem antes de enviar
    const sanitizedMessage = sanitizeText(messageText.trim(), ['\n', ' ', '.', ',', '!', '?', '-', ':', ';', '(', ')'])
    const limitedMessage = limitLength(sanitizedMessage, 5000) // Limite de mensagem

    const response = await messageService.sendMessage(selectedContact, limitedMessage)
    
    if (response.data) {
      // Adicionar mensagem à lista
      const newMessage: Message = {
        id: response.data.id,
        text: response.data.text,
        sender: 'me',
        time: messageService.formatMessageDate(new Date().toISOString()),
      }
      setMessages(prev => [...prev, newMessage])
      setMessageText('')
    } else if (response.error) {
      showToast(response.error, 'error')
    }
    
    setSendingMessage(false)
  }

  const selectedContactData = contacts.find(c => c.id === selectedContact)

  // Avatar fallback
  const renderAvatar = (name: string, avatar?: string, size: string = 'w-12 h-12') => {
    if (avatar) {
      return (
        <img
          src={avatar}
          alt={name}
          className={`${size} rounded-full object-cover`}
        />
      )
    }
    return (
      <div className={`${size} rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold`}>
        {name.charAt(0).toUpperCase()}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-gray-600">Carregando conversas...</div>
      </div>
    )
  }

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
                onChange={() => {
                  // TODO: Implementar busca
                  // Por enquanto apenas aceita input
                }}
                maxLength={100}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="flex-1 overflow-y-auto">
            {contacts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhuma conversa ainda
              </div>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact.id)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedContact === contact.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="relative">
                    {renderAvatar(contact.name, contact.avatar)}
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
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col hidden md:flex">
          {selectedContactData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {renderAvatar(selectedContactData.name, selectedContactData.avatar, 'w-10 h-10')}
                    {selectedContactData.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedContactData.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedContactData.online ? 'Online' : 'Offline'}
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
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Nenhuma mensagem ainda. Inicie a conversa!
                  </div>
                ) : (
                  messages.map((message) => (
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
                  ))
                )}
                <div ref={messagesEndRef} />
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
                    onChange={(e) => {
                      const sanitized = sanitizeText(e.target.value, [' ', '.', ',', '!', '?', '-', ':', ';', '(', ')'])
                      setMessageText(limitLength(sanitized, 5000))
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    disabled={sendingMessage}
                    maxLength={5000}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                  />
                  <LoadingButton
                    onClick={handleSendMessage}
                    loading={sendingMessage}
                    variant="primary"
                    size="sm"
                    disabled={!messageText.trim()}
                    className="p-2"
                    icon={<Send className="h-5 w-5" />}
                  >
                    <span className="sr-only">Enviar</span>
                  </LoadingButton>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Selecione uma conversa para começar
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat
