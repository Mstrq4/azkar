'use client'

import { useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import UserItem from "./Useritem"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface HeaderProps {
    onLogout: () => void;
  }

  export const Sidebar : React.FC<HeaderProps> = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <>
            <Button 
                className="fixed top-4 right-4 z-50 md:hidden" 
                onClick={toggleSidebar}
            >
                <Menu />
            </Button>
            <div className={`
                fixed top-0 right-0 z-40 
                w-[250px] p-4 border-l h-full bg-background
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                md:translate-x-0
            `}>
                <div className="flex flex-col h-full gap-4">
                    <div>
                        <Link href="/">
                            <img className="absolute rotate-90 w-[200px] scale-0 transition-all dark:rotate-0 dark:scale-100" src="/Azkar1.svg" alt="logo" />
                            <img className="rotate-0 w-[200px] scale-100 transition-all dark:-rotate-90 dark:scale-0" src="/Azkar.svg" alt="logo" />
                        </Link>
                    </div>
                    <div className="grow">
                        <Command className="h-[calc(100vh-200px)] overflow-y-auto text-xl">
                            <CommandList>
                                <CommandGroup heading="الإضافة">
                                    <Link href="/dashbord">
                                        <CommandItem className="flex gap-2 cursor-pointer">لوحة التحكم</CommandItem>
                                    </Link>
                                    <Link href="/dashbord/morning">
                                        <CommandItem className="flex gap-2 cursor-pointer">الأذكار</CommandItem>
                                    </Link>
                                    <Link href="/dashbord/Faile">
                                        <CommandItem className="flex gap-2 cursor-pointer">ملفات pdf</CommandItem>
                                    </Link>
                                    <CommandItem className="flex gap-2 cursor-pointer">أذكار الصلاة</CommandItem>
                                </CommandGroup>
                                <CommandSeparator />
                                <CommandGroup heading="الإعدادات">
                                    <Link href="/dashbord/langueg">
                                        <CommandItem className="flex gap-2 cursor-pointer">اللغات </CommandItem>
                                    </Link>
                                    <Link href="/dashbord/categories">
                                        <CommandItem className="flex gap-2 cursor-pointer">التصنيفات</CommandItem>
                                    </Link>
                                    <CommandItem className="flex gap-2 cursor-pointer">الإعدادت</CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </div>
                    <Button onClick={onLogout} variant="outline">تسجيل الخروج</Button>
                </div>
            </div>
        </>
    )
}
