
import React, { useState, useEffect } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { PortfolioGrid } from './PortfolioGrid'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface Portfolio {
  id: string
  name: string
  description?: string
  is_published: boolean
  created_at: string
  slug: string
}

export function Dashboard() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchPortfolios()
    }
  }, [user])

  const fetchPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('id, name, description, is_published, created_at, slug')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Errore nel caricamento dei portfolio')
        console.error('Error fetching portfolios:', error)
      } else {
        setPortfolios(data || [])
      }
    } catch (error) {
      toast.error('Errore di connessione')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-white/5" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto z-10">
        <DashboardHeader />
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              I tuoi Portfolio
            </h2>
          </div>
          
          <PortfolioGrid portfolios={portfolios} loading={loading} />
        </div>
      </div>
    </div>
  )
}
