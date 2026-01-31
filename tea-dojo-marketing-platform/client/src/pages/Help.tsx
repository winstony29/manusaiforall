/**
 * Help & Support Page - BrewLab Marketing Platform
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, MessageCircle, Mail, Book, HelpCircle, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleContactSupport = () => {
    toast.success("Support request submitted. We'll get back to you within 24 hours.");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
            <p className="text-muted-foreground">Find answers, guides, and get assistance</p>
          </div>

          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for help articles, guides, or FAQs..." 
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start"
                    onClick={handleContactSupport}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleContactSupport}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Book className="w-4 h-4 mr-2" />
                    Documentation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Topics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="text-sm font-medium">Getting Started</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="text-sm font-medium">AI Content Generation</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="text-sm font-medium">Campaign Management</div>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors">
                    <div className="text-sm font-medium">Billing & Payments</div>
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Main FAQ Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>Find quick answers to common questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-3">
                    <AccordionItem value="item-1" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left font-medium">How do I generate content with AI?</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Navigate to the Generate page from the dashboard sidebar. Select your content type (post or campaign), provide details about your brand and target audience, and let our AI create engaging content for you. You can then review and edit the generated content before publishing.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left font-medium">How do I schedule posts on the calendar?</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Go to the Calendar page and click on any date to create a new post. You can also drag and drop existing posts to reschedule them. The calendar view helps you visualize your content strategy and maintain a consistent posting schedule.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left font-medium">What are campaigns and how do I use them?</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Campaigns are collections of related posts organized around a specific marketing goal or theme. Create a campaign from the Campaigns page, add multiple posts to it, and track their performance together. This helps you measure the effectiveness of your marketing initiatives.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left font-medium">Can I edit AI-generated content?</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Yes! All AI-generated content is fully editable. After the AI creates your content, you can modify the text, adjust the tone, add or remove elements, and customize it to perfectly match your brand voice before publishing.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left font-medium">How do I update my account settings?</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Click on Settings in the sidebar navigation. From there, you can update your profile information, change notification preferences, manage privacy settings, and customize the appearance of the platform.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left font-medium">What social media platforms are supported?</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        BrewLab currently supports content creation for Instagram, Facebook, Twitter/X, LinkedIn, and TikTok. Each platform has optimized content formats and best practices built into our AI generation system.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-7" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left font-medium">How can I track campaign performance?</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Visit the Campaigns page to view detailed analytics for each campaign. You'll see metrics like reach, engagement, click-through rates, and conversions. Use these insights to optimize your future campaigns and improve your marketing strategy.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-8" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="text-left font-medium">Is my data secure?</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        Yes, we take data security seriously. All data is encrypted in transit and at rest. We follow industry best practices for security and compliance. You can manage your privacy settings and data preferences in the Settings page under the Privacy tab.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Additional Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Resources</CardTitle>
                  <CardDescription>Explore more ways to get help</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border hover:bg-secondary transition-colors cursor-pointer">
                      <Book className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">User Guide</h3>
                      <p className="text-sm text-muted-foreground">Comprehensive documentation</p>
                    </div>
                    <div className="p-4 rounded-lg border hover:bg-secondary transition-colors cursor-pointer">
                      <MessageCircle className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">Community</h3>
                      <p className="text-sm text-muted-foreground">Connect with other users</p>
                    </div>
                    <div className="p-4 rounded-lg border hover:bg-secondary transition-colors cursor-pointer">
                      <FileText className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">API Docs</h3>
                      <p className="text-sm text-muted-foreground">Technical reference</p>
                    </div>
                    <div className="p-4 rounded-lg border hover:bg-secondary transition-colors cursor-pointer">
                      <HelpCircle className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-1">Video Tutorials</h3>
                      <p className="text-sm text-muted-foreground">Step-by-step guides</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
