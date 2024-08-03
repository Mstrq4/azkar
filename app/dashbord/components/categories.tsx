'use client';

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Category {
  id: string
  name: string
  description: string
  image: string
}

export default function CategoryForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({
    name: '',
    description: '',
    image: '',
  })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        console.error('Failed to fetch categories')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAdd = async () => {
    const formData = new FormData()
    formData.append('name', newCategory.name)
    formData.append('description', newCategory.description)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const addedCategory = await response.json()
        setCategories([...categories, addedCategory])
        setNewCategory({ name: '', description: '', image: '' })
        setImageFile(null)
        setIsAddDialogOpen(false)
        toast({ title: "تمت إضافة التصنيف بنجاح" })
      } else {
        toast({ title: "حدث خطأ أثناء إضافة التصنيف", variant: "destructive" })
      }
    } catch (error) {
      console.error('Error adding category:', error)
      toast({ title: "حدث خطأ أثناء إضافة التصنيف", variant: "destructive" })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setImageFile(null)
  }

  const handleUpdate = async () => {
    if (!editingCategory) return

    const formData = new FormData()
    formData.append('id', editingCategory.id)
    formData.append('name', editingCategory.name)
    formData.append('description', editingCategory.description)
    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        body: formData,
      })

      if (response.ok) {
        const updatedCategory = await response.json()
        setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat))
        setEditingCategory(null)
        setImageFile(null)
        toast({ title: "تم تحديث التصنيف بنجاح" })
      } else {
        toast({ title: "حدث خطأ أثناء تحديث التصنيف", variant: "destructive" })
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast({ title: "حدث خطأ أثناء تحديث التصنيف", variant: "destructive" })
    }
  }

  const handleDelete = (id: string) => {
    setCategoryToDelete(id)
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return

    try {
      const response = await fetch(`/api/categories?id=${categoryToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCategories(categories.filter(cat => cat.id !== categoryToDelete))
        toast({ title: "تم حذف التصنيف بنجاح" })
      } else {
        toast({ title: "حدث خطأ أثناء حذف التصنيف", variant: "destructive" })
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({ title: "حدث خطأ أثناء حذف التصنيف", variant: "destructive" })
    }
    setCategoryToDelete(null)
  }

  return (
    <div>
      <h1>إدارة التصنيفات</h1>
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>إضافة تصنيف جديد</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة تصنيف جديد</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="اسم التصنيف"
          />
          <Input
            type="text"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            placeholder="وصف التصنيف"
          />
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setImageFile(file)
              }
            }}
            accept="image/*"
          />
          <Button onClick={handleAdd}>إضافة التصنيف</Button>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الوصف</TableHead>
              <TableHead className="text-right">الصورة</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell className="text-right">{category.name}</TableCell>
                <TableCell className="text-right">{category.description}</TableCell>
                <TableCell className="text-right">
                  {category.image && <img src={category.image} alt={category.name} style={{ width: '50px', height: '50px' }} />}
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" onClick={() => handleEdit(category)}>
                      تعديل
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" onClick={() => handleDelete(category.id)}>
                          حذف
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className='text-center'>هل أنت متأكد من حذف هذا التصنيف؟</AlertDialogTitle>
                          <AlertDialogDescription className='text-center'>
                            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف التصنيف نهائياً من قاعدة البيانات.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='flex gap-2'>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDelete}>تأكيد الحذف</AlertDialogAction>
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

      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل التصنيف</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              placeholder="اسم التصنيف"
            />
            <Input
              type="text"
              value={editingCategory.description}
              onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
              placeholder="وصف التصنيف"
            />
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setImageFile(file)
                }
              }}
              accept="image/*"
            />
            <Button onClick={handleUpdate}>حفظ التغييرات</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}