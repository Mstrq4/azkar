import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function GET() {
  try {
    // قراءة الملف
    const filePath = path.join(process.cwd(), 'data', 'data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    // تشفير البيانات
    const secretKey = process.env.SECRET_KEY || 'defaultSecretKey';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(JSON.stringify(data));
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // إرجاع البيانات المشفرة
    return NextResponse.json({
      data: encrypted.toString('hex'),
      iv: iv.toString('hex')
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}