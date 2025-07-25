import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'


const CustomerLogin = () => {
    const [showPassword, setShowPassword] = useState(false)
    const { login, loading } = useAuth()
    async function handleSubmit(formData: FormData) {

        const email = formData.get("email") as string
        const password = formData.get("password") as string
        try {
            const result = await login(email, password)

            if (result?.user && result.jwt) {
                // router.push("/my-account")
                toast.success("Login successful")
            } else {
                toast.error("login failed")
            }
        } catch (err) {
            console.log(err)
            toast.error("Login failed")
        }
    }

    return (
        <div>
            <h4 className='text-center mt-6 mb-6 text-xl'>Login to your account</h4>
            <div className='p-4 border shadow-sm shadow-gray-100 rounded-md'>
                <form action={handleSubmit} className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <Label>
                            Email
                        </Label>
                        <Input
                            type="email"
                            name="email"
                            required
                            placeholder='Enter your email address'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label>
                            Password
                        </Label>
                        <div className='relative'>
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                placeholder='Enter your email address'
                                className=''
                            />
                            <div className='absolute right-4 top-2 cursor-pointer text-gray-600' onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff /> : <Eye />}
                            </div>

                        </div>
                    </div>
                    <Button className=''>Login</Button>
                </form>
            </div>
        </div>
    )
}

export default CustomerLogin