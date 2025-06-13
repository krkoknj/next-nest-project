'use client';

import Link from "next/link";
import LogoutButton from "./Logout";
import { useAuthStore } from "../store/auth";

export default function Navbar() {

    const isLoggedIn = useAuthStore((s: any) => s.isLoggedIn);

    return (<nav>
        <ul>
            <li>
                <Link href="/">Home</Link>
            </li>
            {isLoggedIn ? <>
                <li>
                    <LogoutButton />
                </li>
                <li>
                    <Link href="/mypage/profile">Profile</Link>
                </li>
            </> : <>
                <li>
                    <Link href="/login">Login</Link>
                </li>
                <li>
                    <Link href="/signup">Sign Up</Link>
                </li>
            </>}
            <li>
                <Link href="/boards">Boards</Link>
            </li>
        </ul>
    </nav>)
}