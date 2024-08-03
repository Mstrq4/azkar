import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, Dhikr } from '../utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type !== 'dhikrs') {
      return NextResponse.json({ error: 'نوع غير صالح' }, { status: 400 });
    }

    const data = await readData();
    return NextResponse.json(data.dhikrs);
  } catch (error) {
    console.error("Error fetching dhikrs:", error);
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير معروف';
    return NextResponse.json({ error: `حدث خطأ أثناء جلب الأذكار: ${errorMessage}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, categoryId, languageId, repetitions } = body;

    // التحقق من وجود جميع الحقول المطلوبة
    if (!text || !categoryId || !languageId || repetitions === undefined) {
      return NextResponse.json({ error: 'جميع الحقول (text, categoryId, languageId, repetitions) مطلوبة' }, { status: 400 });
    }

    const data = await readData();

    // التحقق من وجود التصنيف واللغة
    const categoryExists = data.categories.some(cat => cat.id === categoryId);
    const languageExists = data.languages.some(lang => lang.id === languageId);

    if (!categoryExists) {
      return NextResponse.json({ error: 'التصنيف غير موجود' }, { status: 400 });
    }

    if (!languageExists) {
      return NextResponse.json({ error: 'اللغة غير موجودة' }, { status: 400 });
    }

    const newDhikr: Dhikr = {
      id: Date.now().toString(),
      text,
      categoryId,
      languageId,
      repetitions: Number(repetitions)
    };

    // التأكد من أن data.dhikrs هو مصفوفة
    if (!Array.isArray(data.dhikrs)) {
      data.dhikrs = [];
    }

    data.dhikrs.push(newDhikr);
    await writeData(data);
    return NextResponse.json({ message: 'تمت إضافة الذكر بنجاح', dhikr: newDhikr }, { status: 201 });
  } catch (error) {
    console.error("Error adding dhikr:", error);
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير معروف';
    return NextResponse.json({ error: `حدث خطأ أثناء إضافة الذكر: ${errorMessage}` }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    console.log('Received PUT request:', { type, id });

    if (type !== 'dhikrs' || !id) {
      console.log('Invalid type or missing id');
      return NextResponse.json({ error: 'نوع غير صالح أو معرف مفقود' }, { status: 400 });
    }

    const body = await request.json();
    console.log('Request body:', body);

    const { text, categoryId, languageId, repetitions } = body;

    if (!text || !categoryId || !languageId || repetitions === undefined) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'جميع الحقول (text, categoryId, languageId, repetitions) مطلوبة' }, { status: 400 });
    }

    const data = await readData();
    const dhikrIndex = data.dhikrs.findIndex(dhikr => dhikr.id === id);

    if (dhikrIndex === -1) {
      return NextResponse.json({ error: 'الذكر غير موجود' }, { status: 404 });
    }

    data.dhikrs[dhikrIndex] = { ...data.dhikrs[dhikrIndex], text, categoryId, languageId, repetitions: Number(repetitions) };
    await writeData(data);

    return NextResponse.json({ message: 'تم تحديث الذكر بنجاح', dhikr: data.dhikrs[dhikrIndex] });
  } catch (error) {
    console.error("Error updating dhikr:", error);
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير معروف';
    return NextResponse.json({ error: `حدث خطأ أثناء تحديث الذكر: ${errorMessage}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (type !== 'dhikrs' || !id) {
      return NextResponse.json({ error: 'نوع غير صالح أو معرف مفقود' }, { status: 400 });
    }

    const data = await readData();
    const dhikrIndex = data.dhikrs.findIndex(dhikr => dhikr.id === id);

    if (dhikrIndex === -1) {
      return NextResponse.json({ error: 'الذكر غير موجود' }, { status: 404 });
    }

    data.dhikrs.splice(dhikrIndex, 1);
    await writeData(data);

    return NextResponse.json({ message: 'تم حذف الذكر بنجاح' });
  } catch (error) {
    console.error("Error deleting dhikr:", error);
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير معروف';
    return NextResponse.json({ error: `حدث خطأ أثناء حذف الذكر: ${errorMessage}` }, { status: 500 });
  }
}