"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SpeakerDashboardLayout } from "@/components/speaker-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Settings, User, Bell, Shield, CreditCard, Globe, 
  Mail, Phone, Lock, Eye, EyeOff, Check, X, 
  AlertCircle, Download, Trash2, LogOut
} from "lucide-react"

export default function AccountSettingsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("account")
  const [saveStatus, setSaveStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''})
  
  // Form states
  const [accountData, setAccountData] = useState({
    email: "noah@speakabout.ai",
    phone: "+1 (555) 123-4567",
    timezone: "America/New_York",
    language: "en"
  })
  
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  })
  
  const [notifications, setNotifications] = useState({
    emailBookingRequests: true,
    emailBookingConfirmations: true,
    emailReminders: true,
    emailNewsletter: false,
    smsBookingRequests: false,
    smsReminders: false,
    pushBookingRequests: true,
    pushReminders: true
  })
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    showRates: true,
    allowMessages: true,
    dataSharing: false
  })
  
  const [billing, setBilling] = useState({
    paymentMethod: "bank",
    bankAccount: "****1234",
    taxId: "XX-XXXXXXX",
    invoiceEmail: "noah@speakabout.ai",
    currency: "USD"
  })

  useEffect(() => {
    const token = localStorage.getItem("speakerToken")
    if (!token) {
      router.push("/portal/speaker")
    }
  }, [router])

  const handleSaveAccount = async () => {
    setIsLoading(true)
    setSaveStatus({type: null, message: ''})
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus({type: 'success', message: 'Account settings updated successfully'})
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to update account settings'})
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setSaveStatus({type: 'error', message: 'New passwords do not match'})
      return
    }
    
    setIsLoading(true)
    setSaveStatus({type: null, message: ''})
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus({type: 'success', message: 'Password changed successfully'})
      setPasswordData({ current: "", new: "", confirm: "" })
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to change password'})
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSaveNotifications = async () => {
    setIsLoading(true)
    setSaveStatus({type: null, message: ''})
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus({type: 'success', message: 'Notification preferences updated'})
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to update notifications'})
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSavePrivacy = async () => {
    setIsLoading(true)
    setSaveStatus({type: null, message: ''})
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus({type: 'success', message: 'Privacy settings updated'})
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to update privacy settings'})
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSaveBilling = async () => {
    setIsLoading(true)
    setSaveStatus({type: null, message: ''})
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSaveStatus({type: 'success', message: 'Billing information updated'})
    } catch (error) {
      setSaveStatus({type: 'error', message: 'Failed to update billing information'})
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem("speakerToken")
    localStorage.removeItem("speakerEmail")
    localStorage.removeItem("speakerId")
    localStorage.removeItem("speakerName")
    router.push("/portal/speaker")
  }
  
  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // Handle account deletion
      console.log("Account deletion requested")
    }
  }
  
  const handleExportData = () => {
    // Handle data export
    console.log("Data export requested")
  }

  return (
    <SpeakerDashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        {/* Status Alert */}
        {saveStatus.type && (
          <Alert className={`mb-6 ${saveStatus.type === 'success' ? 'border-green-500' : 'border-red-500'}`}>
            <AlertDescription className="flex items-center">
              {saveStatus.type === 'success' ? (
                <Check className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <X className="h-4 w-4 text-red-500 mr-2" />
              )}
              {saveStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 w-full mb-6 bg-white border">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={accountData.email}
                        onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={accountData.phone}
                        onChange={(e) => setAccountData({...accountData, phone: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={accountData.timezone} onValueChange={(value) => setAccountData({...accountData, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={accountData.language} onValueChange={(value) => setAccountData({...accountData, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveAccount}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      className="pl-10 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleChangePassword}
                    disabled={isLoading || !passwordData.current || !passwordData.new || !passwordData.confirm}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? "Changing..." : "Change Password"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what emails you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Booking Requests</Label>
                    <p className="text-sm text-gray-500">Get notified when you receive new booking requests</p>
                  </div>
                  <Switch
                    checked={notifications.emailBookingRequests}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailBookingRequests: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Booking Confirmations</Label>
                    <p className="text-sm text-gray-500">Receive confirmations when bookings are confirmed</p>
                  </div>
                  <Switch
                    checked={notifications.emailBookingConfirmations}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailBookingConfirmations: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Event Reminders</Label>
                    <p className="text-sm text-gray-500">Get reminders about upcoming events</p>
                  </div>
                  <Switch
                    checked={notifications.emailReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailReminders: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter</Label>
                    <p className="text-sm text-gray-500">Receive our monthly newsletter with tips and updates</p>
                  </div>
                  <Switch
                    checked={notifications.emailNewsletter}
                    onCheckedChange={(checked) => setNotifications({...notifications, emailNewsletter: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>SMS Notifications</CardTitle>
                <CardDescription>Get text messages for important updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Booking Requests</Label>
                    <p className="text-sm text-gray-500">Receive SMS for urgent booking requests</p>
                  </div>
                  <Switch
                    checked={notifications.smsBookingRequests}
                    onCheckedChange={(checked) => setNotifications({...notifications, smsBookingRequests: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Event Reminders</Label>
                    <p className="text-sm text-gray-500">Get SMS reminders 24 hours before events</p>
                  </div>
                  <Switch
                    checked={notifications.smsReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, smsReminders: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Browser notifications for real-time updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Booking Requests</Label>
                    <p className="text-sm text-gray-500">Desktop notifications for new requests</p>
                  </div>
                  <Switch
                    checked={notifications.pushBookingRequests}
                    onCheckedChange={(checked) => setNotifications({...notifications, pushBookingRequests: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Event Reminders</Label>
                    <p className="text-sm text-gray-500">Browser reminders for upcoming events</p>
                  </div>
                  <Switch
                    checked={notifications.pushReminders}
                    onCheckedChange={(checked) => setNotifications({...notifications, pushReminders: checked})}
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveNotifications}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Profile Privacy</CardTitle>
                <CardDescription>Control who can see your profile and information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={privacy.profileVisibility} onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Anyone can view</SelectItem>
                      <SelectItem value="registered">Registered Users Only</SelectItem>
                      <SelectItem value="clients">Verified Clients Only</SelectItem>
                      <SelectItem value="private">Private - By invitation only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Email Address</Label>
                    <p className="text-sm text-gray-500">Display your email on your public profile</p>
                  </div>
                  <Switch
                    checked={privacy.showEmail}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showEmail: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Phone Number</Label>
                    <p className="text-sm text-gray-500">Display your phone number on your public profile</p>
                  </div>
                  <Switch
                    checked={privacy.showPhone}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showPhone: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Speaking Rates</Label>
                    <p className="text-sm text-gray-500">Display your fee range publicly</p>
                  </div>
                  <Switch
                    checked={privacy.showRates}
                    onCheckedChange={(checked) => setPrivacy({...privacy, showRates: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Direct Messages</Label>
                    <p className="text-sm text-gray-500">Let clients message you through the platform</p>
                  </div>
                  <Switch
                    checked={privacy.allowMessages}
                    onCheckedChange={(checked) => setPrivacy({...privacy, allowMessages: checked})}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Data & Analytics</CardTitle>
                <CardDescription>Control how your data is used</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Share Usage Data</Label>
                    <p className="text-sm text-gray-500">Help us improve by sharing anonymous usage data</p>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => setPrivacy({...privacy, dataSharing: checked})}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handleExportData}
                    className="w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSavePrivacy}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? "Saving..." : "Save Privacy Settings"}
              </Button>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Manage how you receive payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={billing.paymentMethod} onValueChange={(value) => setBilling({...billing, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer (ACH)</SelectItem>
                      <SelectItem value="wire">Wire Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bank-account">Bank Account</Label>
                    <Input
                      id="bank-account"
                      type="text"
                      value={billing.bankAccount}
                      onChange={(e) => setBilling({...billing, bankAccount: e.target.value})}
                      placeholder="****1234"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID</Label>
                    <Input
                      id="tax-id"
                      type="text"
                      value={billing.taxId}
                      onChange={(e) => setBilling({...billing, taxId: e.target.value})}
                      placeholder="XX-XXXXXXX"
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-email">Invoice Email</Label>
                    <Input
                      id="invoice-email"
                      type="email"
                      value={billing.invoiceEmail}
                      onChange={(e) => setBilling({...billing, invoiceEmail: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Preferred Currency</Label>
                    <Select value={billing.currency} onValueChange={(value) => setBilling({...billing, currency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
                <CardDescription>Your earnings overview for this year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Earned</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      $125,500
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">$15,000</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Next Payout</p>
                    <p className="text-2xl font-bold text-gray-900">$8,500</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveBilling}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? "Saving..." : "Save Billing Info"}
              </Button>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">2FA is enabled</p>
                      <p className="text-sm text-gray-600">Your account is protected with two-factor authentication</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Chrome on MacOS</p>
                      <p className="text-sm text-gray-600">Current session · New York, US</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600">Active now</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Safari on iPhone</p>
                      <p className="text-sm text-gray-600">Last active 2 hours ago · New York, US</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    Revoke
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SpeakerDashboardLayout>
  )
}