import { useState } from 'react'
import { Plus, Edit, Trash2, DollarSign, Clock, Building2, ArrowLeft, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: string
  active: boolean
  features: string[]
}

const Services = () => {
  const navigate = useNavigate()
  const [services] = useState<Service[]>([
    {
      id: '1',
      name: 'Projeto Arquitetônico Residencial Completo',
      description: 'Desenvolvimento completo do projeto arquitetônico, incluindo estudo preliminar, anteprojeto e projeto executivo',
      price: 25000,
      duration: '3-4 meses',
      category: 'Residencial',
      active: true,
      features: ['Estudo preliminar', 'Anteprojeto', 'Projeto executivo', 'Aprovação na prefeitura'],
    },
    {
      id: '2',
      name: 'Projeto Comercial',
      description: 'Projeto arquitetônico para edifícios comerciais e escritórios',
      price: 35000,
      duration: '4-6 meses',
      category: 'Comercial',
      active: true,
      features: ['Projeto completo', 'Adequação às normas', 'Projeto de acessibilidade', 'Memorial descritivo'],
    },
    {
      id: '3',
      name: 'Design de Interiores',
      description: 'Projeto completo de design de interiores com especificação de materiais',
      price: 12000,
      duration: '2-3 meses',
      category: 'Interiores',
      active: true,
      features: ['Projeto de layout', 'Especificação de materiais', 'Projeto de iluminação', '3D e renderizações'],
    },
    {
      id: '4',
      name: 'Reforma e Ampliação',
      description: 'Projeto de reforma e ampliação de imóveis existentes',
      price: 15000,
      duration: '2-3 meses',
      category: 'Reforma',
      active: true,
      features: ['Levantamento técnico', 'Projeto estrutural', 'Projeto hidráulico', 'Projeto elétrico'],
    },
    {
      id: '5',
      name: 'Consultoria Arquitetônica',
      description: 'Consultoria especializada para aprovação de projetos e adequações',
      price: 5000,
      duration: '1 mês',
      category: 'Consultoria',
      active: true,
      features: ['Análise de viabilidade', 'Orientação técnica', 'Suporte para aprovações', 'Acompanhamento'],
    },
    {
      id: '6',
      name: 'Projeto Paisagístico',
      description: 'Projeto de paisagismo e áreas externas',
      price: 8000,
      duration: '1-2 meses',
      category: 'Paisagismo',
      active: false,
      features: ['Projeto de áreas verdes', 'Especificação de plantas', 'Iluminação externa', 'Irrigação'],
    },
  ])

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
        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Meus Serviços</h1>
            <p className="text-gray-600 mt-1 text-xs md:text-sm">Gerencie seus pacotes e preços</p>
          </div>
          <button className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center gap-2 w-fit">
            <Plus className="h-5 w-5" />
            Novo Serviço
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary-50 rounded-lg">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{services.length}</h3>
          <p className="text-sm text-gray-600">Total de Serviços</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            R$ {(services.reduce((acc, s) => acc + s.price, 0) / services.length).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </h3>
          <p className="text-sm text-gray-600">Ticket Médio</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {services.filter(s => s.active).length}
          </h3>
          <p className="text-sm text-gray-600">Serviços Ativos</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-accent-600" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            R$ {services.reduce((acc, s) => acc + s.price, 0).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </h3>
          <p className="text-sm text-gray-600">Valor Total</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    service.active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {service.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Editar">
                  <Edit className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </button>
              </div>
            </div>
            
            {/* Features List */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">O que está incluído:</h4>
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price and Details */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary-600" />
                <span className="text-xl md:text-2xl font-bold text-gray-900">
                  R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4 text-primary-600" />
                <span className="text-sm">{service.duration}</span>
              </div>
              <div className="ml-auto">
                <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">
                  {service.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categorias */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Categorias de Serviços</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {['Residencial', 'Comercial', 'Interiores', 'Reforma', 'Consultoria', 'Paisagismo'].map((category) => (
            <div
              key={category}
              className="bg-white p-3 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer"
            >
              <p className="text-sm font-semibold text-gray-900">{category}</p>
              <p className="text-xs text-gray-500 mt-1">
                {services.filter(s => s.category === category).length} serviço(s)
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Services
