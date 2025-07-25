"use client"

import { useState, useActionState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth-context"
import React from "react"
import { useRouter } from "next/navigation"
export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const [isSignup, setIsSignup] = useState(false)
    const { login, loading } = useAuth()
    const router = useRouter()
    //   const [loginState, loginFormAction, loginPending] = useActionState(loginAction, null)
    //   const [signupState, signupFormAction, signupPending] = useActionState(signupAction, null)

    const signupAction = async (formData: FormData) => {
        const email = formData.get("email") as string
        const password = formData.get("password") as string
    }

    const loginAction = async (formData: FormData) => {

        const email = formData.get("email") as string
        const password = formData.get("password") as string
        try {
            const result = await login(email, password)

            if (result?.user && result.jwt) {
                router.push("/my-account")
                toast.success("Login successful")
            } else {
                toast.error("login failed")
            }
        } catch (err) {
            console.log(err)
            toast.error("Login failed")
        }
    }

    if (isSignup) {
        return (
            <div className="min-h-[60vh] px-4 mt-10 mb-10">
                <Card className="w-full max-w-xl mx-auto border border-gray-200 shadow-sm">
                    <CardContent className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create your account</h1>
                            <p className="text-gray-600">Fill in your details to get started</p>
                        </div>

                        <form action={signupAction} className="space-y-6">
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            className="h-12 bg-gray-50 border-gray-200 focus:bg-white pr-10"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 text-gray-500" />
                                            ) : (
                                                <Eye className="w-4 h-4 text-gray-500" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
                            >
                                Sign Up
                            </Button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => setIsSignup(false)}
                                    className="text-black hover:underline font-medium"
                                >
                                    Login here
                                </button>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-[60vh] px-4 mt-10">
            <Card className="w-full mx-auto max-w-md border border-gray-200 shadow-sm">
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Login to your account</h1>
                    </div>

                    <form action={loginAction} className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="text"
                                placeholder="Enter your email"
                                className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="h-12 bg-gray-50 border-gray-200 focus:bg-white pr-10"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <Eye className="w-4 h-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
                        >
                            Login
                        </Button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                onClick={() => setIsSignup(true)}
                                className="text-black hover:underline font-medium"
                            >
                                Sign up here
                            </button>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
