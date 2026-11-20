'use client'

import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Search } from 'lucide-react'

interface ComplaintFiltersProps {
  searchTerm: string
  onSearchChange: (val: string) => void
  selectedCategory: string
  onCategoryChange: (val: string) => void
  selectedPriority: string
  onPriorityChange: (val: string) => void
  selectedStatus: string
  onStatusChange: (val: string) => void
  categories: { id: string; name: string }[]
  priorities: { id: string; name: string }[]
}

export function ComplaintFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPriority,
  onPriorityChange,
  selectedStatus,
  onStatusChange,
  categories,
  priorities,
}: ComplaintFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
        />
        <Input
          type="text"
          placeholder="Cari narasi keluhan atau kode kasus..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 text-xs h-10 rounded-full"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="text-xs h-10 w-36 rounded-full"
        >
          <option value="all">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="text-xs h-10 w-36 rounded-full"
        >
          <option value="all">Semua Prioritas</option>
          {priorities.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>

        <Select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="text-xs h-10 w-36 rounded-full"
        >
          <option value="all">Semua Status</option>
          <option value="validated">Tervalidasi</option>
          <option value="in_review">Dalam Review</option>
          <option value="pending">Pending</option>
        </Select>
      </div>
    </div>
  )
}
