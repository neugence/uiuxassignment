import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Search, X } from "lucide-react"
import { Button } from "../components/ui/button"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  filterType: string
  onFilterChange: (value: string) => void
  onClear: () => void
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  onClear,
}: SearchBarProps) {
  return (
    <div className="flex gap-2 p-4 bg-white/10 rounded-lg">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 bg-white/10 text-white placeholder:text-gray-300"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-300 hover:text-white"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Select value={filterType} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px] bg-white/10 text-white border-0">
          <SelectValue placeholder="Filter by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectItem value="no-date">No Date</SelectItem>
          <SelectItem value="has-comments">Has Comments</SelectItem>
          <SelectItem value="has-assignee">Has Assignee</SelectItem>
          <SelectItem value="has-tags">Has Tags</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
} 