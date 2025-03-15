"use client"
import { useState } from "react";
import { Button } from "../ui/button";
import { UserRole } from "@prisma/client";
import { signIn } from "next-auth/react";
import { setCookie } from "~/actions/cookies";

export default function Login() {
    const [role, setRole] = useState<UserRole>(UserRole.USER);
    const handleSignIn = async () => {
        await setCookie("role", role);
        await signIn();
    }
    return (
        <div
            className=" p-8 flex flex-col gap-4"
        >
            <Button onClick={handleSignIn}>Sign Up</Button>
            <div className="flex gap-4 [&_*]:border [&_*]:border-black [&_*]:px-6 [&_*]:rounded-full [&_*]:cursor-pointer w-full  justify-center">
                <div onClick={() => setRole(UserRole.USER)} className={role == UserRole.USER ? "opacity-100" : "opacity-50"}>User</div>
                <div onClick={() => setRole(UserRole.TRAINER)} className={role == UserRole.TRAINER ? "opacity-100" : "opacity-50"}>Trainer</div>
            </div>
        </div>
    )
}