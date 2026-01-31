/**
 * Settings Page - BrewLab Marketing Platform
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, Palette, User, Mail, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSave = (section: string) => {
    toast.success(`${section} settings saved successfully`);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and configuration</p>
          </div>

          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account">
                <User className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Lock className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Tea Dojo" />
                  </div>
                  <Button onClick={() => handleSave('Profile')}>Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security
                  </CardTitle>
                  <CardDescription>Manage your password and authentication methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button onClick={() => handleSave('Password')} variant="outline">Update Password</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified about updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="email-notif" className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates and alerts via email</p>
                    </div>
                    <Switch 
                      id="email-notif" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="push-notif" className="text-base font-medium">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Get real-time notifications on your device</p>
                    </div>
                    <Switch 
                      id="push-notif"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="marketing" className="text-base font-medium">Marketing Communications</Label>
                      <p className="text-sm text-muted-foreground">Receive news, tips, and special offers</p>
                    </div>
                    <Switch id="marketing" />
                  </div>
                  <Button onClick={() => handleSave('Notifications')}>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Control your data and account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="2fa" className="text-base font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Two-Factor Authentication
                      </Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      id="2fa"
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="data-collection" className="text-base font-medium">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">Allow us to collect usage data to improve our service</p>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>
                  <Button onClick={() => handleSave('Privacy')} variant="outline">Update Privacy Settings</Button>
                </CardContent>
              </Card>

              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions that affect your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="destructive" onClick={() => toast.error('Account deletion is not available in this demo')}>
                    Delete Account
                  </Button>
                  <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance Preferences
                  </CardTitle>
                  <CardDescription>Customize how the interface looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Theme</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="p-4 rounded-lg border-2 border-primary bg-primary/10 text-left">
                        <div className="font-medium">Light (Current)</div>
                        <p className="text-sm text-muted-foreground mt-1">Clean and bright interface</p>
                      </button>
                      <button className="p-4 rounded-lg border text-left hover:bg-secondary">
                        <div className="font-medium">Dark</div>
                        <p className="text-sm text-muted-foreground mt-1">Easy on the eyes</p>
                      </button>
                      <button className="p-4 rounded-lg border text-left hover:bg-secondary">
                        <div className="font-medium">Auto</div>
                        <p className="text-sm text-muted-foreground mt-1">Match system</p>
                      </button>
                    </div>
                  </div>
                  <Button onClick={() => handleSave('Appearance')}>Apply Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
