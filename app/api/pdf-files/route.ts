import { NextRequest, NextResponse } from 'next/server';
import { readData, addPDFFile, updatePDFFile, deletePDFFile } from '../utils';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

// تعريف الثوابت
const ALLOWED_PDF_TYPES = ['application/pdf'];
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 ميجابايت
const PDF_DIR = path.join(process.cwd(), 'public', 'pdfs');
const THUMBNAIL_DIR = path.join(process.cwd(), 'public', 'images', 'thumbnails');
const DATA_FILE = path.join(process.cwd(), 'data', 'data.json');

// دالة للتحقق من صحة الملف
function validateFile(file: File, allowedTypes: string[], maxSize: number) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`نوع الملف غير صالح. الأنواع المسموح بها: ${allowedTypes.join(', ')}`);
  }
  if (file.size > maxSize) {
    throw new Error(`حجم الملف يتجاوز الحد المسموح به ${maxSize / (1024 * 1024)} ميجابايت`);
  }
}

// دالة لحفظ الملف
async function saveFile(file: File, directory: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uniqueFilename = `${Date.now()}-${file.name}`;
  const filePath = path.join(directory, uniqueFilename);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
  return uniqueFilename;
}

// دالة POST لإضافة ملف جديد
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get('file') as File;
    const imageFile = formData.get('image') as File;
    const language = formData.get('language') as string;
    const category = formData.get('category') as string;

    if (!pdfFile || !imageFile || !language || !category) {
      return NextResponse.json({ error: 'الحقول المطلوبة مفقودة' }, { status: 400 });
    }

    validateFile(pdfFile, ALLOWED_PDF_TYPES, MAX_FILE_SIZE);
    validateFile(imageFile, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE);

    // حفظ الملفات والحصول على أسمائها
    const pdfFilename = await saveFile(pdfFile, PDF_DIR);
    const imageFilename = await saveFile(imageFile, THUMBNAIL_DIR);

    const newFile = {
      id: uuidv4(),
      name: pdfFile.name.replace(/\.[^/.]+$/, ""), // إزالة امتداد الملف
      language,
      category,
      url: `/pdfs/${pdfFilename}`,
      imageUrl: `/images/thumbnails/${imageFilename}`,
      languageId: language, // التأكد من تعيين هذه القيمة
      categoryId: category, // التأكد من تعيين هذه القيمة
    };

    await addPDFFile(newFile);

    return NextResponse.json(newFile, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('خطأ في إضافة ملف PDF:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('خطأ غير متوقع:', error);
      return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
    }
  }
}

// دالة PUT لتحديث ملف موجود
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const language = formData.get('language') as string;
    const category = formData.get('category') as string;
    const pdfFile = formData.get('file') as File | null;
    const imageFile = formData.get('image') as File | null;

    if (!id || !language || !category) {
      return NextResponse.json({ error: 'الحقول المطلوبة مفقودة' }, { status: 400 });
    }

    const updateData: any = { language, category };

    if (pdfFile) {
      validateFile(pdfFile, ALLOWED_PDF_TYPES, MAX_FILE_SIZE);
      const pdfFilename = await saveFile(pdfFile, PDF_DIR);
      updateData.url = `/pdfs/${pdfFilename}`;
      updateData.name = pdfFile.name.replace(/\.[^/.]+$/, "");
    }

    if (imageFile) {
      validateFile(imageFile, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE);
      const imageFilename = await saveFile(imageFile, THUMBNAIL_DIR);
      updateData.imageUrl = `/images/thumbnails/${imageFilename}`;
    }

    await updatePDFFile(id, updateData);
    return NextResponse.json({ message: 'تم تحديث الملف بنجاح' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('خطأ في تحديث ملف PDF:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('خطأ غير متوقع:', error);
      return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
    }
  }
}

// دالة DELETE لحذف ملف
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'معرف الملف مطلوب' }, { status: 400 });
    }

    const isDeleted = await deletePDFFile(id);
    if (isDeleted) {
      return NextResponse.json({ message: 'تم حذف الملف بنجاح' });
    } else {
      return NextResponse.json({ error: 'لم يتم العثور على الملف أو فشل الحذف' }, { status: 404 });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('خطأ في حذف ملف PDF:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('خطأ غير متوقع:', error);
      return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
    }
  }
}

// دالة GET لاسترجاع الملفات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const data = await readData();
    let pdfFiles = Array.isArray(data.pdfFiles) ? data.pdfFiles : [];

    // تطبيق فلتر البحث
    if (search) {
      pdfFiles = pdfFiles.filter(file => 
        file.name.toLowerCase().includes(search.toLowerCase()) ||
        file.categoryId.toLowerCase().includes(search.toLowerCase())
      );
    }

    // تطبيق الصفحات
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedFiles = pdfFiles.slice(startIndex, endIndex);

    return NextResponse.json({
      files: paginatedFiles,
      totalPages: Math.ceil(pdfFiles.length / limit),
      currentPage: page
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('خطأ في استرجاع ملفات PDF:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('خطأ غير متوقع:', error);
      return NextResponse.json({ error: 'خطأ داخلي في الخادم' }, { status: 500 });
    }
  }
}
