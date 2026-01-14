import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Chat, Person, Email, Send } from '@mui/icons-material'
import { useToast } from '../../contexts/ToastContext'
import { messageService } from '../../services'
import LoadingButton from '../../components/common/LoadingButton'

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

  useEffect(() => {
    loadConversations()
  }, [])

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
        setConversations(response.data as unknown as Conversation[])
      }
    } catch {
      showToast('Erro ao carregar conversas', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const initializeConversationWithMessage = async (architectId: string, initialMessage: string) => {
    setIsInitializingConversation(true)
    try {
      // Recarregar conversas primeiro para verificar se já existe
      await loadConversations()
      
      // Verificar se já existe uma conversa com este arquiteto
      const existingConversation = conversations.find(
        (conv) => conv.otherUser.id === architectId
      )

      if (existingConversation) {
        // Se já existe, apenas selecionar e pré-preencher mensagem
        setSelectedConversation(existingConversation.id)
        setMessageText(initialMessage)
        showToast('Mensagem pré-preenchida! Você pode editar antes de enviar.', 'info')
      } else {
        // Criar nova conversa
        const conversationResponse = await messageService.startConversation(architectId)
        if (conversationResponse.data) {
          // Recarregar conversas novamente
          await loadConversations()
          
          // Buscar a conversa recém-criada
          const newConversations = await messageService.getConversations()
          if (newConversations.data) {
            const updatedConversations = newConversations.data as unknown as Conversation[]
            setConversations(updatedConversations)
            
            const newConversation = updatedConversations.find(
              (conv) => conv.otherUser.id === architectId
            )
            
            if (newConversation) {
              // Selecionar a nova conversa
              setSelectedConversation(newConversation.id)
              
              // Pré-preencher a mensagem (sem enviar automaticamente)
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

      const response = await messageService.sendMessage(conversation.otherUser.id, messageText.trim())
      if (response.data) {
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

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] flex">
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
                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition border-b border-gray-100 text-left ${
                  selectedConversation === conv.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {conv.otherUser.avatar ? (
                    <img src={conv.otherUser.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">{conv.otherUser.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-900 truncate">{conv.otherUser.name}</span>
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
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Área de chat */}
      <div className={`flex-1 flex flex-col ${!selectedConversation && !isInitializingConversation ? 'hidden md:flex' : 'flex'}`}>
        {(selectedConversation || isInitializingConversation) ? (
          <div className="flex-1 flex flex-col">
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
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ←
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {conversations.find(c => c.id === selectedConversation)?.otherUser.avatar ? (
                      <img 
                        src={conversations.find(c => c.id === selectedConversation)?.otherUser.avatar} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Person className="text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {conversations.find(c => c.id === selectedConversation)?.otherUser.name || 'Conversa'}
                    </p>
                    <p className="text-sm text-gray-500">Arquiteto</p>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <p className="text-center text-gray-500 text-sm">Carregando mensagens...</p>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  {messageText && searchParams.get('initialMessage') && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                      💬 Mensagem pré-preenchida. Você pode editar antes de enviar.
                    </div>
                  )}
                  <div className="flex gap-2">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && !sendingMessage && messageText.trim()) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Digite sua mensagem..."
                      disabled={sendingMessage}
                      rows={Math.min(messageText.split('\n').length, 4) || 1}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 resize-none"
                    />
                    <LoadingButton
                      onClick={handleSendMessage}
                      loading={sendingMessage}
                      variant="primary"
                      size="md"
                      disabled={!messageText.trim()}
                      icon={<Send className="h-5 w-5" />}
                    >
                      <span className="hidden sm:inline">Enviar</span>
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

