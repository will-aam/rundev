'use client'

import { useState, useEffect, useCallback } from 'react'
import type { TimelineEvent, Category, Tag } from '@/lib/types'
import { defaultCategories } from '@/lib/types'

const EVENTS_KEY = 'timeline-events'
const CATEGORIES_KEY = 'timeline-categories'
const TAGS_KEY = 'timeline-tags'

const initialEvents: TimelineEvent[] = [
  {
    id: '1',
    startYear: 2020,
    startMonth: 3,
    endYear: 2020,
    endMonth: 6,
    title: 'Primeiro contato com programacao',
    categoryId: 'educacao',
    description: 'Comecei a estudar logica de programacao atraves de tutoriais online.',
    details: 'Foi o inicio de tudo. Aprendi conceitos basicos como variaveis, loops e condicionais.',
    tags: ['Logica', 'Iniciante'],
    createdAt: Date.now() - 1000000,
  },
  {
    id: '2',
    startYear: 2021,
    startMonth: 6,
    title: 'Curso de Redes de Computadores',
    categoryId: 'curso',
    description: 'Estudei fundamentos de redes, protocolos TCP/IP e arquitetura de sistemas.',
    details: 'Entendi como a internet funciona por baixo dos panos.',
    tags: ['Redes', 'TCP/IP'],
    link: 'https://exemplo.com/curso-redes',
    createdAt: Date.now() - 900000,
  },
  {
    id: '3',
    startYear: 2022,
    startMonth: 1,
    title: 'Livro: Clean Code',
    categoryId: 'livro',
    description: 'Li o livro Clean Code de Robert C. Martin.',
    details: 'O que mais me impactou foi a ideia de que codigo e comunicacao.',
    tags: ['Boas Praticas'],
    createdAt: Date.now() - 800000,
  },
]

const initialTags: Tag[] = [
  { id: '1', name: 'Logica' },
  { id: '2', name: 'Iniciante' },
  { id: '3', name: 'Redes' },
  { id: '4', name: 'TCP/IP' },
  { id: '5', name: 'Boas Praticas' },
]

export function useTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load events
    const storedEvents = localStorage.getItem(EVENTS_KEY)
    if (storedEvents) {
      try {
        setEvents(JSON.parse(storedEvents))
      } catch {
        setEvents(initialEvents)
        localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents))
      }
    } else {
      setEvents(initialEvents)
      localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents))
    }

    // Load categories
    const storedCategories = localStorage.getItem(CATEGORIES_KEY)
    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories))
      } catch {
        setCategories(defaultCategories)
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories))
      }
    } else {
      setCategories(defaultCategories)
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories))
    }

    // Load tags
    const storedTags = localStorage.getItem(TAGS_KEY)
    if (storedTags) {
      try {
        setTags(JSON.parse(storedTags))
      } catch {
        setTags(initialTags)
        localStorage.setItem(TAGS_KEY, JSON.stringify(initialTags))
      }
    } else {
      setTags(initialTags)
      localStorage.setItem(TAGS_KEY, JSON.stringify(initialTags))
    }

    setIsLoaded(true)
  }, [])

  // Events
  const saveEvents = useCallback((newEvents: TimelineEvent[]) => {
    setEvents(newEvents)
    localStorage.setItem(EVENTS_KEY, JSON.stringify(newEvents))
  }, [])

  const addEvent = useCallback((event: Omit<TimelineEvent, 'id' | 'createdAt'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    saveEvents([...events, newEvent])
  }, [events, saveEvents])

  const updateEvent = useCallback((id: string, updates: Partial<Omit<TimelineEvent, 'id' | 'createdAt'>>) => {
    saveEvents(events.map(e => e.id === id ? { ...e, ...updates } : e))
  }, [events, saveEvents])

  const deleteEvent = useCallback((id: string) => {
    saveEvents(events.filter(e => e.id !== id))
  }, [events, saveEvents])

  // Categories
  const saveCategories = useCallback((newCategories: Category[]) => {
    setCategories(newCategories)
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCategories))
  }, [])

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    }
    saveCategories([...categories, newCategory])
    return newCategory
  }, [categories, saveCategories])

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    saveCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c))
  }, [categories, saveCategories])

  const deleteCategory = useCallback((id: string) => {
    // Don't allow deleting if events use this category
    const eventsWithCategory = events.filter(e => e.categoryId === id)
    if (eventsWithCategory.length > 0) {
      return false
    }
    saveCategories(categories.filter(c => c.id !== id))
    return true
  }, [categories, events, saveCategories])

  // Tags
  const saveTags = useCallback((newTags: Tag[]) => {
    setTags(newTags)
    localStorage.setItem(TAGS_KEY, JSON.stringify(newTags))
  }, [])

  const addTag = useCallback((name: string) => {
    const existingTag = tags.find(t => t.name.toLowerCase() === name.toLowerCase())
    if (existingTag) return existingTag
    
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name,
    }
    saveTags([...tags, newTag])
    return newTag
  }, [tags, saveTags])

  const deleteTag = useCallback((id: string) => {
    saveTags(tags.filter(t => t.id !== id))
  }, [tags, saveTags])

  const sortedEvents = [...events].sort((a, b) => {
    if (a.startYear !== b.startYear) return a.startYear - b.startYear
    if (a.startMonth && b.startMonth) return a.startMonth - b.startMonth
    return 0
  })

  const getCategory = useCallback((id: string) => {
    return categories.find(c => c.id === id) || defaultCategories[5]
  }, [categories])

  return {
    events: sortedEvents,
    categories,
    tags,
    isLoaded,
    addEvent,
    updateEvent,
    deleteEvent,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    deleteTag,
    getCategory,
  }
}
