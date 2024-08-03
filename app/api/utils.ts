// api/utils.ts
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'data.json');

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image?: string; // تم تغييرها لتكون سلسلة نصية فقط
}

export interface PDFFile {
  id: string;
  name: string;
  languageId: string;
  categoryId: string;
  url: string;
  imageUrl: string;
}

export interface Dhikr {
  id: string;
  text: string;
  categoryId: string;
  languageId: string;
  repetitions: number;
}

export interface Data {
  languages: Language[];
  categories: Category[];
  pdfFiles: PDFFile[];
  dhikrs: Dhikr[];
}

export async function readData(): Promise<Data> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return {
      languages: Array.isArray(data.languages) ? data.languages : [],
      categories: Array.isArray(data.categories) ? data.categories : [],
      pdfFiles: Array.isArray(data.pdfFiles) ? data.pdfFiles : [],
      dhikrs: Array.isArray(data.dhikrs) ? data.dhikrs : []
    };
  } catch (error) {
    console.error("Error reading file:", error);
    return { languages: [], categories: [], pdfFiles: [], dhikrs: [] };
  }
}

export async function writeData(data: Data): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

// Helper function to delete image
async function deleteImage(imagePath: string | undefined): Promise<void> {
  if (!imagePath) {
    console.warn('No image path provided for deletion');
    return;
  }
  const fullPath = path.join(process.cwd(), 'public', imagePath);
  try {
    await fs.unlink(fullPath);
  } catch (error) {
    console.error(`Error deleting image at ${fullPath}:`, error);
  }
}

// Helper function to delete file
async function deleteFile(filePath: string | undefined): Promise<void> {
  if (!filePath) {
    console.warn('No file path provided for deletion');
    return;
  }
  const fullPath = path.join(process.cwd(), 'public', filePath);
  try {
    await fs.unlink(fullPath);
  } catch (error) {
    console.error(`Error deleting file at ${fullPath}:`, error);
  }
}

// Category functions
export async function getCategories(): Promise<Category[]> {
  const data = await readData();
  return data.categories;
}

export async function addCategory(newCategory: Omit<Category, 'id'>): Promise<Category> {
  const data = await readData();
  const category: Category = {
    ...newCategory,
    id: Date.now().toString(),
  };
  data.categories.push(category);
  await writeData(data);
  return category;
}

export async function updateCategory(id: string, updateData: Partial<Category>): Promise<void> {
  const data = await readData();
  const index = data.categories.findIndex(cat => cat.id === id);
  if (index !== -1) {
    if (updateData.image && data.categories[index].image && updateData.image !== data.categories[index].image) {
      await deleteImage(data.categories[index].image);
    }
    data.categories[index] = { ...data.categories[index], ...updateData };
    await writeData(data);
  } else {
    console.error(`Category with id ${id} not found`);
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  const data = await readData();
  const categoryToDelete = data.categories.find(cat => cat.id === id);
  
  if (!categoryToDelete) {
    console.error(`Category with id ${id} not found`);
    return false;
  }

  try {
    if (categoryToDelete.image) {
      await deleteImage(categoryToDelete.image);
    }
    data.categories = data.categories.filter(cat => cat.id !== id);
    await writeData(data);
    return true;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    return false;
  }
}

// PDF File functions
export async function getPDFFiles(): Promise<PDFFile[]> {
  const data = await readData();
  return data.pdfFiles;
}

export async function addPDFFile(newFile: PDFFile): Promise<void> {
  const data = await readData();
  data.pdfFiles.push(newFile);
  await writeData(data);
}

export async function updatePDFFile(id: string, updateData: Partial<PDFFile>): Promise<void> {
  const data = await readData();
  const index = data.pdfFiles.findIndex(file => file.id === id);
  if (index !== -1) {
    data.pdfFiles[index] = { ...data.pdfFiles[index], ...updateData };
    await writeData(data);
  } else {
    console.error(`PDF file with id ${id} not found`);
  }
}

export async function deletePDFFile(id: string): Promise<boolean> {
  const data = await readData();
  const fileToDelete = data.pdfFiles.find(file => file.id === id);
  
  if (!fileToDelete) {
    console.error(`PDF file with id ${id} not found`);
    return false;
  }

  try {
    await deleteFile(fileToDelete.url);
    await deleteImage(fileToDelete.imageUrl);
    data.pdfFiles = data.pdfFiles.filter(file => file.id !== id);
    await writeData(data);
    return true;
  } catch (error) {
    console.error(`Error deleting files for id ${id}:`, error);
    return false;
  }
}

// Dhikr functions
export async function getDhikrs(): Promise<Dhikr[]> {
  const data = await readData();
  return data.dhikrs;
}

export async function addDhikr(newDhikr: Dhikr): Promise<void> {
  const data = await readData();
  data.dhikrs.push(newDhikr);
  await writeData(data);
}

export async function updateDhikr(id: string, updateData: Partial<Dhikr>): Promise<void> {
  const data = await readData();
  const index = data.dhikrs.findIndex(dhikr => dhikr.id === id);
  if (index !== -1) {
    data.dhikrs[index] = { ...data.dhikrs[index], ...updateData };
    await writeData(data);
  } else {
    console.error(`Dhikr with id ${id} not found`);
  }
}

export async function deleteDhikr(id: string): Promise<boolean> {
  const data = await readData();
  const initialLength = data.dhikrs.length;
  data.dhikrs = data.dhikrs.filter(dhikr => dhikr.id !== id);
  if (data.dhikrs.length < initialLength) {
    await writeData(data);
    return true;
  }
  return false;
}