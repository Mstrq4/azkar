'use client';

import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  id: string;
  name: string;
}

interface Language {
  id: string;
  name: string;
}

interface AddDhikrFormProps {
  onAddDhikr: () => Promise<void>;
}

const AddDhikrForm: React.FC<AddDhikrFormProps> = ({ onAddDhikr }) => {
  const [text, setText] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  useEffect(() => {
    // Fetch categories and languages from your API
    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch('/api/languages?type=categories');
        const languagesResponse = await fetch('/api/languages?type=languages');
        
        if (categoriesResponse.ok && languagesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          const languagesData = await languagesResponse.json();
          setCategories(categoriesData);
          setLanguages(languagesData);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/dhikr?type=dhikrs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, categoryId: category, languageId: language }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setText('');
        setCategory('');
        setLanguage('');
        alert(data.message || 'تمت إضافة الذكر بنجاح');
        await onAddDhikr(); // استدعاء الدالة بعد إضافة الذكر بنجاح
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'فشل في إضافة الذكر');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ أثناء إرسال النموذج');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select onValueChange={setCategory} value={category} required>
        <SelectTrigger>
          <SelectValue placeholder="اختر التصنيف" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select onValueChange={setLanguage} value={language} required>
        <SelectTrigger>
          <SelectValue placeholder="اختر اللغة" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.id} value={lang.id}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Textarea 
        placeholder="نص الذكر" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        className="min-h-[100px]"
      />
      
      <Button type="submit">إضافة</Button>
    </form>
  );
};

export default AddDhikrForm;