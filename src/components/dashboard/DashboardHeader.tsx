
import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, Plus, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function DashboardHeader() {
  const { user, signOut } = useAuth()

  return (
    <GlassCard className="p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12 border-2 border-white/20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Ciao, {user?.user_metadata?.display_name || 'Utente'}!
            </h1>
            <p className="text-white/70">
              Gestisci i tuoi portfolio dinamici
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <GlassButton variant="primary" className="space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nuovo Portfolio</span>
          </GlassButton>
          
          <GlassButton 
            variant="ghost" 
            size="icon"
            onClick={signOut}
            className="hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
          </GlassButton>
        </div>
      </div>
    </GlassCard>
  )
}
