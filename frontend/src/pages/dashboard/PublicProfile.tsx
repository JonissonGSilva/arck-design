import { useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WorkIcon from '@mui/icons-material/Work'
import SchoolIcon from '@mui/icons-material/School'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LanguageIcon from '@mui/icons-material/Language'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ApartmentIcon from '@mui/icons-material/Apartment'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'

const PublicProfile = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    displayName: 'Carlos Mendes Arquitetura',
    username: 'carlosmendes',
    bio: 'Arquiteto especializado em projetos residenciais modernos com mais de 10 anos de experiência. Meu trabalho é criar espaços que unem funcionalidade, estética e sustentabilidade, transformando sonhos em realidade.',
    location: 'São Paulo, SP',
    specialty: 'Arquitetura Residencial',
    experience: '10+ anos',
    cau: 'A12345678',
    website: 'https://www.carlosmendes.arq.br',
    email: 'contato@carlosmendes.arq.br',
    phone: '(11) 98765-4321',
    instagram: 'carlosmendes.arquitetura',
    instagramUrl: 'https://instagram.com/carlosmendes.arquitetura',
    facebook: 'carlosmendes.arquitetura',
    facebookUrl: 'https://facebook.com/carlosmendes.arquitetura',
    specialties: ['Residencial', 'Sustentabilidade', 'Modernismo', 'Interiores'],
    awards: 'Prêmio IAB 2023, Destaque Arquitetura Sustentável 2022',
    education: 'FAU-USP, Pós-graduação em Sustentabilidade',
  })
  const [newSpecialty, setNewSpecialty] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddSpecialty = () => {
    const trimmed = newSpecialty.trim()
    if (trimmed && !formData.specialties.includes(trimmed)) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, trimmed],
      })
      setNewSpecialty('')
    }
  }

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((s) => s !== specialty),
    })
  }

  const handleSpecialtyKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSpecialty()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Profile updated:', formData)
    showToast('Perfil atualizado com sucesso!', 'success')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={() => navigate('/architect/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </button>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Perfil Público</h1>
            <p className="text-gray-600 mt-1 text-xs md:text-sm">Personalize como os clientes veem você</p>
          </div>
          <a
            href={`/portfolio/${formData.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-sm font-medium"
          >
            <VisibilityIcon sx={{ fontSize: 18 }} />
            <span className="hidden md:inline">Visualizar Perfil</span>
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Profile Images - Layout LinkedIn Style */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 p-4 md:p-6 pb-3 md:pb-4 border-b border-gray-100">
            Imagens do Perfil
          </h2>
          
          {/* Cover Image with Overlapping Avatar */}
          <div className="relative">
            {/* Cover Image */}
            <div className="relative h-48 md:h-56 bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=400&fit=crop"
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center gap-2 text-white">
                  <ApartmentIcon sx={{ fontSize: 20 }} />
                  <span className="font-medium text-sm">Alterar Capa</span>
                </div>
              </button>
              <p className="absolute bottom-2 right-4 text-xs text-white/80 bg-black/30 px-2 py-1 rounded">
                Recomendado: 1200x400px
              </p>
            </div>

            {/* Avatar Overlapping Cover */}
            <div className="relative px-4 md:px-6 pb-4 md:pb-6">
              <div className="relative -mt-12 md:-mt-16 inline-block">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <button
                    type="button"
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <ApartmentIcon sx={{ fontSize: 24, color: 'white' }} />
                  </button>
                </div>
                <p className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                  Recomendado: 400x400px
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Nome de Exibição *
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Seu nome profissional"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Nome de Usuário *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-7 pr-3 md:pl-8 md:pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="nomedeusuario"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Seu perfil será: arckdesign.com/portfolio/{formData.username}
              </p>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <LocationOnIcon sx={{ fontSize: 16 }} />
                Localização
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Cidade, Estado"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <WorkIcon sx={{ fontSize: 16 }} />
                Especialidade Principal
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: Arquitetura Residencial"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Experiência
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: 10+ anos"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                CAU (Registro Profissional)
              </label>
              <input
                type="text"
                name="cau"
                value={formData.cau}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: A12345678"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Biografia
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Conte um pouco sobre você e seu trabalho..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/500 caracteres
            </p>
          </div>

          <div className="mt-4">
            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
              Áreas de Atuação
            </label>
            
            {/* Display existing specialties as pills */}
            {formData.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {specialty}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(specialty)}
                      className="hover:bg-primary-100 rounded-full p-0.5 transition-colors"
                      aria-label={`Remover ${specialty}`}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input to add new specialty */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyPress={handleSpecialtyKeyPress}
                className="flex-1 px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Digite uma área de atuação e pressione Enter"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm flex items-center gap-1.5"
              >
                <AddIcon sx={{ fontSize: 18 }} />
                Adicionar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Adicione as áreas de atuação que melhor descrevem seu trabalho
            </p>
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Informações Profissionais</h2>
          
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <SchoolIcon sx={{ fontSize: 16 }} />
                Formação Acadêmica
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ex: FAU-USP, Pós-graduação em..."
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <SchoolIcon sx={{ fontSize: 16 }} />
                Prêmios e Reconhecimentos
              </label>
              <textarea
                name="awards"
                value={formData.awards}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Liste seus prêmios e reconhecimentos..."
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <EmailIcon sx={{ fontSize: 16 }} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <PhoneIcon sx={{ fontSize: 16 }} />
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <LanguageIcon sx={{ fontSize: 16 }} />
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://www.seusite.com.br"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Redes Sociais</h2>
          <p className="text-xs text-gray-500 mb-4">Adicione o nome e o link completo da sua rede social para que apareça clicável no seu perfil público</p>
          
          <div className="space-y-4">
            {/* Instagram */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <InstagramIcon sx={{ fontSize: 16 }} />
                  Nome do Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="@seuusuario ou seuusuario"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Link do Instagram (URL completa)
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://instagram.com/seuusuario"
                />
              </div>
            </div>

            {/* Facebook */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <FacebookIcon sx={{ fontSize: 16 }} />
                  Nome do Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="seuusuario"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Link do Facebook (URL completa)
                </label>
                <input
                  type="url"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://facebook.com/seuusuario"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 md:gap-4 bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <button
            type="button"
            onClick={() => navigate('/architect/dashboard')}
            className="px-4 md:px-6 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-sm"
          >
            <SaveIcon sx={{ fontSize: 18 }} />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  )
}

export default PublicProfile
