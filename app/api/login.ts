// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs/promises'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'data.json')

interface User {
  username: string
  password: string
}

async function readData() {
  const fileContent = await fs.readFile(dataFilePath, 'utf-8')
  return JSON.parse(fileContent)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { username, password } = req.body

  try {
    const data = await readData()
    const users: User[] = data.users || []

    const user = users.find(u => u.username === username && u.password === password)

    if (user) {
      // في الإنتاج، يجب استخدام طريقة أكثر أمانًا لإدارة الجلسات
      res.status(200).json({ message: 'تم تسجيل الدخول بنجاح' })
    } else {
      res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' })
    }
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' })
  }
}