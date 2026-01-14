import { useState, useEffect, useRef } from 'react'
import { Search, Send, Trash2, ArrowLeft } from 'lucide-react'
import { Person } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { messageService } from '../../services'
import { useToast } from '../../contexts/ToastContext'
import LoadingButton from '../../components/common/LoadingButton'
import ConfirmModal from '../../components/common/ConfirmModal'
import { sanitizeText, limitLength } from '../../utils/inputUtils'

interface Conversation {
  id: string
  otherUser: {
    id: string
    name: string
    avatar?: string
  }
  lastMessage?: {
    content: string
    createdAt: string
  }
  unreadCount: number
}

interface Message {
  id: string
  text: string
  senderId: string
  createdAt: string
}

const Chat = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [deletingConversation, setDeletingConversation] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  // Carregar mensagens quando uma conversa é selecionada
  useEffect(() => {
    const loadMessagesForConversation = async () => {
      if (!selectedConversation) {
        setMessages([])
        return
      }

      setLoadingMessages(true)
      try {
        const response = await messageService.getMessages(selectedConversation)
        if (response.data?.data) {
          setMessages(response.data.data.reverse()) // Mais recentes primeiro
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error)
        showToast('Erro ao carregar mensagens', 'error')
      } finally {
        setLoadingMessages(false)
      }
    }

    loadMessagesForConversation()
  }, [selectedConversation])

  // Scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const response = await messageService.getConversations()
      if (response.data) {
        // Mapear conversas garantindo que otherUser sempre exista
        const mappedConversations: Conversation[] = (response.data as any[]).map((conv: any) => {
          // Determinar qual é o outro usuário (cliente, já que o arquiteto está visualizando)
          const otherUser = conv.client || conv.otherParticipant || conv.otherUser || {
            id: conv.clientId || '',
            name: 'Cliente',
            avatar: undefined
          }
          
          return {
            id: conv.id,
            otherUser: {
              id: otherUser.id || conv.clientId || '',
              name: otherUser.name || otherUser.displayName || 'Cliente',
              avatar: otherUser.avatar || undefined
            },
            lastMessage: conv.lastMessageData ? {
              content: conv.lastMessageData.text || '',
              createdAt: conv.lastMessageData.createdAt || conv.lastMessageAt || new Date().toISOString()
            } : undefined,
            unreadCount: typeof conv.unreadCount === 'object' 
              ? (conv.unreadCount.architect || conv.unreadCount[conv.id] || 0)
              : (conv.unreadCount || 0)
          }
        })

        // Remover duplicatas baseado no ID do outro usuário
        const uniqueConversations = mappedConversations.reduce((acc, current) => {
          const existingIndex = acc.findIndex(
            (conv) => conv.otherUser.id === current.otherUser.id
          )
          if (existingIndex === -1) {
            acc.push(current)
          } else {
            // Se já existe, manter a mais recente (com base na última mensagem)
            const existing = acc[existingIndex]
            const currentDate = current.lastMessage?.createdAt || ''
            const existingDate = existing.lastMessage?.createdAt || ''
            if (currentDate > existingDate) {
              acc[existingIndex] = current
            }
          }
          return acc
        }, [] as Conversation[])

        setConversations(uniqueConversations)
        
        // Selecionar primeira conversa se existir e nenhuma estiver selecionada
        if (uniqueConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(uniqueConversations[0].id)
        }
      } else if (response.error) {
        showToast(response.error, 'error')
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      showToast('Erro ao carregar conversas', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || sendingMessage) return

    setSendingMessage(true)
    try {
      // Obter o userId do destinatário da conversa
      const conversation = conversations.find((c) => c.id === selectedConversation)
      if (!conversation) {
        showToast('Conversa não encontrada', 'error')
        return
      }

    // Sanitizar mensagem antes de enviar (permitir acentos e caracteres especiais)
    const sanitizedMessage = sanitizeText(messageText.trim(), ['\n', ' ', '.', ',', '!', '?', '-', ':', ';', '(', ')', '[', ']', '{', '}', '/', '\\', '@', '#', '$', '%', '*', '+', '=', '_', '|', '~', '`', '^', '´', '°', 'ª', 'º'])
    const limitedMessage = limitLength(sanitizedMessage, 5000) // Limite de mensagem

      const response = await messageService.sendMessage(conversation.otherUser.id, limitedMessage)
      if (response.data) {
        // Adicionar mensagem à lista local
        setMessages(prev => [...prev, {
          id: response.data?.id || Date.now().toString(),
          text: limitedMessage,
          senderId: conversation.otherUser.id, // Será diferente do otherUser.id, então será "me"
          createdAt: new Date().toISOString()
        }])
        setMessageText('')
        
        // Recarregar conversas para atualizar última mensagem
        await loadConversations()
      } else if (response.error) {
        showToast(response.error, 'error')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      showToast('Erro ao enviar mensagem', 'error')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevenir seleção da conversa
    setConversationToDelete(conversationId)
    setShowDeleteModal(true)
  }

  const confirmDeleteConversation = async () => {
    if (!conversationToDelete) return

    setDeletingConversation(conversationToDelete)
    try {
      const response = await messageService.deleteConversation(conversationToDelete)
      if (response.data) {
        showToast('Conversa deletada com sucesso', 'success')
        
        // Remover da lista local
        setConversations(prev => prev.filter(c => c.id !== conversationToDelete))
        
        // Se a conversa deletada estava selecionada, limpar seleção
        if (selectedConversation === conversationToDelete) {
          setSelectedConversation(null)
          setMessages([])
        }
      } else if (response.error) {
        showToast(response.error, 'error')
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error)
      showToast('Erro ao deletar conversa', 'error')
    } finally {
      setDeletingConversation(null)
      setShowDeleteModal(false)
      setConversationToDelete(null)
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Ontem'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('pt-BR', { weekday: 'long' })
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] max-w-7xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando conversas...</p>
        </div>
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
        {/* Lista de Conversas */}
        <div className="w-full md:w-80 border-r border-gray-200 flex flex-col">
          {/* Busca */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversas..."
                maxLength={100}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <Person sx={{ fontSize: 48 }} className="mb-4 text-gray-400" />
                <h3 className="font-semibold text-gray-900 mb-2">Nenhuma conversa</h3>
                <p className="text-gray-500 text-sm">
                  Você ainda não tem conversas com clientes.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition border-b border-gray-100 text-left relative group ${
                      selectedConversation === conv.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {conv.otherUser?.avatar ? (
                        <img 
                          src={conv.otherUser.avatar} 
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Person sx={{ fontSize: 24 }} className="text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {conv.otherUser?.name || 'Cliente'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="ml-2 w-5 h-5 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage?.content || 'Sem mensagens'}
                      </p>
                      {conv.lastMessage?.createdAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(conv.lastMessage.createdAt)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-opacity"
                      title="Deletar conversa"
                    >
                      {deletingConversation === conv.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-600" />
                      )}
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Área de Chat */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedConversation ? (
            <>
              {/* Header do chat */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ←
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {conversations.find(c => c.id === selectedConversation)?.otherUser?.avatar ? (
                      <img 
                        src={conversations.find(c => c.id === selectedConversation)?.otherUser?.avatar} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Person className="text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {conversations.find(c => c.id === selectedConversation)?.otherUser?.name || 'Cliente'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const conv = conversations.find(c => c.id === selectedConversation)
                    if (conv) {
                      handleDeleteConversation(conv.id, {} as React.MouseEvent)
                    }
                  }}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Deletar conversa"
                >
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              </div>

              {/* Mensagens */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 min-h-0">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                      <p className="text-gray-500 text-sm">Carregando mensagens...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <p className="text-sm">Nenhuma mensagem ainda. Inicie a conversa!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      // Determinar se a mensagem é do arquiteto (senderId diferente do otherUser.id)
                      const conversation = conversations.find(c => c.id === selectedConversation)
                      const isMyMessage = message.senderId !== conversation?.otherUser?.id
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-md px-4 py-2 rounded-2xl ${
                              isMyMessage
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isMyMessage ? 'text-primary-100' : 'text-gray-500'
                              }`}
                            >
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={messageText}
                    onChange={(e) => {
                      // Para mensagens, permitir todos os caracteres acentuados e especiais comuns
                      const sanitized = sanitizeText(e.target.value, ['\n', ' ', '.', ',', '!', '?', '-', ':', ';', '(', ')', '[', ']', '{', '}', '/', '\\', '@', '#', '$', '%', '*', '+', '=', '_', '|', '~', '`', '^', '´', '°', 'ª', 'º'])
                      setMessageText(limitLength(sanitized, 5000))
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !sendingMessage && messageText.trim()) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    disabled={sendingMessage}
                    maxLength={5000}
                    rows={Math.min(Math.max(messageText.split('\n').length, 2), 5) || 2}
                    className="flex-1 px-3 md:px-4 py-2.5 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 resize-none min-h-[60px] max-h-[120px]"
                  />
                  <LoadingButton
                    onClick={handleSendMessage}
                    loading={sendingMessage}
                    variant="primary"
                    size="md"
                    disabled={!messageText.trim()}
                    icon={<Send className="h-4 w-4 md:h-5 md:w-5" />}
                  >
                    <span className="hidden sm:inline text-sm">Enviar</span>
                  </LoadingButton>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <Person sx={{ fontSize: 64 }} className="mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecione uma conversa</h3>
              <p className="text-gray-500">Escolha uma conversa na lista para ver as mensagens</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chat
