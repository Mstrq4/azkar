import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'data.json');
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return NextResponse.json({ users: [] }, { status: 500 });
  }
}