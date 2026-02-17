'use client'

import { Button } from '@/components/ui/button'
import { Plus, Inbox, CheckCircle } from 'lucide-react'

interface SidebarProps {
  filter: 'all' | 'pending' | 'resolved'
  onFilterChange: (filter: 'all' | 'pending' | 'resolved') => void
  onNewTicket: () => void
}

export function SupportSidebar({ filter, onFilterChange, onNewTicket }: SidebarProps) {
  return (
    <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200">
        <Button
          onClick={onNewTicket}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        <button
          onClick={() => onFilterChange('all')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Inbox className="w-4 h-4" />
          All Tickets
        </button>

        <button
          onClick={() => onFilterChange('pending')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          Pending
        </button>

        <button
          onClick={() => onFilterChange('resolved')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'resolved'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Resolved
        </button>
      </nav>
    </div>
  )
}
