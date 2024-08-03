// components/StatsCards.tsx
'use client';
import React, { useState, useEffect } from 'react'
import { StatsCard } from './StatsCard'
import { FolderIcon, LanguagesIcon, BookOpenIcon } from 'lucide-react'

export function StatsCards() {
  const [categories, setCategories] = useState<any[]>([])
  const [languages, setLanguages] = useState<any[]>([])
  const [dhikrs, setDhikrs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, languagesRes, dhikrsRes] = await Promise.all([
          fetch('/api/languages?type=categories'),
          fetch('/api/languages?type=languages'),
          fetch('/api/dhikrs?type=dhikrs')
        ])
        const categoriesData = await categoriesRes.json()
        const languagesData = await languagesRes.json()
        const dhikrsData = await dhikrsRes.json()
        setCategories(categoriesData)
        setLanguages(languagesData)
        setDhikrs(dhikrsData)
        setIsLoading(false)
      } catch (err) {
        setError('فشل في تحميل الإحصائيات')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (error) return <div className="text-red-500">{error}</div>
  if (isLoading) return <div className="text-gray-500">جاري التحميل...</div>

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="عدد التصنيفات"
        value={categories.length}
        icon={<FolderIcon className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="عدد اللغات"
        value={languages.length}
        icon={<LanguagesIcon className="h-4 w-4 text-muted-foreground" />}
      />
      <StatsCard
        title="عدد الأذكار"
        value={dhikrs.length}
        icon={<BookOpenIcon className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  )
}