// app/api/languages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, Language } from '../utils';

export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data.languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء جلب اللغات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await readData();
    const { name, code } = body;

    // التحقق من وجود اللغة
    const languageExists = data.languages.some(
      (lang) => lang.name.toLowerCase() === name.toLowerCase() || 
                lang.code.toLowerCase() === code.toLowerCase()
    );

    if (languageExists) {
      return NextResponse.json({ error: 'اللغة موجودة بالفعل' }, { status: 400 });
    }

    const newLanguage: Language = {
      id: Date.now().toString(),
      name,
      code
    };
    data.languages.push(newLanguage);
    await writeData(data);
    return NextResponse.json({ message: 'تمت إضافة اللغة بنجاح', language: newLanguage }, { status: 201 });
  } catch (error) {
    console.error("Error adding language:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إضافة اللغة' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    const data = await readData();
    const index = data.languages.findIndex(lang => lang.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'اللغة غير موجودة' }, { status: 404 });
    }
    
    // التحقق من عدم وجود تكرار في الاسم أو الرمز
    const isDuplicate = data.languages.some(
      (lang) => lang.id !== id && (
        lang.name.toLowerCase() === body.name.toLowerCase() ||
        lang.code.toLowerCase() === body.code.toLowerCase()
      )
    );

    if (isDuplicate) {
      return NextResponse.json({ error: 'الاسم أو الرمز موجود بالفعل للغة أخرى' }, { status: 400 });
    }

    data.languages[index] = { ...data.languages[index], ...body };
    await writeData(data);
    return NextResponse.json({ message: 'تم تحديث اللغة بنجاح', language: data.languages[index] });
  } catch (error) {
    console.error("Error updating language:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تحديث اللغة' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
  }

  try {
    const data = await readData();
    const initialLength = data.languages.length;
    data.languages = data.languages.filter(lang => lang.id !== id);
    if (data.languages.length === initialLength) {
      return NextResponse.json({ error: 'اللغة غير موجودة' }, { status: 404 });
    }
    await writeData(data);
    return NextResponse.json({ message: 'تم حذف اللغة بنجاح' });
  } catch (error) {
    console.error("Error deleting language:", error);
    return NextResponse.json({ error: 'حدث خطأ أثناء حذف اللغة' }, { status: 500 });
  }
}