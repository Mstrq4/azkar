'use client';

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Dhikr {
  id: string
  text: string
  categoryId: string
  languageId: string
  repetitions: number
}

interface Category {
  id: string
  name: string
}

interface Language {
  id: string
  name: string
}

export default function Home() {
  const [dhikrs, setDhikrs] = useState<Dhikr[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newDhikr, setNewDhikr] = useState({ text: '', categoryId: '', languageId: '', repetitions: 1 })
  const [editingDhikr, setEditingDhikr] = useState<Dhikr | null>(null)
  const [dhikrToDelete, setDhikrToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchDhikrs()
    fetchCategories()
    fetchLanguages()
  }, [])

  const fetchDhikrs = async () => {
    const response = await fetch('/api/dhikrs?type=dhikrs')
    const data = await response.json()
    setDhikrs(data)
  }

  const fetchCategories = async () => {
    const response = await fetch('/api/categories?type=categories')
    const data = await response.json()
    setCategories(data)
  }

  const fetchLanguages = async () => {
    const response = await fetch('/api/languages?type=languages')
    const data = await response.json()
    setLanguages(data)
  }

  const handleAddDhikr = async () => {
    const response = await fetch('/api/dhikrs?type=dhikrs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDhikr)
    })
    if (response.ok) {
      fetchDhikrs()
      setIsAddDialogOpen(false)
      setNewDhikr({ text: '', categoryId: '', languageId: '', repetitions: 1 })
      toast({ title: "تمت إضافة الذكر بنجاح" })
    } else {
      toast({ title: "حدث خطأ أثناء إضافة الذكر", variant: "destructive" })
    }
  }

  const handleEditDhikr = async () => {
    if (!editingDhikr) return
    const response = await fetch(`/api/dhikrs?type=dhikrs&id=${editingDhikr.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingDhikr)
    })
    if (response.ok) {
      fetchDhikrs()
      setEditingDhikr(null)
      toast({ title: "تم تحديث الذكر بنجاح" })
    } else {
      const errorData = await response.json()
      toast({ title: `حدث خطأ أثناء تحديث الذكر: ${errorData.error}`, variant: "destructive" })
    }
  }

  const handleDeleteDhikr = (id: string) => {
    setDhikrToDelete(id)
  }

  const confirmDeleteDhikr = async () => {
    if (!dhikrToDelete) return
    const response = await fetch(`/api/dhikrs?type=dhikrs&id=${dhikrToDelete}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      fetchDhikrs()
      toast({ title: "تم حذف الذكر بنجاح" })
    } else {
      toast({ title: "حدث خطأ أثناء حذف الذكر", variant: "destructive" })
    }
    setDhikrToDelete(null)
  }

  const filterDhikrs = (dhikrs: Dhikr[], selectedCategory: string, selectedLanguage: string, searchTerm: string): Dhikr[] => {
    if (!Array.isArray(dhikrs)) {
      console.error('dhikrs is not an array:', dhikrs)
      return []
    }
  
    return dhikrs.filter((dhikr) => {
      if (!dhikr || typeof dhikr !== 'object') {
        console.warn('Invalid dhikr object:', dhikr)
        return false
      }
  
      const categoryMatch = !selectedCategory || dhikr.categoryId === selectedCategory
      const languageMatch = !selectedLanguage || dhikr.languageId === selectedLanguage
      const textMatch = !searchTerm || (typeof dhikr.text === 'string' && dhikr.text.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return categoryMatch && languageMatch && textMatch
    })
  }
  
  const filteredDhikrs = filterDhikrs(dhikrs, selectedCategory, selectedLanguage, searchTerm)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">قائمة الأذكار</h1>
      <div className="flex space-x-4 mb-4">
        <Input 
          placeholder="بحث في الأذكار" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="اختر التصنيف" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="اختر اللغة" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(language => (
              <SelectItem key={language.id} value={language.id}>{language.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>إضافة ذكر</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة ذكر جديد</DialogTitle>
            </DialogHeader>
            <Select onValueChange={(value) => setNewDhikr({...newDhikr, categoryId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setNewDhikr({...newDhikr, languageId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(language => (
                  <SelectItem key={language.id} value={language.id}>{language.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea 
              className='white-space: pre-wrap'
              placeholder="أدخل نص الذكر" 
              value={newDhikr.text}
              onChange={(e) => setNewDhikr({...newDhikr, text: e.target.value})}
            />
            <Input 
              type="number"
              placeholder="عدد مرات التكرار"
              value={newDhikr.repetitions}
              onChange={(e) => setNewDhikr({...newDhikr, repetitions: parseInt(e.target.value) || 1})}
              min="1"
            />
            <Button onClick={handleAddDhikr}>إضافة</Button>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الأذكار</TableHead>
              <TableHead className="text-center">عدد التكرار</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDhikrs.map(dhikr => (
              <TableRow key={dhikr.id}>
                <TableCell className="text-right whitespace-normal break-words max-w-[60%]">
                  {dhikr.text}
                </TableCell>
                <TableCell className="text-center">
                  {dhikr.repetitions}
                </TableCell>
                <TableCell className="text-left whitespace-nowrap">
                  <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" onClick={() => setEditingDhikr(dhikr)}>
                      تعديل
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" onClick={() => handleDeleteDhikr(dhikr.id)}>
                          حذف
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className='text-center'>هل أنت متأكد من حذف هذا الذكر؟</AlertDialogTitle>
                          <AlertDialogDescription className='text-center'>
                            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الذكر نهائياً من قاعدة البيانات.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='flex gap-2'>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDeleteDhikr}>تأكيد الحذف</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingDhikr && (
        <Dialog open={!!editingDhikr} onOpenChange={() => setEditingDhikr(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل الذكر</DialogTitle>
            </DialogHeader>
            <Select 
              value={editingDhikr.categoryId}
              onValueChange={(value) => setEditingDhikr({...editingDhikr, categoryId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر التصنيف" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select 
              value={editingDhikr.languageId}
              onValueChange={(value) => setEditingDhikr({...editingDhikr, languageId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر اللغة" />
              </SelectTrigger>
              <SelectContent>
                {languages.map(language => (
                  <SelectItem key={language.id} value={language.id}>{language.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea 
              value={editingDhikr.text}
              onChange={(e) => setEditingDhikr({...editingDhikr, text: e.target.value})}
            />
            <Input 
              type="number"
              placeholder="عدد مرات التكرار"
              value={editingDhikr.repetitions}
              onChange={(e) => setEditingDhikr({...editingDhikr, repetitions: parseInt(e.target.value) || 1})}
              min="1"
            />
            <Button onClick={handleEditDhikr}>حفظ التغييرات</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}