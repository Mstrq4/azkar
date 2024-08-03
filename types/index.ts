// types/index.ts

export interface Category {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface Dhikr {
  id: string;
  text: string;
  categoryId: string;
  languageId: string;
  translation?: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}