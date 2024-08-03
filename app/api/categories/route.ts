import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, Category, addCategory, updateCategory, deleteCategory } from '../utils';
import { writeFile } from 'fs/promises';
import path from 'path';

async function saveImage(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image');
  }
}

export async function GET() {
  try {
    const data = await readData();
    console.log('Categories data:', data.categories); // Debug log
    return NextResponse.json(data.categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب التصنيفات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;

    if (!name) {
      return NextResponse.json({ error: 'اسم التصنيف مطلوب' }, { status: 400 });
    }

    let imageUrl = '';
    if (imageFile) {
      imageUrl = await saveImage(imageFile);
    }

    const newCategory = await addCategory({
      name,
      description,
      image: imageUrl,
    });

    console.log('New category added:', newCategory);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة التصنيف' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File | null;

    if (!id || !name) {
      return NextResponse.json({ error: 'المعرف واسم التصنيف مطلوبان' }, { status: 400 });
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = await saveImage(imageFile);
    }

    await updateCategory(id, { 
      name, 
      description, 
      image: imageUrl 
    });

    const updatedData = await readData();
    const updatedCategory = updatedData.categories.find(cat => cat.id === id);

    if (!updatedCategory) {
      return NextResponse.json({ error: 'التصنيف غير موجود' }, { status: 404 });
    }

    console.log('Category updated:', updatedCategory);
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث التصنيف' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
  }

  try {
    const success = await deleteCategory(id);
    if (success) {
      console.log('Category deleted:', id);
      return NextResponse.json({ message: 'تم حذف التصنيف بنجاح' });
    } else {
      return NextResponse.json({ error: 'التصنيف غير موجود' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف التصنيف' }, { status: 500 });
  }
}