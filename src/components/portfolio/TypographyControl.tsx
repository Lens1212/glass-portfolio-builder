
import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GlassCard } from '@/components/ui/glass-card'
import { Type, Italic, Bold } from 'lucide-react'

const GOOGLE_FONTS = [
  'Inter',
  'Poppins', 
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Source Sans Pro',
  'Raleway',
  'Nunito',
  'Playfair Display',
  'Merriweather',
  'Crimson Text'
]

export function TypographyControl() {
  const [typography, setTypography] = useState({
    headingFont: 'Inter',
    bodyFont: 'Inter',
    h1Size: [32],
    h2Size: [24],
    bodySize: [16],
    lineHeight: [1.5],
    letterSpacing: [0]
  })

  const loadGoogleFont = (fontName: string) => {
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }

  useEffect(() => {
    // Load current fonts
    if (typography.headingFont !== 'Inter') {
      loadGoogleFont(typography.headingFont)
    }
    if (typography.bodyFont !== 'Inter' && typography.bodyFont !== typography.headingFont) {
      loadGoogleFont(typography.bodyFont)
    }
  }, [typography.headingFont, typography.bodyFont])

  const updateTypography = (key: string, value: any) => {
    setTypography(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Type className="h-5 w-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">Tipografia</h3>
      </div>

      {/* Font Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Font Titoli
          </Label>
          <Select 
            value={typography.headingFont} 
            onValueChange={(value) => updateTypography('headingFont', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GOOGLE_FONTS.map((font) => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Font Corpo
          </Label>
          <Select 
            value={typography.bodyFont} 
            onValueChange={(value) => updateTypography('bodyFont', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GOOGLE_FONTS.map((font) => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Font Sizes */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">Dimensioni Font</Label>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-gray-600">H1 - Titolo Principale</Label>
              <span className="text-xs text-gray-500">{typography.h1Size[0]}px</span>
            </div>
            <Slider
              value={typography.h1Size}
              onValueChange={(value) => updateTypography('h1Size', value)}
              max={48}
              min={20}
              step={2}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-gray-600">H2 - Sottotitolo</Label>
              <span className="text-xs text-gray-500">{typography.h2Size[0]}px</span>
            </div>
            <Slider
              value={typography.h2Size}
              onValueChange={(value) => updateTypography('h2Size', value)}
              max={36}
              min={16}
              step={2}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-gray-600">Testo Normale</Label>
              <span className="text-xs text-gray-500">{typography.bodySize[0]}px</span>
            </div>
            <Slider
              value={typography.bodySize}
              onValueChange={(value) => updateTypography('bodySize', value)}
              max={24}
              min={12}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Advanced Typography */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">Spaziatura</Label>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-gray-600">Altezza Linea</Label>
              <span className="text-xs text-gray-500">{typography.lineHeight[0]}</span>
            </div>
            <Slider
              value={typography.lineHeight}
              onValueChange={(value) => updateTypography('lineHeight', value)}
              max={2.5}
              min={1}
              step={0.1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm text-gray-600">Spaziatura Lettere</Label>
              <span className="text-xs text-gray-500">{typography.letterSpacing[0]}px</span>
            </div>
            <Slider
              value={typography.letterSpacing}
              onValueChange={(value) => updateTypography('letterSpacing', value)}
              max={3}
              min={-1}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <GlassCard className="p-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Anteprima Tipografia</Label>
          <div className="space-y-3">
            <h1 
              style={{
                fontFamily: typography.headingFont,
                fontSize: `${typography.h1Size[0]}px`,
                lineHeight: typography.lineHeight[0],
                letterSpacing: `${typography.letterSpacing[0]}px`,
                fontWeight: 600
              }}
              className="text-gray-900"
            >
              Titolo Principale
            </h1>
            
            <h2 
              style={{
                fontFamily: typography.headingFont,
                fontSize: `${typography.h2Size[0]}px`,
                lineHeight: typography.lineHeight[0],
                letterSpacing: `${typography.letterSpacing[0]}px`,
                fontWeight: 500
              }}
              className="text-gray-700"
            >
              Sottotitolo Sezione
            </h2>
            
            <p 
              style={{
                fontFamily: typography.bodyFont,
                fontSize: `${typography.bodySize[0]}px`,
                lineHeight: typography.lineHeight[0],
                letterSpacing: `${typography.letterSpacing[0]}px`
              }}
              className="text-gray-600"
            >
              Questo è un esempio di paragrafo che mostra come apparirà il testo del corpo nel tuo portfolio. Puoi vedere come i font selezionati si combinano insieme.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
