import React from 'react'
import { Search, Filter } from "lucide-react"

export const SearchAndFilter = ({ searchQuery, onSearchChange, filterPriority, onFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-300 placeholder-gray-500"
        />
      </div>

      {/* Priority Filter */}
      <div className="relative min-w-[200px]">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <select
          value={filterPriority}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-gray-300 appearance-none cursor-pointer"
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}