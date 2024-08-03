// app/api/getDhikr/route.ts

import { NextResponse } from 'next/server';

const dhikrData = {
  'morning': {
    title: 'أذكار الصباح - Morning Adhkar',
    dhikrs: [
      {
        id: '1',
        arabicText: 'أَعُوذُ بِاللهِ مِنْ الشَّيْطَانِ الرَّجِيمِ',
        englishText: 'I seek refuge in Allah from Satan, the accursed.',
        category: 'الاستعاذة - Seeking Refuge'
      },
      {
        id: '2',
        arabicText: 'بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ',
        englishText: 'In the name of Allah, the Most Gracious, the Most Merciful.',
        category: 'البسملة - Basmalah'
      },
      // يمكنك إضافة المزيد من الأذكار هنا
    ]
  },
  // يمكنك إضافة المزيد من الفئات هنا (مثل أذكار المساء، أذكار النوم، إلخ)
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id || !dhikrData[id as keyof typeof dhikrData]) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  return NextResponse.json(dhikrData[id as keyof typeof dhikrData]);
}