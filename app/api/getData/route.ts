import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), 'data');
    const fileContents = await fs.readFile(path.join(dataDirectory, 'data.json'), 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
  }
}