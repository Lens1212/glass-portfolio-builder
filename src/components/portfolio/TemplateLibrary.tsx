
import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Briefcase, 
  Star, 
  Mail, 
  Image, 
  FileText,
  Award,
  MessageCircle,
  Layers,
  Plus
} from 'lucide-react'

const TEMPLATE_BLOCKS = [
  {
    id: 'hero',
    name: 'Hero Section',
    description: 'Sezione principale con titolo e call-to-action',
    icon: User,
    category: 'Header',
    preview: {
      title: 'Il Tuo Nome',
      subtitle: 'La Tua Professione',
      hasButton: true
    }
  },
  {
    id: 'about',
    name: 'Chi Sono',
    description: 'Sezione biografica con foto e descrizione',
    icon: FileText,
    category: 'Content',
    preview: {
      title: 'Chi Sono',
      hasImage: true,
      hasText: true
    }
  },
  {
    id: 'skills',
    name: 'Competenze',
    description: 'Showcase delle tue abilità con progress bar',
    icon: Award,
    category: 'Content',
    preview: {
      title: 'Le Mie Competenze',
      hasBars: true
    }
  },
  {
    id: 'projects',
    name: 'Progetti',
    description: 'Gallery dei tuoi lavori con dettagli',
    icon: Briefcase,
    category: 'Portfolio',
    preview: {
      title: 'I Miei Progetti',
      hasGrid: true
    }
  },
  {
    id: 'testimonials',
    name: 'Testimonianze',
    description: 'Recensioni e feedback dei clienti',
    icon: MessageCircle,
    category: 'Social Proof',
    preview: {
      title: 'Cosa Dicono di Me',
      hasCards: true
    }
  },
  {
    id: 'contact',
    name: 'Contatti',
    description: 'Form di contatto e informazioni',
    icon: Mail,
    category: 'Contact',
    preview: {
      title: 'Contattami',
      hasForm: true
    }
  },
  {
    id: 'gallery',
    name: 'Galleria',
    description: 'Showcase visivo dei tuoi lavori',
    icon: Image,
    category: 'Portfolio',
    preview: {
      title: 'Galleria',
      hasMasonry: true
    }
  },
  {
    id: 'experience',
    name: 'Esperienza',
    description: 'Timeline della tua carriera',
    icon: Star,
    category: 'Content',
    preview: {
      title: 'Esperienza Lavorativa',
      hasTimeline: true
    }
  }
]

const CATEGORIES = ['All', 'Header', 'Content', 'Portfolio', 'Social Proof', 'Contact']

interface TemplateLibraryProps {
  onAddSection: (sectionType: string) => void
}

export function TemplateLibrary({ onAddSection }: TemplateLibraryProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const filteredBlocks = selectedCategory === 'All' 
    ? TEMPLATE_BLOCKS 
    : TEMPLATE_BLOCKS.filter(block => block.category === selectedCategory)

  const renderPreview = (block: any) => {
    const Icon = block.icon
    
    return (
      <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <Icon className="h-6 w-6 text-gray-400 mb-2" />
        <div className="text-center">
          <div className="text-xs font-medium text-gray-600 mb-1">
            {block.preview.title}
          </div>
          
          {/* Dynamic preview elements based on block type */}
          {block.preview.hasButton && (
            <div className="w-16 h-6 bg-blue-200 rounded-full mb-1"></div>
          )}
          
          {block.preview.hasBars && (
            <div className="space-y-1">
              <div className="w-12 h-1 bg-blue-300 rounded"></div>
              <div className="w-10 h-1 bg-green-300 rounded"></div>
              <div className="w-14 h-1 bg-purple-300 rounded"></div>
            </div>
          )}
          
          {block.preview.hasGrid && (
            <div className="grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          )}
          
          {block.preview.hasCards && (
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-3 h-4 bg-yellow-200 rounded"></div>
              ))}
            </div>
          )}
          
          {block.preview.hasForm && (
            <div className="space-y-1">
              <div className="w-12 h-1 bg-gray-300 rounded"></div>
              <div className="w-10 h-1 bg-gray-300 rounded"></div>
              <div className="w-8 h-3 bg-blue-300 rounded"></div>
            </div>
          )}
          
          {block.preview.hasTimeline && (
            <div className="flex items-center space-x-1">
              <div className="w-1 h-6 bg-blue-300 rounded"></div>
              <div className="space-y-1">
                <div className="w-6 h-1 bg-gray-300 rounded"></div>
                <div className="w-8 h-1 bg-gray-300 rounded"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Layers className="h-5 w-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">Libreria Template</h3>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Template Blocks */}
      <div className="space-y-3">
        {filteredBlocks.map((block) => (
          <GlassCard 
            key={block.id} 
            className="p-4 hover:bg-gray-50/50 cursor-pointer transition-colors group"
            onClick={() => onAddSection(block.id)}
          >
            <div className="space-y-3">
              {/* Preview */}
              {renderPreview(block)}
              
              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">{block.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {block.category}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2">
                  {block.description}
                </p>
                
                {/* Add Button */}
                <div className="flex items-center justify-center pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1 text-blue-600 text-xs font-medium">
                    <Plus className="h-3 w-3" />
                    <span>Aggiungi Sezione</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredBlocks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Layers className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Nessun template trovato per questa categoria</p>
        </div>
      )}
    </div>
  )
}
