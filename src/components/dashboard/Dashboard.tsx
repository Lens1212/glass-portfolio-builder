
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
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto">
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
