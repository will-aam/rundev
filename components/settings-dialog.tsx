'use client'

import { useState } from 'react'
import { Settings, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Category, Tag } from '@/lib/types'
import { iconOptions, colorOptions } from '@/lib/types'
import { cn } from '@/lib/utils'

interface SettingsDialogProps {
  categories: Category[]
  tags: Tag[]
  onAddCategory: (category: Omit<Category, 'id'>) => Category
  onUpdateCategory: (id: string, updates: Partial<Category>) => void
  onDeleteCategory: (id: string) => boolean
  onAddTag: (name: string) => Tag
  onDeleteTag: (id: string) => void
}

const colorClasses: Record<string, string> = {
  'teal': 'bg-teal-500',
  'blue': 'bg-blue-500',
  'orange': 'bg-orange-500',
  'purple': 'bg-purple-500',
  'amber': 'bg-amber-500',
  'rose': 'bg-rose-500',
  'emerald': 'bg-emerald-500',
  'cyan': 'bg-cyan-500',
  // Fallback
  'primary': 'bg-teal-500',
  'chart-1': 'bg-orange-500',
  'chart-2': 'bg-blue-500',
  'chart-3': 'bg-purple-500',
  'chart-4': 'bg-amber-500',
  'chart-5': 'bg-rose-500',
}

export function SettingsDialog({
  categories,
  tags,
  onAddCategory,
  onDeleteCategory,
  onAddTag,
  onDeleteTag,
}: SettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('teal')
  const [newCategoryIcon, setNewCategoryIcon] = useState('interests')
  const [newTagName, setNewTagName] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return
    onAddCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor,
      icon: newCategoryIcon,
    })
    setNewCategoryName('')
    setNewCategoryColor('teal')
    setNewCategoryIcon('interests')
  }

  const handleDeleteCategory = (id: string) => {
    const success = onDeleteCategory(id)
    if (!success) {
      setDeleteError('Nao e possivel excluir: existem marcos usando esta categoria.')
      setTimeout(() => setDeleteError(null), 3000)
    }
  }

  const handleAddTag = () => {
    if (!newTagName.trim()) return
    onAddTag(newTagName.trim())
    setNewTagName('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias e Tags</DialogTitle>
          <DialogDescription>
            Crie e gerencie suas categorias e tags personalizadas.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="categories" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">Categorias</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-4">
            {deleteError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                {deleteError}
              </div>
            )}

            {/* Add new category */}
            <div className="p-4 bg-secondary/50 rounded-lg mb-4">
              <p className="text-sm font-medium text-foreground mb-3">Nova Categoria</p>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="cat-name">Nome</FieldLabel>
                  <Input
                    id="cat-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ex: Certificacao"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="cat-color">Cor</FieldLabel>
                    <Select value={newCategoryColor} onValueChange={setNewCategoryColor}>
                      <SelectTrigger id="cat-color">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className={cn('w-3 h-3 rounded-full', colorClasses[color.value])} />
                              {color.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="cat-icon">Icone</FieldLabel>
                    <Select value={newCategoryIcon} onValueChange={setNewCategoryIcon}>
                      <SelectTrigger id="cat-icon">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Button onClick={handleAddCategory} className="w-full mt-2" disabled={!newCategoryName.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Categoria
                </Button>
              </FieldGroup>
            </div>

            {/* List categories */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground mb-2">Categorias existentes:</p>
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('w-3 h-3 rounded-full', colorClasses[category.color] || 'bg-muted')} />
                    <span className="text-sm text-foreground">{category.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tags" className="mt-4">
            {/* Add new tag */}
            <div className="p-4 bg-secondary/50 rounded-lg mb-4">
              <p className="text-sm font-medium text-foreground mb-3">Nova Tag</p>
              <div className="flex gap-2">
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Ex: JavaScript"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} disabled={!newTagName.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* List tags */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">Tags existentes:</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {tag.name}
                    <button
                      onClick={() => onDeleteTag(tag.id)}
                      className="ml-1 p-0.5 hover:bg-background/50 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma tag cadastrada.</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
