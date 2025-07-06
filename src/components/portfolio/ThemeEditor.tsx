
import React, { useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, Save, RotateCcw } from 'lucide-react'

const COLOR_PRESETS = [
  {
    name: 'Moderno',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff'
    }
  },
  {
    name: 'Naturale',
    colors: {
      primary: '#059669',
      secondary: '#374151',
      accent: '#f97316',
      background: '#f8fafc'
    }
  },
  {
    name: 'Viola',
    colors: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      accent: '#ec4899',
      background: '#fefefe'
    }
  },
  {
    name: 'Monochrome',
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#9ca3af',
      background: '#ffffff'
    }
  }
]

export function ThemeEditor() {
  const [currentTheme, setCurrentTheme] = useState({
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff'
  })
  
  const [opacity, setOpacity] = useState([100])
  const [borderRadius, setBorderRadius] = useState([8])

  const applyPreset = (preset: any) => {
    setCurrentTheme(preset.colors)
  }

  const handleColorChange = (colorKey: string, value: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      [colorKey]: value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Palette className="h-5 w-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">Theme Builder</h3>
      </div>

      {/* Color Presets */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">Preset Colori</Label>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex space-x-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: preset.colors.accent }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">{preset.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">Colori Personalizzati</Label>
        
        {Object.entries(currentTheme).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-600 capitalize">{key}</Label>
              <div 
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: value }}
              />
            </div>
            <input
              type="color"
              value={value}
              onChange={(e) => handleColorChange(key, e.target.value)}
              className="w-full h-8 border border-gray-300 rounded cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">Impostazioni Avanzate</Label>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-gray-600">Opacità</Label>
              <span className="text-xs text-gray-500">{opacity[0]}%</span>
            </div>
            <Slider
              value={opacity}
              onValueChange={setOpacity}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-gray-600">Border Radius</Label>
              <span className="text-xs text-gray-500">{borderRadius[0]}px</span>
            </div>
            <Slider
              value={borderRadius}
              onValueChange={setBorderRadius}
              max={32}
              min={0}
              step={2}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2 pt-4 border-t border-gray-200">
        <Button size="sm" className="flex-1">
          <Save className="h-3 w-3 mr-1" />
          Salva Tema
        </Button>
        <Button size="sm" variant="outline">
          <RotateCcw className="h-3 w-3" />
        </Button>
      </div>

      {/* Live Preview */}
      <GlassCard className="p-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Anteprima</Label>
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: currentTheme.background,
              borderColor: currentTheme.secondary + '40'
            }}
          >
            <h4 
              className="font-semibold mb-2" 
              style={{ color: currentTheme.primary }}
            >
              Titolo Principale
            </h4>
            <p 
              className="text-sm mb-3" 
              style={{ color: currentTheme.secondary }}
            >
              Questo è un esempio di come apparirà il tuo tema nel portfolio.
            </p>
            <div 
              className="inline-block px-3 py-1 rounded text-sm font-medium"
              style={{ 
                backgroundColor: currentTheme.accent + '20',
                color: currentTheme.accent
              }}
            >
              Badge di esempio
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
