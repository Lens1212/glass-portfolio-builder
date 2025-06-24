
import React, { useState } from 'react'
import { FeedHeader } from '@/components/feed/FeedHeader'
import { PortfolioFeed } from '@/components/feed/PortfolioFeed'

const Feed = () => {
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-white/5" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto z-10">
        <FeedHeader
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />
        
        <PortfolioFeed
          sortBy={sortBy}
          filterTags={selectedTags}
        />
      </div>
    </div>
  )
}

export default Feed
