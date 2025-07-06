
import React, { useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Palette, 
  Type, 
  Layout, 
  Zap, 
  Settings,
  Plus,
  User,
  FileText,
  Star,
  Briefcase,
  Mail,
  Image,
  MessageCircle,
  Code,
  Layers
} from 'lucide-react'

const SECTION_TEMPLATES = [
  {
    type: 'hero',
    icon: User,
    label: 'Hero Section',
    description: 'Intestazione principale con nome e titolo',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    type: 'about',
    icon: FileText,
    label: 'Chi Sono',
    description: 'Sezione biografia e presentazione',
    color: 'bg-green-500',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    type: 'skills',
    icon: Star,
    label: 'Competenze',
    description: 'Skills e tecnologie con progress bar',
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-violet-600'
  },
  {
    type: 'projects',
    icon: Briefcase,
    label: 'Progetti',
    description: 'Portfolio di lavori e progetti',
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    type: 'experience',
    icon: Layers,
    label: 'Esperienza',
    description: 'Timeline professionale',
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-purple-600'
  },
  {
    type: 'testimonials',
    icon: MessageCircle,
    label: 'Testimonianze',
    description: 'Recensioni e feedback clienti',
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    type: 'gallery',
    icon: Image,
    label: 'Galleria',
    description: 'Raccolta di immagini e media',
    color: 'bg-cyan-500',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    type: 'contact',
    icon: Mail,
    label: 'Contatti',
    description: 'Form contatti e informazioni',
    color: 'bg-teal-500',
    gradient: 'from-teal-500 to-cyan-600'
  }
]

const THEME_PRESETS = [
  {
    name: 'Professional',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#3b82f6',
      background: '#ffffff',
      text: '#1e293b'
    },
    preview: 'bg-gradient-to-r from-blue-500 to-blue-600'
  },
  {
    name: 'Creative',
    colors: {
      primary: '#7c3aed',
      secondary: '#f59e0b',
      accent: '#ec4899',
      background: '#fafafa',
      text: '#111827'
    },
    preview: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    name: 'Nature',
    colors: {
      primary: '#059669',
      secondary: '#84cc16',
      accent: '#10b981',
      background: '#f0fdf4',
      text: '#1f2937'
    },
    preview: 'bg-gradient-to-r from-green-500 to-emerald-500'
  },
  {
    name: 'Sunset',
    colors: {
      primary: '#ea580c',
      secondary: '#f59e0b',
      accent: '#ef4444',
      background: '#fff9ed',
      text: '#7c2d12'
    },
    preview: 'bg-gradient-to-r from-orange-500 to-red-500'
  },
  {
    name: 'Ocean',
    colors: {
      primary: '#0891b2',
      secondary: '#06b6d4',
      accent: '#3b82f6',
      background: '#f0f9ff',
      text: '#0c4a6e'
    },
    preview: 'bg-gradient-to-r from-cyan-500 to-blue-500'
  },
  {
    name: 'Dark',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#a855f7',
      background: '#111827',
      text: '#f9fafb'
    },
    preview: 'bg-gradient-to-r from-gray-800 to-gray-900'
  }
]

interface EditorSidebarProps {
  onAddSection: (type: string) => void
  onThemeChange: (theme: any) => void
  currentTheme: any
}

export function EditorSidebar({ onAddSection, onThemeChange, currentTheme }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState('sections')

  return (
    <div className="w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200/50">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Editor Portfolio
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4 m-4 mb-0">
          <TabsTrigger value="sections" className="text-xs">
            <Layout className="h-3 w-3 mr-1" />
            Sezioni
          </TabsTrigger>
          <TabsTrigger value="theme" className="text-xs">
            <Palette className="h-3 w-3 mr-1" />
            Tema
          </TabsTrigger>
          <TabsTrigger value="typography" className="text-xs">
            <Type className="h-3 w-3 mr-1" />
            Testo
          </TabsTrigger>
          <TabsTrigger value="effects" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Effetti
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <TabsContent value="sections" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Plus className="h-4 w-4 mr-1" />
                  Aggiungi Sezioni
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {SECTION_TEMPLATES.map((template) => {
                    const Icon = template.icon
                    return (
                      <GlassCard
                        key={template.type}
                        className="p-4 cursor-pointer hover:bg-gray-50/80 transition-all duration-200 group border border-gray-200/50"
                        onClick={() => onAddSection(template.type)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${template.gradient} text-white group-hover:scale-110 transition-transform shadow-sm`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm mb-1">{template.label}</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">{template.description}</p>
                          </div>
                        </div>
                      </GlassCard>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="theme" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Temi Predefiniti</h3>
                <div className="grid grid-cols-2 gap-3">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => onThemeChange(preset.colors)}
                      className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors group"
                    >
                      <div className={`h-12 rounded-lg ${preset.preview} mb-2 group-hover:scale-105 transition-transform`} />
                      <span className="text-xs font-medium text-gray-700">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Colori Personalizzati</h3>
                <div className="space-y-3">
                  {Object.entries(currentTheme).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-3">
                      <label className="text-xs text-gray-600 w-16 capitalize">{key}</label>
                      <input
                        type="color"
                        value={value as string}
                        onChange={(e) => onThemeChange({ ...currentTheme, [key]: e.target.value })}
                        className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={value as string}
                        onChange={(e) => onThemeChange({ ...currentTheme, [key]: e.target.value })}
                        className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Tipografia</h3>
                <p className="text-xs text-gray-500 mb-4">Personalizza font e dimensioni del testo</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">Font Family</label>
                    <select className="w-full text-xs px-2 py-2 border border-gray-200 rounded">
                      <option>Inter</option>
                      <option>Roboto</option>
                      <option>Poppins</option>
                      <option>Playfair Display</option>
                      <option>Merriweather</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">Dimensione Titoli</label>
                    <input type="range" min="24" max="72" className="w-full" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">Dimensione Testo</label>
                    <input type="range" min="14" max="20" className="w-full" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">Interlinea</label>
                    <input type="range" min="1" max="2" step="0.1" className="w-full" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="effects" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Animazioni ed Effetti</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">Transizione Sezioni</label>
                    <select className="w-full text-xs px-2 py-2 border border-gray-200 rounded">
                      <option>Fade In</option>
                      <option>Slide Up</option>
                      <option>Scale In</option>
                      <option>Bounce</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">Velocità Animazione</label>
                    <input type="range" min="0.2" max="2" step="0.1" className="w-full" />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 mb-2 block">Ritardo Animazione</label>
                    <input type="range" min="0" max="1" step="0.1" className="w-full" />
                  </div>

                  <div className="pt-2">
                    <GlassButton size="sm" className="w-full">
                      <Zap className="h-3 w-3 mr-1" />
                      Anteprima Animazioni
                    </GlassButton>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  )
}
