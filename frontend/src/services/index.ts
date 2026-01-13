// ============================================
// EXPORTAÇÃO CENTRALIZADA DOS SERVIÇOS
// ============================================

// API Client e utilitários
export { api, tokenManager, sanitizeInput, isValidEmail, isStrongPassword, checkRateLimit } from './api'

// Serviços
export { authService } from './auth.service'
export { projectService } from './project.service'
export { imageService } from './image.service'
export { messageService } from './message.service'
export { dashboardService } from './dashboard.service'
export { profileService, LAYOUT_OPTIONS, GRID_COLUMN_OPTIONS, HERO_STYLE_OPTIONS, PROJECT_CARD_STYLE_OPTIONS, BACKGROUND_STYLE_OPTIONS, DEFAULT_CUSTOMIZATION } from './profile.service'
export { exploreService } from './explore.service'
export { calendarService } from './calendar.service'
export { favoritesService } from './favorites.service'

// Re-exportar tipos principais (apenas da API)
export type * from '../types/api'

// Tipos específicos dos serviços são importados diretamente de cada serviço quando necessário

