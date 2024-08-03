'use client'

import { Button } from "@/components/ui/button"
import UserItem from "./Useritem"
import { CommandDemo } from "./componed"
import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/Navbar"

export default function Header() {
    const { setTheme, theme } = useTheme()

    return (
        <div dir="ltr" className="flex gap-4 p-1 justify-start border-b ">
            <UserItem />
            <ThemeToggle />
        </div>
    )}

    