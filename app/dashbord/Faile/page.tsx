/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PDFFile {
  id: string;
  name: string;
  language: string;
  category: string;
  url: string;
  imageUrl: string;
}

interface Language {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export default function PDFUploadPage() {
  const [pdfFiles, setPDFFiles] = useState<PDFFile[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<PDFFile | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchPDFFiles();
    fetchLanguages();
    fetchCategories();
  }, []);

  const fetchPDFFiles = async () => {
    try {
      const response = await fetch('/api/pdf-files');
      const data = await response.json();
      console.log('البيانات المستلمة:', data);
      
      if (Array.isArray(data)) {
        setPDFFiles(data);
      } else if (data.files && Array.isArray(data.files)) {
        setPDFFiles(data.files);
      } else if (typeof data === 'object') {
        const filesArray = Object.values(data);
        if (Array.isArray(filesArray[0])) {
          setPDFFiles(filesArray[0]);
        } else {
          console.error('تنسيق البيانات غير متوقع:', data);
          setPDFFiles([]);
        }
      } else {
        console.error('البيانات المستلمة ليست بالتنسيق المتوقع:', data);
        setPDFFiles([]);
      }
    } catch (error) {
      console.error('خطأ في جلب ملفات PDF:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب ملفات PDF",
        variant: "destructive",
      });
      setPDFFiles([]);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/languages');
      const data = await response.json();
      setLanguages(data);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !image || !selectedLanguage || !selectedCategory) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('image', image);
    formData.append('language', selectedLanguage);
    formData.append('category', selectedCategory);

    try {
      const response = await fetch('/api/pdf-files', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "نجاح",
          description: "تم رفع الملف بنجاح",
        });
        fetchPDFFiles();
        setIsDialogOpen(false);
      } else {
        throw new Error('فشل في رفع الملف');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "خطأ",
        description: "فشل في رفع الملف",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (file: PDFFile) => {
    setEditingFile(file);
    setSelectedLanguage(file.language);
    setSelectedCategory(file.category);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingFile || !selectedLanguage || !selectedCategory) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('id', editingFile.id);
    formData.append('language', selectedLanguage);
    formData.append('category', selectedCategory);
    if (file) formData.append('file', file);
    if (image) formData.append('image', image);

    try {
      const response = await fetch('/api/pdf-files', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "نجاح",
          description: "تم تحديث الملف بنجاح",
        });
        fetchPDFFiles();
        setIsDialogOpen(false);
        setEditingFile(null);
      } else {
        throw new Error('فشل في تحديث الملف');
      }
    } catch (error) {
      console.error('Error updating file:', error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث الملف",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setFileToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      const response = await fetch(`/api/pdf-files?id=${fileToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في حذف الملف');
      }

      setPDFFiles(prevFiles => prevFiles.filter(file => file.id !== fileToDelete));
      
      toast({
        title: "نجاح",
        description: "تم حذف الملف بنجاح",
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "خطأ",
        description: `فشل في حذف الملف: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const filteredFiles = Array.isArray(pdfFiles) 
    ? pdfFiles.filter(file =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterLanguage === 'all' || file.language === filterLanguage) &&
        (filterCategory === 'all' || file.category === filterCategory)
      )
    : [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">إضافة ملف الأذكار</h1>
      <div className="flex gap-2 mb-2">
        <Input
          type="text"
          placeholder="بحث عن ملف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={filterLanguage} onValueChange={setFilterLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="اختر اللغة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع اللغات</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger>
            <SelectValue placeholder="اختر الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>إضافة ملف PDF جديد</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFile ? 'تعديل ملف PDF' : 'رفع ملف PDF جديد'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={editingFile ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="language">اللغة</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>{lang.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="category">الفئة</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file">ملف PDF</Label>
                <Input id="file" type="file" onChange={handleFileChange} accept=".pdf" />
              </div>
              <div>
                <Label htmlFor="image">صورة الغلاف</Label>
                <Input id="image" type="file" onChange={handleImageChange} accept="image/*" />
              </div>
              <Button type="submit">{editingFile ? 'تحديث' : 'رفع'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <Card key={file.id}>
            <CardHeader>
              <CardTitle className='text-[16px] mb-0'>{file.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={file.imageUrl} alt={file.name} className="w-full h-32 object-cover mb-2" />
              <div className='flex w-full justify-between'>
                <p className='text-[12px]'>{languages.find(lang => lang.id === file.language)?.name}</p>
                <p className='text-[12px]'>{categories.find(cat => cat.id === file.category)?.name}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className='' variant="outline" size="sm" onClick={() => handleEdit(file)}>
                <Pencil className="ml-2 h-4 w-4" /> تعديل
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(file.id)}>
                <Trash2 className="ml-2 h-4 w-4" /> حذف
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className=''>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-center'>هل أنت متأكد أنك تريد حذف هذا الملف؟</AlertDialogTitle>
            <AlertDialogDescription className='text-center'>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الملف بشكل دائم من الخادم.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex gap-2'>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>تأكيد الحذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}