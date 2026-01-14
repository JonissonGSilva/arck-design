import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Chat, Person, Email, Send } from '@mui/icons-material'
import { Trash2 } from 'lucide-react'
import { useToast } from '../../contexts/ToastContext'
import { messageService } from '../../services'
import LoadingButton from '../../components/common/LoadingButton'
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

const ClientMessages: React.FC = () => {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [isInitializingConversation, setIsInitializingConversation] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [deletingConversation, setDeletingConversation] = useState<string | null>(null)

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

  // Verificar se há query params para iniciar conversa com mensagem pré-preenchida
  useEffect(() => {
    const architectId = searchParams.get('architect')
    const initialMessage = searchParams.get('initialMessage')

    if (architectId && initialMessage) {
      // Limpar query params da URL
      navigate('/client/messages', { replace: true })
      
      // Iniciar conversa com o arquiteto
      initializeConversationWithMessage(architectId, initialMessage)
    }
  }, [searchParams, navigate])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const response = await messageService.getConversations()
      if (response.data) {
        // Mapear conversas garantindo que otherUser sempre exista
        const mappedConversations: Conversation[] = (response.data as any[]).map((conv: any) => {
          // Determinar qual é o outro usuário (arquiteto, já que o cliente está visualizando)
          const otherUser = conv.architect || conv.otherParticipant || conv.otherUser || {
            id: conv.architectId || '',
            name: 'Arquiteto',
            avatar: undefined
          }
          
          return {
            id: conv.id,
            otherUser: {
              id: otherUser.id || conv.architectId || '',
              name: otherUser.name || otherUser.displayName || 'Arquiteto',
              avatar: otherUser.avatar || undefined
            },
            lastMessage: conv.lastMessageData ? {
              content: conv.lastMessageData.text || conv.lastMessageData.content || '',
              createdAt: conv.lastMessageData.createdAt || conv.lastMessageAt || new Date().toISOString()
            } : undefined,
            unreadCount: typeof conv.unreadCount === 'object' 
              ? (conv.unreadCount.client || conv.unreadCount[conv.id] || 0)
              : (conv.unreadCount || 0)
          }
        })
        setConversations(mappedConversations)
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error)
      showToast('Erro ao carregar conversas', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const initializeConversationWithMessage = async (architectId: string, initialMessage: string) => {
    setIsInitializingConversation(true)
    try {
      // Primeiro, recarregar conversas para ter a lista atualizada
      const conversationsResponse = await messageService.getConversations()
      if (!conversationsResponse.data) {
        showToast('Erro ao carregar conversas', 'error')
        return
      }

      // Mapear conversas corretamente
      const mappedConversations: Conversation[] = (conversationsResponse.data as any[]).map((conv: any) => {
        const otherUser = conv.architect || conv.otherParticipant || conv.otherUser || {
          id: conv.architectId || '',
          name: 'Arquiteto',
          avatar: undefined
        }
        
        return {
          id: conv.id,
          otherUser: {
            id: otherUser.id || conv.architectId || '',
            name: otherUser.name || otherUser.displayName || 'Arquiteto',
            avatar: otherUser.avatar || undefined
          },
          lastMessage: conv.lastMessage ? {
            content: conv.lastMessage.text || conv.lastMessage.content || '',
            createdAt: conv.lastMessage.createdAt || conv.lastMessageAt || new Date().toISOString()
          } : undefined,
          unreadCount: typeof conv.unreadCount === 'object' 
            ? (conv.unreadCount.client || conv.unreadCount[conv.id] || 0)
            : (conv.unreadCount || 0)
        }
      })

      setConversations(mappedConversations)
      
      // Verificar se já existe uma conversa com este arquiteto
      // Usar comparação por ID do outro usuário (arquiteto)
      const existingConversation = mappedConversations.find(
        (conv) => {
          const otherUserId = conv.otherUser?.id
          return otherUserId && otherUserId === architectId
        }
      )

      if (existingConversation) {
        // Se já existe, apenas selecionar e pré-preencher mensagem
        setSelectedConversation(existingConversation.id)
        setMessageText(initialMessage)
        showToast('Conversa encontrada! Mensagem pré-preenchida. Você pode editar antes de enviar.', 'info')
        setIsInitializingConversation(false)
        return // Não criar nova conversa
      } else {
        // Criar nova conversa apenas se não existir
        const conversationResponse = await messageService.startConversation(architectId)
        if (conversationResponse.data) {
          // Recarregar conversas novamente após criar
          await loadConversations()
          
          // Buscar a conversa recém-criada na lista atualizada
          const updatedResponse = await messageService.getConversations()
          if (updatedResponse.data) {
            const updatedMapped = (updatedResponse.data as any[]).map((conv: any) => {
              const otherUser = conv.architect || conv.otherParticipant || conv.otherUser || {
                id: conv.architectId || '',
                name: 'Arquiteto',
                avatar: undefined
              }
              
              return {
                id: conv.id,
                otherUser: {
                  id: otherUser.id || conv.architectId || '',
                  name: otherUser.name || otherUser.displayName || 'Arquiteto',
                  avatar: otherUser.avatar || undefined
                },
                lastMessage: conv.lastMessage ? {
                  content: conv.lastMessage.text || conv.lastMessage.content || '',
                  createdAt: conv.lastMessage.createdAt || conv.lastMessageAt || new Date().toISOString()
                } : undefined,
                unreadCount: typeof conv.unreadCount === 'object' 
                  ? (conv.unreadCount.client || conv.unreadCount[conv.id] || 0)
                  : (conv.unreadCount || 0)
              }
            })
            
            setConversations(updatedMapped)
            
            const newConversation = updatedMapped.find(
              (conv) => conv.otherUser?.id === architectId
            )
            
            if (newConversation) {
              setSelectedConversation(newConversation.id)
              setMessageText(initialMessage)
              showToast('Conversa iniciada! Você pode editar a mensagem antes de enviar.', 'info')
            }
          }
        } else {
          showToast(conversationResponse.error || 'Erro ao iniciar conversa', 'error')
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar conversa:', error)
      showToast('Erro ao iniciar conversa', 'error')
    } finally {
      setIsInitializingConversation(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Ontem'
    } else if (diffDays < 7) {
      return date.toLocaleDateString('pt-BR', { weekday: 'short' })
    }
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
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

      const response = await messageService.sendMessage(conversation.otherUser?.id || '', limitedMessage)
      if (response.data) {
        // Adicionar mensagem à lista local
        setMessages(prev => [...prev, {
          id: response.data?.id || Date.now().toString(),
          text: limitedMessage,
          senderId: '', // Será preenchido pelo backend
          receiverId: conversation.otherUser?.id || '',
          createdAt: new Date().toISOString(),
        }])
        setMessageText('')
        loadConversations()
        showToast('Mensagem enviada!', 'success')
      } else if (response.error) {
        showToast(response.error, 'error')
      }
    } catch {
      showToast('Erro ao enviar mensagem', 'error')
    } finally {
      setSendingMessage(false)
    }
  }

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevenir seleção da conversa
    
    if (!window.confirm('Tem certeza que deseja deletar esta conversa? Todas as mensagens serão perdidas.')) {
      return
    }

    setDeletingConversation(conversationId)
    try {
      const response = await messageService.deleteConversation(conversationId)
      if (response.data) {
        showToast('Conversa deletada com sucesso', 'success')
        
        // Remover da lista local
        setConversations(prev => prev.filter(c => c.id !== conversationId))
        
        // Se a conversa deletada estava selecionada, limpar seleção
        if (selectedConversation === conversationId) {
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
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Lista de conversas */}
      <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Mensagens</h1>
        </div>

        {conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Chat className="text-5xl mb-4 text-gray-400" />
            <h3 className="font-semibold text-gray-900 mb-2">Nenhuma conversa</h3>
            <p className="text-gray-500 text-sm">
              Inicie uma conversa com um arquiteto para tirar dúvidas ou solicitar orçamentos.
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
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {conv.otherUser?.avatar ? (
                    <img src={conv.otherUser.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{(conv.otherUser?.name || 'A').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-900 truncate">{conv.otherUser?.name || 'Arquiteto'}</span>
                    {conv.lastMessage && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {formatDate(conv.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">{conv.lastMessage.content}</p>
                  )}
                </div>
                {conv.unreadCount > 0 && (
                  <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
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

      {/* Área de chat */}
      <div className={`flex-1 flex flex-col min-w-0 ${!selectedConversation && !isInitializingConversation ? 'hidden md:flex' : 'flex'}`}>
        {(selectedConversation || isInitializingConversation) ? (
          <div className="flex-1 flex flex-col min-h-0">
            {isInitializingConversation ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Iniciando conversa...</p>
                </div>
              </div>
            ) : (
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
                        {conversations.find(c => c.id === selectedConversation)?.otherUser?.name || 'Conversa'}
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
                        // Determinar se a mensagem é do cliente (senderId diferente do otherUser.id)
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
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
                  {messageText && searchParams.get('initialMessage') && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs md:text-sm text-blue-700">
                      💬 Mensagem pré-preenchida. Você pode editar antes de enviar.
                    </div>
                  )}
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
                      disabled={sendingMessage || isInitializingConversation}
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
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Email className="text-6xl mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Selecione uma conversa</h3>
            <p className="text-gray-500">Escolha uma conversa na lista para ver as mensagens</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientMessages

