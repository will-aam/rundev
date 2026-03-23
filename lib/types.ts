export interface TimelineEvent {
  id: string
  startYear: number
  startMonth?: number
  endYear?: number
  endMonth?: number
  title: string
  categoryId: string
  description: string
  details?: string
  tags?: string[]
  link?: string
  createdAt: number
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export interface Tag {
  id: string
  name: string
}

export const defaultCategories: Category[] = [
  { id: 'educacao', name: 'Educacao', color: 'teal', icon: 'school' },
  { id: 'livro', name: 'Livro', color: 'blue', icon: 'menu_book' },
  { id: 'curso', name: 'Curso', color: 'orange', icon: 'laptop_mac' },
  { id: 'experiencia', name: 'Experiencia', color: 'purple', icon: 'work' },
  { id: 'habilidade', name: 'Habilidade', color: 'amber', icon: 'lightbulb' },
  { id: 'outro', name: 'Outro', color: 'rose', icon: 'interests' },
]

export const iconOptions = [
  { value: 'school', label: 'Graduacao' },
  { value: 'menu_book', label: 'Livro' },
  { value: 'laptop_mac', label: 'Laptop' },
  { value: 'code', label: 'Codigo' },
  { value: 'work', label: 'Trabalho' },
  { value: 'lightbulb', label: 'Ideia' },
  { value: 'interests', label: 'Interesses' },
  { value: 'star', label: 'Estrela' },
  { value: 'favorite', label: 'Coracao' },
  { value: 'emoji_events', label: 'Trofeu' },
  { value: 'rocket_launch', label: 'Foguete' },
  { value: 'music_note', label: 'Musica' },
  { value: 'language', label: 'Globo' },
  { value: 'psychology', label: 'Mente' },
  { value: 'auto_stories', label: 'Historias' },
  { value: 'terminal', label: 'Terminal' },
]

export const colorOptions = [
  { value: 'teal', label: 'Verde-agua' },
  { value: 'blue', label: 'Azul' },
  { value: 'orange', label: 'Laranja' },
  { value: 'purple', label: 'Roxo' },
  { value: 'amber', label: 'Amarelo' },
  { value: 'rose', label: 'Rosa' },
  { value: 'emerald', label: 'Esmeralda' },
  { value: 'cyan', label: 'Ciano' },
]
