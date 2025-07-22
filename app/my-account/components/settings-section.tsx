"use client"

import { useState } from "react"
import { Lock, LogOut, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/mock-api"

export function SettingsSection() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [changing, setChanging] = useState(false)
  const { toast } = useToast()

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    try {
      setChanging(true)
      await api.changePassword(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast({
        title: "Success",
        description: "Password changed successfully",
      })
    } catch (error) {
      console.error("Failed to change password:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setChanging(false)
    }
  }

  const handleLogout = () => {
    // Handle logout logic here
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Settings</h2>
        <p className="text-slate-600 mt-1">Manage your account settings and security</p>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-slate-600" />
            <div>
              <CardTitle className="text-lg font-medium">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-sm font-medium text-slate-700">
              Current Password
            </Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border-slate-200 focus:border-slate-300"
              placeholder="Enter your current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-sm font-medium text-slate-700">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-slate-200 focus:border-slate-300"
              placeholder="Enter your new password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-sm font-medium text-slate-700">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-slate-200 focus:border-slate-300"
              placeholder="Confirm your new password"
            />
          </div>
          <div className="pt-2">
            <Button
              onClick={handleChangePassword}
              disabled={changing || !currentPassword || !newPassword || !confirmPassword}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {changing ? "Changing..." : "Change Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-600" />
            <div>
              <CardTitle className="text-lg font-medium">Account Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 p-4 border border-slate-200 rounded-lg sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline" size="sm" className="border-slate-200 bg-transparent w-full sm:w-auto">
                Enable
              </Button>
            </div>
            <div className="flex flex-col gap-3 p-4 border border-slate-200 rounded-lg sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-slate-900">Login Notifications</p>
                <p className="text-sm text-slate-600">Get notified when someone logs into your account</p>
              </div>
              <Button variant="outline" size="sm" className="border-slate-200 bg-transparent w-full sm:w-auto">
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-red-600" />
            <div>
              <CardTitle className="text-lg font-medium text-red-900">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 p-4 border border-red-200 rounded-lg bg-red-50 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-red-900">Log Out</p>
                <p className="text-sm text-red-700">Sign out of your account on this device</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
