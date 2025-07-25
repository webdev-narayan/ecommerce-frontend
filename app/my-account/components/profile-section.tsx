"use client"

import { useState, useEffect } from "react"
import { Edit3, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { User } from "@/lib/types/auth"
import { mediaUrlGenerator } from "@/lib/utils"
import { putApi } from "@/lib/api"
import { toast } from "sonner"

export function ProfileSection() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const { user: userData, loading, refreshUser } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    if (userData) {
      setUser(userData)
      setFormData({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
      })
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const updatedUser = await putApi<{ data: User }>(`/user/${userData?.documentId}`, formData, true)
    if (updatedUser.data?.data) {
      refreshUser()
    }
    setIsEditing(false)
    toast("Profile updated successfully")
    setSaving(false)
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-64"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-600">Failed to load profile information</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Profile</h2>
        <p className="text-slate-600 mt-1">Manage your personal information</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              disabled={saving}
              className="border-slate-200"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="relative self-center sm:self-start">
              <Avatar className="h-20 w-20 border-2 border-slate-200">
                <AvatarImage src={mediaUrlGenerator(user.profile?.url)} className="object-cover object-top" />
                <AvatarFallback className="bg-slate-100 text-slate-700 text-lg">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 border-slate-200 bg-transparent"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              )}
            </div>
            {isEditing && (
              <div className="text-center sm:text-left">
                <Button variant="outline" size="sm" className="border-slate-200 bg-transparent">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG up to 2MB</p>
              </div>
            )}
          </div> */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="border-slate-200 focus:border-slate-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="border-slate-200 focus:border-slate-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                Phone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="border-slate-200 focus:border-slate-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                Username
              </Label>
              <Input id="username" value={user.username} disabled className="border-slate-200 bg-slate-50" />
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 sm:flex-row sm:gap-3">
              <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="border-slate-200 bg-transparent w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}