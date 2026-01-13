// ============================================
// TIPOS BASE DA API
// ============================================

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  error: string
  code?: string
  details?: Record<string, string>
}

// ============================================
// AUTENTICAÇÃO
// ============================================

export type UserRole = 'arquiteto' | 'cliente' | 'admin'

export interface User {
  id: string // Token opaco (não é o ID real do banco)
  email: string
  name: string
  role: UserRole
  type?: UserRole // Alias para role (compatibilidade)
  avatar?: string
  storageUsedPercent: number // Percentual de uso ao invés de valores exatos
  plan: 'free' | 'starter' | 'professional' | 'business'
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthPayload {
  accessToken: string
  refreshToken: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
  type: UserRole
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface RefreshTokenRequest {
  refreshToken: string
}

// ============================================
// PROJETOS
// ============================================

export type ProjectStatus = 'draft' | 'published' | 'archived'
export type ProjectCategory = 'residencial' | 'comercial' | 'reforma' | 'interiores'
export type AccessType = 'public' | 'private' | 'password'
export type ProjectWorkStatus = 'em-andamento' | 'aprovado' | 'concluido' | 'revisao'

export interface Project {
  id: string
  userId: string
  clientId?: string
  title: string
  description: string
  category: ProjectCategory
  location: string
  status: ProjectStatus
  projectStatus?: ProjectWorkStatus
  accessType: AccessType
  coverImage?: string
  tags: string[]
  specs: {
    area?: string
    garage?: string
    style?: string
    [key: string]: string | undefined
  }
  views: number
  filesCount: number
  createdAt: string
  updatedAt: string
  // Campos para exibição com dados do arquiteto
  architect?: {
    id: string
    name: string
    username: string
    avatar?: string
    rating?: number
    projectsCount?: number
  }
  client?: {
    id: string
    name: string
    avatar?: string
  }
}

export interface CreateProjectRequest {
  title: string
  description: string
  category: ProjectCategory
  location: string
  status?: ProjectStatus
  accessType?: AccessType
  password?: string
  tags?: string[]
  specs?: Record<string, string>
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {}

export interface ProjectFilters {
  status?: ProjectStatus
  category?: ProjectCategory
  accessType?: AccessType
  search?: string
  page?: number
  limit?: number
}

// ============================================
// IMAGENS
// ============================================

export type ImageStatus = 'processing' | 'ready' | 'failed'

export interface ImageUrls {
  original: string
  compressed: string
  thumbnail: string
  medium: string
}

export interface Image {
  id: string
  projectId: string
  userId: string
  cloudinaryId: string
  publicId: string
  url: string // URL direta para exibição
  urls: ImageUrls
  filename: string
  title?: string // Título alternativo para a imagem
  mimeType: string
  size: {
    original: number
    compressed: number
  }
  dimensions: {
    width: number
    height: number
  }
  caption?: string
  position: number
  status: ImageStatus
  createdAt: string
  updatedAt: string
}

export interface UploadImageRequest {
  projectId: string
  file: File
  caption?: string
}

// ============================================
// MENSAGENS E CONVERSAS
// ============================================

export interface Conversation {
  id: string
  architectId: string
  clientId: string
  lastMessage?: Message
  lastMessageAt: string
  unreadCount: {
    architect: number
    client: number
  }
  createdAt: string
  updatedAt: string
}

export interface MessageAttachment {
  type: 'image' | 'file'
  url: string
  filename: string
  size: number
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  text: string
  attachments?: MessageAttachment[]
  read: boolean
  readAt?: string
  createdAt: string
}

export interface SendMessageRequest {
  receiverId: string
  text: string
  attachments?: File[]
}

// ============================================
// SERVIÇOS
// ============================================

export type ServiceCategory = 'Residencial' | 'Comercial' | 'Interiores' | 'Reforma' | 'Consultoria' | 'Paisagismo'

export interface Service {
  id: string
  userId: string
  name: string
  description: string
  price: number
  duration: string
  category: ServiceCategory
  active: boolean
  features: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateServiceRequest {
  name: string
  description: string
  price: number
  duration: string
  category: ServiceCategory
  features: string[]
}

// ============================================
// EVENTOS/AGENDA
// ============================================

export type EventType = 'reuniao' | 'visita' | 'apresentacao' | 'consultoria' | 'outro'
export type EventStatus = 'confirmado' | 'pendente' | 'concluido' | 'cancelado'
export type EventLocation = 'Escritório' | 'Cliente' | 'Obra' | 'Prefeitura' | 'Outro'

export interface Event {
  id: string
  userId: string
  clientId?: string
  projectId?: string
  title: string
  description?: string
  date: string
  time: string
  duration: number
  location: EventLocation
  locationAddress?: string
  type: EventType
  status: EventStatus
  reminder?: {
    enabled: boolean
    minutesBefore: number
  }
  createdAt: string
  updatedAt: string
}

export interface CreateEventRequest {
  clientId?: string
  projectId?: string
  title: string
  description?: string
  date: string
  time: string
  duration: number
  location: EventLocation
  locationAddress?: string
  type: EventType
  reminder?: {
    enabled: boolean
    minutesBefore: number
  }
}

// ============================================
// PERFIL PÚBLICO
// ============================================

export interface SocialLinks {
  instagram?: { username: string; url: string }
  facebook?: { username: string; url: string }
  linkedin?: { username: string; url: string }
  website?: string
}

export interface PublicProfile {
  id: string
  userId: string
  username: string
  displayName: string
  bio?: string
  avatar?: string
  coverImage?: string
  location?: {
    address: {
      street?: string
      city: string
      state: string
      neighborhood?: string
      postalCode?: string
      country: string
    }
    coordinates?: {
      latitude: number
      longitude: number
    }
    serviceRadius?: number
    serviceAreas?: string[]
  }
  specialty?: string
  experience?: string
  cau?: string
  specialties?: string[]
  education?: string
  awards?: string
  email?: string
  phone?: string
  social?: SocialLinks
  contact?: {
    email?: string
    phone?: string
    website?: string
  }
  verification?: {
    verified: boolean
    cauVerified: boolean
    verifiedAt?: string
  }
  ratings?: {
    average: number
    total: number
    distribution: Record<string, number>
  }
  boost?: {
    active: boolean
    level: 'basic' | 'premium' | 'highlight'
    endDate?: string
    priority: number
  }
  projectsCount?: number
  viewsCount?: number
  createdAt: string
  updatedAt: string
}

export interface UpdatePublicProfileRequest {
  displayName?: string
  bio?: string
  location?: PublicProfile['location']
  specialty?: string
  experience?: string
  cau?: string
  specialties?: string[]
  education?: string
  awards?: string
  email?: string
  phone?: string
  social?: SocialLinks
}

// ============================================
// FAVORITOS
// ============================================

export interface Favorite {
  id: string
  clientId: string
  architectId: string
  architect?: PublicProfile
  createdAt: string
}

// ============================================
// CONFIGURAÇÕES
// ============================================

export interface UserSettings {
  id: string
  userId: string
  notifications: {
    email: boolean
    projectUpdates: boolean
    clientMessages: boolean
    marketingEmails: boolean
  }
  preferences: {
    language: string
    theme: 'light' | 'dark'
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    showEmail: boolean
    showPhone: boolean
  }
  twoFactorAuth: {
    enabled: boolean
  }
  updatedAt: string
}

export interface UpdateSettingsRequest {
  notifications?: Partial<UserSettings['notifications']>
  preferences?: Partial<UserSettings['preferences']>
  privacy?: Partial<UserSettings['privacy']>
}

// ============================================
// DASHBOARD
// ============================================

export interface DashboardStats {
  totalViews: number
  totalProjects: number
  totalClients: number
  monthlyRevenue: number
  viewsChange: number
  projectsChange: number
  clientsChange: number
  revenueChange: number
}

export interface RecentProject {
  id: string
  title: string
  status: ProjectWorkStatus
  progress?: number
  lastUpdate?: string
  coverImage?: string
  filesCount?: number
  views?: number
  updatedAt?: string
}

export interface UpcomingEvent {
  id: string
  title: string
  date: string
  time: string
  type: EventType | string
  clientName?: string
  location?: EventLocation | string
}

// ============================================
// REVIEWS
// ============================================

export interface Review {
  id: string
  architectId: string
  clientId: string
  projectId?: string
  rating: number
  comment: string
  verified: boolean
  helpful: number
  createdAt: string
  updatedAt: string
  client?: {
    name: string
    avatar?: string
  }
}

export interface CreateReviewRequest {
  architectId: string
  projectId?: string
  rating: number
  comment: string
}

// ============================================
// BUSCA E EXPLORAÇÃO
// ============================================

export interface SearchFilters {
  query?: string
  category?: ProjectCategory
  location?: string
  minRating?: number
  maxPrice?: number
  radius?: number
  lat?: number
  lng?: number
  page?: number
  limit?: number
}

export interface ArchitectSearchResult {
  profile: PublicProfile
  distance?: number
  projectsCount: number
  reviewsCount: number
  isBoosted: boolean
}

