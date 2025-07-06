
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GlassCard } from '@/components/ui/glass-card'
import { Switch } from '@/components/ui/switch'
import { Play, Pause, RotateCcw, Zap } from 'lucide-react'

const ANIMATION_TYPES = [
  { value: 'fade', label: 'Fade In' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'scale', label: 'Scale' },
  { value: 'rotate', label: 'Rotate' },
  { value: 'bounce', label: 'Bounce' }
]

const EASING_TYPES = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' }
]

export function AnimationSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    onScroll: true,
    onHover: false,
    animationType: 'fade',
    duration: [300],
    delay: [0],
    easing: 'ease-out'
  })
  
  const [isPlaying, setIsPlaying] = useState(false)

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const playPreview = () => {
    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), settings.duration[0] + settings.delay[0])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Zap className="h-5 w-5 text-gray-600" />
        <h3 className="font-medium text-gray-900">Animazioni</h3>
      </div>

      {/* Enable/Disable */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">
          Abilita Animazioni
        </Label>
        <Switch
          checked={settings.enabled}
          onCheckedChange={(checked) => updateSetting('enabled', checked)}
        />
      </div>

      {settings.enabled && (
        <>
          {/* Trigger Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Quando Attivare</Label>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-600">Al Scroll</Label>
                <Switch
                  checked={settings.onScroll}
                  onCheckedChange={(checked) => updateSetting('onScroll', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-600">Al Hover</Label>
                <Switch
                  checked={settings.onHover}
                  onCheckedChange={(checked) => updateSetting('onHover', checked)}
                />
              </div>
            </div>
          </div>

          {/* Animation Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Tipo Animazione
            </Label>
            <Select 
              value={settings.animationType} 
              onValueChange={(value) => updateSetting('animationType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ANIMATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Easing */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Easing
            </Label>
            <Select 
              value={settings.easing} 
              onValueChange={(value) => updateSetting('easing', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EASING_TYPES.map((easing) => (
                  <SelectItem key={easing.value} value={easing.value}>
                    {easing.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Durata</Label>
              <span className="text-xs text-gray-500">{settings.duration[0]}ms</span>
            </div>
            <Slider
              value={settings.duration}
              onValueChange={(value) => updateSetting('duration', value)}
              max={2000}
              min={100}
              step={50}
              className="w-full"
            />
          </div>

          {/* Delay */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">Ritardo</Label>
              <span className="text-xs text-gray-500">{settings.delay[0]}ms</span>
            </div>
            <Slider
              value={settings.delay}
              onValueChange={(value) => updateSetting('delay', value)}
              max={1000}
              min={0}
              step={50}
              className="w-full"
            />
          </div>

          {/* Preview */}
          <GlassCard className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Anteprima Animazione</Label>
                <button
                  onClick={playPreview}
                  className="flex items-center space-x-1 text-blue-600 text-sm font-medium hover:text-blue-700"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3 w-3" />
                      <span>In riproduzione...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" />
                      <span>Riproduci</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                <div 
                  className={`w-16 h-16 bg-blue-500 rounded-lg transition-all ${
                    isPlaying ? getAnimationClass(settings.animationType) : ''
                  }`}
                  style={{
                    transitionDuration: `${settings.duration[0]}ms`,
                    transitionDelay: `${settings.delay[0]}ms`,
                    transitionTimingFunction: settings.easing
                  }}
                />
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  {settings.animationType} • {settings.duration[0]}ms • {settings.easing}
                  {settings.delay[0] > 0 && ` • ${settings.delay[0]}ms delay`}
                </p>
              </div>
            </div>
          </GlassCard>
        </>
      )}
    </div>
  )
}

function getAnimationClass(type: string): string {
  switch (type) {
    case 'fade':
      return 'opacity-100'
    case 'slide-up':
      return 'transform translate-y-0'
    case 'slide-down':
      return 'transform -translate-y-0'
    case 'slide-left':
      return 'transform translate-x-0'
    case 'slide-right':
      return 'transform -translate-x-0'
    case 'scale':
      return 'transform scale-110'
    case 'rotate':
      return 'transform rotate-12'
    case 'bounce':
      return 'animate-bounce'
    default:
      return ''
  }
}
