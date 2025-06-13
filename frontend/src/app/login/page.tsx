'use client'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/store/auth'
import { useApi } from '../api/useApi'

export default function LoginPage() {
    const login = useAuthStore((s: any) => s.login)
    const api = useApi("AUTH");
    const router = useRouter()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const email = form.email.value
        const password = form.password.value
        await api.post("/auth/login", { email, password })
        login()
        router.push('/')
    }

    return (
        <form onSubmit={onSubmit}>
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    )
}