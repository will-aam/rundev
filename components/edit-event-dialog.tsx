'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { TimelineEvent, Category, Tag } from '@/lib/types'
import { cn } from '@/lib/utils'

interface EditEventDialogProps {
  event: TimelineEvent
  categories: Category[]
  tags: Tag[]
  onUpdate: (id: string, updates: Partial<Omit<TimelineEvent, 'id' | 'createdAt'>>) => void
  onAddTag: (name: string) => Tag
}

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 50 }, (_, i) => currentYear - i)
const months = [
  { value: 'none', label: 'Nao especificar' },
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Marco' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

const colorClasses: Record<string, string> = {
  'teal': 'bg-teal-500',
  'blue': 'bg-blue-500',
  'orange': 'bg-orange-500',
  'purple': 'bg-purple-500',
  'amber': 'bg-amber-500',
  'rose': 'bg-rose-500',
  'emerald': 'bg-emerald-500',
  'cyan': 'bg-cyan-500',
  'primary': 'bg-teal-500',
  'chart-1': 'bg-orange-500',
  'chart-2': 'bg-blue-500',
  'chart-3': 'bg-purple-500',
  'chart-4': 'bg-amber-500',
  'chart-5': 'bg-rose-500',
}

export function EditEventDialog({ event, categories, tags, onUpdate, onAddTag }: EditEventDialogProps) {
  const [open, setOpen] = useState(false)
  const [hasPeriod, setHasPeriod] = useState(!!event.endYear)
  const [selectedTags, setSelectedTags] = useState<string[]>(event.tags || [])
  const [newTagInput, setNewTagInput] = useState('')
  const [formData, setFormData] = useState({
    startYear: event.startYear.toString(),
    startMonth: event.startMonth?.toString() || '',
    endYear: event.endYear?.toString() || currentYear.toString(),
    endMonth: event.endMonth?.toString() || '',
    title: event.title,
    categoryId: event.categoryId,
    description: event.description,
    details: event.details || '',
    link: event.link || '',
  })

  // Reset form when event changes
  useEffect(() => {
    setHasPeriod(!!event.endYear)
    setSelectedTags(event.tags || [])
    setFormData({
      startYear: event.startYear.toString(),
      startMonth: event.startMonth?.toString() || '',
      endYear: event.endYear?.toString() || currentYear.toString(),
      endMonth: event.endMonth?.toString() || '',
      title: event.title,
      categoryId: event.categoryId,
      description: event.description,
      details: event.details || '',
      link: event.link || '',
    })
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.categoryId) return

    onUpdate(event.id, {
      startYear: parseInt(formData.startYear),
      startMonth: formData.startMonth ? parseInt(formData.startMonth) : undefined,
      endYear: hasPeriod && formData.endYear ? parseInt(formData.endYear) : undefined,
      endMonth: hasPeriod && formData.endMonth ? parseInt(formData.endMonth) : undefined,
      title: formData.title,
      categoryId: formData.categoryId,
      description: formData.description,
      details: formData.details || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      link: formData.link || undefined,
    })

    setOpen(false)
  }

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    )
  }

  const handleAddNewTag = () => {
    if (!newTagInput.trim()) return
    const newTag = onAddTag(newTagInput.trim())
    setSelectedTags(prev => [...prev, newTag.name])
    setNewTagInput('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-foreground"
        >
          <Pencil className="w-4 h-4 mr-1" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Marco</DialogTitle>
          <DialogDescription>
            Atualize as informacoes deste marco da sua jornada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            {/* Start Year and Month */}
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="editStartYear">Ano Inicio *</FieldLabel>
                <Select
                  value={formData.startYear}
                  onValueChange={(value) => setFormData({ ...formData, startYear: value })}
                >
                  <SelectTrigger id="editStartYear">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="editStartMonth">Mes Inicio</FieldLabel>
                <Select
                  value={formData.startMonth}
                  onValueChange={(value) => setFormData({ ...formData, startMonth: value === 'none' ? '' : value })}
                >
                  <SelectTrigger id="editStartMonth">
                    <SelectValue placeholder="Opcional" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Period checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox 
                id="editHasPeriod" 
                checked={hasPeriod} 
                onCheckedChange={(checked) => setHasPeriod(checked === true)}
              />
              <label htmlFor="editHasPeriod" className="text-sm text-muted-foreground cursor-pointer">
                Este marco tem uma data de fim (periodo)
              </label>
            </div>

            {/* End Year and Month */}
            {hasPeriod && (
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="editEndYear">Ano Fim</FieldLabel>
                  <Select
                    value={formData.endYear}
                    onValueChange={(value) => setFormData({ ...formData, endYear: value })}
                  >
                    <SelectTrigger id="editEndYear">
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="editEndMonth">Mes Fim</FieldLabel>
                  <Select
                    value={formData.endMonth}
                    onValueChange={(value) => setFormData({ ...formData, endMonth: value === 'none' ? '' : value })}
                  >
                    <SelectTrigger id="editEndMonth">
                      <SelectValue placeholder="Opcional" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value || 'none'} value={month.value || 'none'}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}

            {/* Category */}
            <Field>
              <FieldLabel htmlFor="editCategory">Categoria *</FieldLabel>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger id="editCategory">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', colorClasses[cat.color] || 'bg-muted')} />
                        {cat.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Title */}
            <Field>
              <FieldLabel htmlFor="editTitle">Titulo *</FieldLabel>
              <Input
                id="editTitle"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Curso de React Avancado"
              />
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel htmlFor="editDescription">Descricao *</FieldLabel>
              <Textarea
                id="editDescription"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Uma breve descricao do que foi esse momento..."
                rows={2}
              />
            </Field>

            {/* Details */}
            <Field>
              <FieldLabel htmlFor="editDetails">Detalhes (opcional)</FieldLabel>
              <Textarea
                id="editDetails"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="O que mais te marcou? O que voce aprendeu de importante?"
                rows={3}
              />
            </Field>

            {/* Link */}
            <Field>
              <FieldLabel htmlFor="editLink">Link (opcional)</FieldLabel>
              <Input
                id="editLink"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://exemplo.com/recurso"
              />
            </Field>

            {/* Tags */}
            <Field>
              <FieldLabel>Tags (opcional)</FieldLabel>
              <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 rounded-lg min-h-[60px]">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.name) ? 'default' : 'outline'}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleTag(tag.name)}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.name) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <span className="text-xs text-muted-foreground">Nenhuma tag cadastrada.</span>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Nova tag..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewTag())}
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddNewTag} disabled={!newTagInput.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.title || !formData.description || !formData.categoryId}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
