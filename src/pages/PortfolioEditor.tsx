
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdvancedPortfolioEditor } from '@/components/portfolio/AdvancedPortfolioEditor'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

export function PortfolioEditorPage() {
  const { portfolioId } = useParams<{ portfolioId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [portfolioData, setPortfolioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!portfolioId || !user) {
      navigate('/')
      return
    }

    fetchPortfolioData()
  }, [portfolioId, user, navigate])

  const fetchPortfolioData = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', portfolioId)
        .eq('user_id', user?.id)
        .single()

      if (error) {
        toast.error('Portfolio non trovato')
        navigate('/')
        return
      }

      setPortfolioData(data)
    } catch (error) {
      toast.error('Errore nel caricamento del portfolio')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = (data: any) => {
    console.log('Portfolio saved:', data)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento editor...</p>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return null
  }

  return (
    <AdvancedPortfolioEditor
      portfolioId={portfolioId!}
      portfolioSlug={portfolioData.slug}
      initialData={{
        sections: portfolioData.content?.sections || [],
        theme: portfolioData.theme_settings || {},
        status: portfolioData.visibility_status
      }}
      onSave={handleSave}
    />
  )
}
