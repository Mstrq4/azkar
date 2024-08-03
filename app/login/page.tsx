'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeLanguageProvider } from '@/components/ThemeLanguageProvider';
import { cookies } from 'next/headers';

interface User {
  name: string;
  username: string;
  password: string;
}

interface InitialData {
  users: User[];
}

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = Cookies.get('isLoggedIn') === 'true'
    if (isLoggedIn) {
      router.push('/dashbord')
    }
  }, [router])

  return <LoginForm />
}

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [initialData, setInitialData] = useState<InitialData>({ users: [] })
  const router = useRouter()

  useEffect(() => {
    fetch('/api/users')
      .then(response => response.json())
      .then(data => setInitialData(data))
      .catch(error => console.error('Error fetching users:', error))
  }, [])

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const user = initialData.users.find(u => u.username === username && u.password === password)
    if (user) {
      Cookies.set('user', JSON.stringify({ username: user.username }), { expires: 7 })
      Cookies.set('isLoggedIn', 'true', { expires: 7 })
      setMessage('تم تسجيل الدخول بنجاح!')
      setTimeout(() => {
        router.push('/dashbord')
      }, 1000)
    } else {
      setMessage('فشل تسجيل الدخول. يرجى التحقق من اسم المستخدم وكلمة المرور.')
    }
  }

  return (
    <ThemeLanguageProvider>
    <div dir='rtl' className="flex justify-center items-center min-h-screen ">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>تسجيل الدخول</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <Button className="w-full mt-4" type="submit">تسجيل الدخول</Button>
          </form>
          {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        </CardContent>
      </Card>
    </div>
    </ThemeLanguageProvider>
  )
}