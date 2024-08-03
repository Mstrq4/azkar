'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Language {
  id: string;
  name: string;
  code: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LanguagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [newLanguage, setNewLanguage] = useState({ name: '', code: '' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: languages, error, mutate } = useSWR<Language[]>('/api/languages?type=languages', fetcher, {
    refreshInterval: 5000
  });

  const filteredLanguages = languages?.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/languages?type=languages&id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في حذف اللغة');
      }
      const result = await response.json();
      toast({ title: "نجاح", description: result.message });
      mutate();
    } catch (error) {
      console.error('Error deleting language:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء حذف اللغة",
        variant: "destructive",
      });
    }
  }

  async function handleEdit(language: Language) {
    try {
      const response = await fetch('/api/languages?type=languages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(language),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في تحديث اللغة');
      }
      const result = await response.json();
      toast({ title: "نجاح", description: result.message });
      mutate();
      setEditingLanguage(null);
    } catch (error) {
      console.error('Error updating language:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تحديث اللغة",
        variant: "destructive",
      });
    }
  }

  async function handleAdd() {
    try {
      const response = await fetch('/api/languages?type=languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLanguage),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في إضافة اللغة');
      }
      const result = await response.json();
      toast({ title: "نجاح", description: result.message });
      mutate();
      setNewLanguage({ name: '', code: '' });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding language:', error);
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء إضافة اللغة",
        variant: "destructive",
      });
    }
  }

  if (error) return <div className="text-center p-4">حدث خطأ أثناء تحميل البيانات</div>;
  if (!languages) return <div className="text-center p-4">جاري التحميل...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">قائمة اللغات</h1>
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="بحث عن لغة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddDialogOpen(true)}>إضافة لغة جديدة</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة لغة جديدة</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                value={newLanguage.name}
                onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                placeholder="اسم اللغة"
              />
              <Input
                value={newLanguage.code}
                onChange={(e) => setNewLanguage({ ...newLanguage, code: e.target.value })}
                placeholder="رمز اللغة"
              />
              <Button onClick={handleAdd}>إضافة اللغة</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {languages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLanguages.map((language) => (
            <Card key={language.id}>
              <CardHeader>
                <CardTitle className='text-[18px]'>{language.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-[12px]'>الرمز: {language.code}</p>
                <div className="mt-4 flex justify-between space-x-2 ">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setEditingLanguage(language)}>
                        تعديل
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تعديل اللغة</DialogTitle>
                      </DialogHeader>
                      {editingLanguage && (
                        <div className="grid gap-4 py-4">
                          <Input
                            value={editingLanguage.name}
                            onChange={(e) => setEditingLanguage({ ...editingLanguage, name: e.target.value })}
                            placeholder="اسم اللغة"
                          />
                          <Input
                            value={editingLanguage.code}
                            onChange={(e) => setEditingLanguage({ ...editingLanguage, code: e.target.value })}
                            placeholder="رمز اللغة"
                          />
                          <Button onClick={() => handleEdit(editingLanguage)}>حفظ التغييرات</Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" onClick={() => handleDelete(language.id)}>
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center">لا توجد لغات مضافة حتى الآن.</p>
      )}
    </div>
  );
}