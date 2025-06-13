'use client'

import { useAuthStore } from '@/app/store/auth'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
    const clearTokens = useAuthStore((s: any) => s.clearTokens)
    const router = useRouter()

    const handleLogout = () => {
        clearTokens()
        router.push('/login')
    }

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    )
}