
import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, Clock, Filter, Search } from 'lucide-react'

interface FeedHeaderProps {
  sortBy: 'recent' | 'popular'
  onSortChange: (sort: 'recent' | 'popular') => void
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

const POPULAR_TAGS = [
  'Web Design', 'UX/UI', 'Frontend', 'Backend', 'Mobile',
  'Graphic Design', 'Photography', 'Marketing', 'Writing', 'Video'
]

export function FeedHeader({ 
  sortBy, 
  onSortChange, 
  searchTerm, 
  onSearchChange,
  selectedTags,
  onTagsChange 
}: FeedHeaderProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  return (
    <GlassCard className="p-6 mb-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            Esplora Portfolio
          </h1>
          
          <Tabs value={sortBy} onValueChange={(value) => onSortChange(value as 'recent' | 'popular')}>
            <TabsList className="bg-white/10 border-white/20">
              <TabsTrigger value="recent" className="text-white data-[state=active]:bg-white/20">
                <Clock className="h-4 w-4 mr-2" />
                Più Recenti
              </TabsTrigger>
              <TabsTrigger value="popular" className="text-white data-[state=active]:bg-white/20">
                <TrendingUp className="h-4 w-4 mr-2" />
                Più Popolari
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <p className="text-white/70">
          Scopri portfolio creativi, copiati e personalizzali per creare il tuo
        </p>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Cerca portfolio..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
        </div>

        {/* Tags Filter */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-white/70" />
            <span className="text-white/70 text-sm">Filtra per categoria:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className={`cursor-pointer transition-all ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500/30 text-blue-200 border-blue-400/50"
                    : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          {selectedTags.length > 0 && (
            <GlassButton
              size="sm"
              variant="ghost"
              onClick={() => onTagsChange([])}
              className="text-white/70 hover:text-white"
            >
              Pulisci filtri ({selectedTags.length})
            </GlassButton>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
