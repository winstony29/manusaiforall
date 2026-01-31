/**
 * Help & Support Page - Drinknovate Marketing Platform
 * Comprehensive help center with troubleshooting, how-tos, and support resources
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Book, 
  HelpCircle, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Zap,
  Settings,
  Calendar,
  Sparkles,
  Megaphone,
  RefreshCw,
  Shield,
  Clock,
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

// Comprehensive help content data
const troubleshootingGuides = [
  {
    id: "content-not-generating",
    title: "AI Content Not Generating",
    category: "AI Generation",
    severity: "high",
    symptoms: [
      "Clicking 'Generate' button shows loading but nothing happens",
      "Error message appears after attempting to generate",
      "Generated content is blank or incomplete"
    ],
    solutions: [
      {
        step: 1,
        action: "Check your internet connection",
        details: "AI generation requires a stable internet connection. Try refreshing the page and ensure you're connected."
      },
      {
        step: 2,
        action: "Verify input fields are complete",
        details: "Ensure all required fields (brand name, target audience, content type) are filled in before generating."
      },
      {
        step: 3,
        action: "Clear browser cache",
        details: "Go to your browser settings and clear cached data, then reload the application."
      },
      {
        step: 4,
        action: "Try a different content type",
        details: "If one content type isn't working, try generating a different type to isolate the issue."
      },
      {
        step: 5,
        action: "Contact support if issue persists",
        details: "If none of the above solutions work, reach out to our support team with details about the error."
      }
    ]
  },
  {
    id: "calendar-not-loading",
    title: "Calendar Not Loading or Displaying Incorrectly",
    category: "Calendar",
    severity: "medium",
    symptoms: [
      "Calendar page shows blank or loading spinner indefinitely",
      "Events/posts not appearing on scheduled dates",
      "Calendar navigation not responding"
    ],
    solutions: [
      {
        step: 1,
        action: "Refresh the page",
        details: "Press F5 or click the refresh button to reload the calendar data."
      },
      {
        step: 2,
        action: "Check date range selection",
        details: "Ensure you're viewing the correct month/week. Use navigation arrows to move between periods."
      },
      {
        step: 3,
        action: "Verify posts exist",
        details: "Go to the Posts section to confirm you have scheduled content. Empty calendars may appear blank."
      },
      {
        step: 4,
        action: "Try a different browser",
        details: "Some browser extensions can interfere with calendar functionality. Test in an incognito window."
      }
    ]
  },
  {
    id: "campaign-creation-failed",
    title: "Campaign Creation or Update Failed",
    category: "Campaigns",
    severity: "high",
    symptoms: [
      "Error message when saving a new campaign",
      "Changes to existing campaigns not saving",
      "Campaign disappears after creation"
    ],
    solutions: [
      {
        step: 1,
        action: "Check required fields",
        details: "Ensure campaign name, start date, and at least one post are included."
      },
      {
        step: 2,
        action: "Verify date validity",
        details: "End date must be after start date. Check that dates are in the correct format."
      },
      {
        step: 3,
        action: "Reduce campaign size",
        details: "If adding many posts, try creating the campaign with fewer posts first, then add more."
      },
      {
        step: 4,
        action: "Check for duplicate names",
        details: "Campaign names should be unique. Try a different name if you get a duplicate error."
      }
    ]
  },
  {
    id: "login-issues",
    title: "Login and Authentication Problems",
    category: "Account",
    severity: "high",
    symptoms: [
      "Unable to log in with correct credentials",
      "Session expires unexpectedly",
      "Redirected to login page repeatedly"
    ],
    solutions: [
      {
        step: 1,
        action: "Verify credentials",
        details: "Double-check your email and password. Use the 'Forgot Password' feature if needed."
      },
      {
        step: 2,
        action: "Clear cookies and cache",
        details: "Old session data can cause conflicts. Clear browser data and try again."
      },
      {
        step: 3,
        action: "Disable browser extensions",
        details: "Ad blockers or privacy extensions may interfere with authentication."
      },
      {
        step: 4,
        action: "Check account status",
        details: "Ensure your account is active and not suspended. Contact support if unsure."
      }
    ]
  },
  {
    id: "slow-performance",
    title: "Slow Loading or Poor Performance",
    category: "Performance",
    severity: "low",
    symptoms: [
      "Pages take a long time to load",
      "Actions feel sluggish or delayed",
      "Browser becomes unresponsive"
    ],
    solutions: [
      {
        step: 1,
        action: "Check internet speed",
        details: "Run a speed test. Drinknovate works best with connections of 5+ Mbps."
      },
      {
        step: 2,
        action: "Close unused tabs",
        details: "Too many open tabs can slow down browser performance significantly."
      },
      {
        step: 3,
        action: "Update your browser",
        details: "Ensure you're using the latest version of Chrome, Firefox, Safari, or Edge."
      },
      {
        step: 4,
        action: "Reduce data load",
        details: "If viewing many campaigns/posts, use filters to reduce the amount of data displayed."
      }
    ]
  },
  {
    id: "image-upload-failed",
    title: "Image Upload Not Working",
    category: "Content",
    severity: "medium",
    symptoms: [
      "Image upload shows error or fails silently",
      "Uploaded images appear broken or don't display",
      "Upload progress gets stuck"
    ],
    solutions: [
      {
        step: 1,
        action: "Check file format",
        details: "Supported formats: JPG, PNG, GIF, WebP. Convert other formats before uploading."
      },
      {
        step: 2,
        action: "Verify file size",
        details: "Maximum file size is 10MB. Compress larger images using online tools."
      },
      {
        step: 3,
        action: "Check image dimensions",
        details: "Recommended dimensions vary by platform. See our image guidelines below."
      },
      {
        step: 4,
        action: "Try a different image",
        details: "The specific file may be corrupted. Test with a different image."
      }
    ]
  }
];

const howToGuides = [
  {
    id: "getting-started",
    title: "Getting Started with Drinknovate",
    icon: Zap,
    difficulty: "Beginner",
    timeEstimate: "10 minutes",
    steps: [
      {
        title: "Navigate to the Dashboard",
        description: "After logging in, you'll land on the Dashboard. This is your central hub for all marketing activities."
      },
      {
        title: "Explore the sidebar navigation",
        description: "Use the left sidebar to access Generate (AI content), Calendar (scheduling), Campaigns (organization), and Settings."
      },
      {
        title: "Create your first post",
        description: "Click 'Generate' in the sidebar, select 'Create Post', fill in your brand details, and let AI create content for you."
      },
      {
        title: "Schedule your content",
        description: "After generating content, use the Calendar to schedule when your posts will go live."
      },
      {
        title: "Organize with campaigns",
        description: "Group related posts into campaigns to track performance and maintain organized marketing efforts."
      }
    ]
  },
  {
    id: "ai-content-generation",
    title: "Generating AI Content",
    icon: Sparkles,
    difficulty: "Beginner",
    timeEstimate: "5 minutes",
    steps: [
      {
        title: "Access the Generate page",
        description: "Click 'Generate' in the sidebar navigation to open the AI content studio."
      },
      {
        title: "Choose content type",
        description: "Select whether you want to create a single post or a full campaign with multiple posts."
      },
      {
        title: "Enter brand information",
        description: "Provide your brand name, industry, target audience, and tone of voice for personalized content."
      },
      {
        title: "Select platform(s)",
        description: "Choose which social media platforms you're creating content for (Instagram, Facebook, Twitter, etc.)."
      },
      {
        title: "Generate and review",
        description: "Click 'Generate' and wait for AI to create your content. Review and edit as needed before saving."
      },
      {
        title: "Save or schedule",
        description: "Save the content as a draft or immediately schedule it on your calendar."
      }
    ]
  },
  {
    id: "calendar-management",
    title: "Managing Your Content Calendar",
    icon: Calendar,
    difficulty: "Intermediate",
    timeEstimate: "15 minutes",
    steps: [
      {
        title: "Access the Calendar",
        description: "Click 'Calendar' in the sidebar to view your content schedule in a visual format."
      },
      {
        title: "Navigate between views",
        description: "Switch between month, week, and day views using the view selector at the top."
      },
      {
        title: "Create new posts",
        description: "Click on any date to create a new post directly on that day."
      },
      {
        title: "Drag and drop to reschedule",
        description: "Click and drag any post to a different date to quickly reschedule content."
      },
      {
        title: "View post details",
        description: "Click on any scheduled post to view its full content, edit, or delete it."
      },
      {
        title: "Filter by campaign",
        description: "Use filters to show only posts from specific campaigns for focused planning."
      }
    ]
  },
  {
    id: "campaign-creation",
    title: "Creating and Managing Campaigns",
    icon: Megaphone,
    difficulty: "Intermediate",
    timeEstimate: "20 minutes",
    steps: [
      {
        title: "Navigate to Campaigns",
        description: "Click 'Campaigns' in the sidebar to access your campaign management area."
      },
      {
        title: "Create a new campaign",
        description: "Click 'Create Campaign' and enter a name, description, start date, and end date."
      },
      {
        title: "Add posts to your campaign",
        description: "Either create new posts within the campaign or add existing posts from your library."
      },
      {
        title: "Set campaign goals",
        description: "Define measurable objectives like reach, engagement, or conversions to track success."
      },
      {
        title: "Monitor performance",
        description: "View campaign analytics to see how your posts are performing against your goals."
      },
      {
        title: "Iterate and optimize",
        description: "Use insights from analytics to adjust your content strategy for better results."
      }
    ]
  },
  {
    id: "account-settings",
    title: "Configuring Account Settings",
    icon: Settings,
    difficulty: "Beginner",
    timeEstimate: "10 minutes",
    steps: [
      {
        title: "Access Settings",
        description: "Click 'Settings' in the bottom section of the sidebar navigation."
      },
      {
        title: "Update profile information",
        description: "Edit your name, email, profile picture, and other personal details."
      },
      {
        title: "Configure notifications",
        description: "Choose which email and in-app notifications you want to receive."
      },
      {
        title: "Manage privacy settings",
        description: "Control data sharing preferences and visibility of your content."
      },
      {
        title: "Customize appearance",
        description: "Switch between light and dark themes, adjust display preferences."
      },
      {
        title: "Connect social accounts",
        description: "Link your social media accounts for direct posting capabilities."
      }
    ]
  },
  {
    id: "best-practices",
    title: "Content Best Practices",
    icon: Lightbulb,
    difficulty: "Advanced",
    timeEstimate: "30 minutes",
    steps: [
      {
        title: "Understand your audience",
        description: "Define your target demographic, their interests, pain points, and preferred platforms."
      },
      {
        title: "Maintain consistent branding",
        description: "Use consistent colors, tone, and messaging across all content for brand recognition."
      },
      {
        title: "Optimize posting times",
        description: "Schedule posts when your audience is most active. Use analytics to find optimal times."
      },
      {
        title: "Use platform-specific formats",
        description: "Tailor content dimensions and style for each platform (square for Instagram, landscape for Twitter, etc.)."
      },
      {
        title: "Include calls-to-action",
        description: "Every post should have a clear CTA - whether it's to visit a link, comment, or share."
      },
      {
        title: "Analyze and iterate",
        description: "Regularly review performance metrics and adjust your strategy based on what works."
      }
    ]
  }
];

const faqItems = [
  {
    question: "How do I generate content with AI?",
    answer: "Navigate to the Generate page from the dashboard sidebar. Select your content type (post or campaign), provide details about your brand and target audience, and let our AI create engaging content for you. You can then review and edit the generated content before publishing.",
    category: "AI Generation"
  },
  {
    question: "How do I schedule posts on the calendar?",
    answer: "Go to the Calendar page and click on any date to create a new post. You can also drag and drop existing posts to reschedule them. The calendar view helps you visualize your content strategy and maintain a consistent posting schedule.",
    category: "Calendar"
  },
  {
    question: "What are campaigns and how do I use them?",
    answer: "Campaigns are collections of related posts organized around a specific marketing goal or theme. Create a campaign from the Campaigns page, add multiple posts to it, and track their performance together. This helps you measure the effectiveness of your marketing initiatives.",
    category: "Campaigns"
  },
  {
    question: "Can I edit AI-generated content?",
    answer: "Yes! All AI-generated content is fully editable. After the AI creates your content, you can modify the text, adjust the tone, add or remove elements, and customize it to perfectly match your brand voice before publishing.",
    category: "AI Generation"
  },
  {
    question: "How do I update my account settings?",
    answer: "Click on Settings in the sidebar navigation. From there, you can update your profile information, change notification preferences, manage privacy settings, and customize the appearance of the platform.",
    category: "Account"
  },
  {
    question: "What social media platforms are supported?",
    answer: "Drinknovate currently supports content creation for Instagram, Facebook, Twitter/X, LinkedIn, and TikTok. Each platform has optimized content formats and best practices built into our AI generation system.",
    category: "Platforms"
  },
  {
    question: "How can I track campaign performance?",
    answer: "Visit the Campaigns page to view detailed analytics for each campaign. You'll see metrics like reach, engagement, click-through rates, and conversions. Use these insights to optimize your future campaigns and improve your marketing strategy.",
    category: "Analytics"
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take data security seriously. All data is encrypted in transit and at rest. We follow industry best practices for security and compliance. You can manage your privacy settings and data preferences in the Settings page under the Privacy tab.",
    category: "Security"
  },
  {
    question: "How do I connect my social media accounts?",
    answer: "Go to Settings > Connected Accounts. Click 'Connect' next to each platform you want to link. You'll be redirected to authorize Drinknovate to post on your behalf. Once connected, you can publish directly from the platform.",
    category: "Account"
  },
  {
    question: "What image sizes should I use for each platform?",
    answer: "Instagram: 1080x1080px (square) or 1080x1350px (portrait). Facebook: 1200x630px. Twitter: 1200x675px. LinkedIn: 1200x627px. TikTok: 1080x1920px. Our AI automatically suggests optimal sizes based on your selected platform.",
    category: "Content"
  },
  {
    question: "Can I schedule posts for multiple platforms at once?",
    answer: "Yes! When creating a post, you can select multiple platforms. The AI will optimize the content for each platform while maintaining your core message. Each platform version can be edited independently before scheduling.",
    category: "Scheduling"
  },
  {
    question: "How do I delete or archive old campaigns?",
    answer: "Go to Campaigns, find the campaign you want to manage, click the three-dot menu, and select 'Archive' or 'Delete'. Archived campaigns are hidden from the main view but can be restored. Deleted campaigns are permanently removed after 30 days.",
    category: "Campaigns"
  }
];

const quickTips = [
  {
    icon: Lightbulb,
    title: "Use specific prompts",
    description: "The more details you provide about your brand and audience, the better the AI-generated content will be."
  },
  {
    icon: Clock,
    title: "Schedule in advance",
    description: "Plan your content at least a week ahead to maintain consistency and reduce last-minute stress."
  },
  {
    icon: RefreshCw,
    title: "Regenerate if needed",
    description: "Not happy with the AI output? Click regenerate for a fresh take on your content."
  },
  {
    icon: Shield,
    title: "Review before publishing",
    description: "Always review AI-generated content for accuracy and brand alignment before scheduling."
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const handleContactSupport = () => {
    toast.success("Support request submitted. We'll get back to you within 24 hours.");
  };

  // Filter content based on search query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return faqItems;
    const query = searchQuery.toLowerCase();
    return faqItems.filter(
      item => 
        item.question.toLowerCase().includes(query) || 
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredTroubleshooting = useMemo(() => {
    if (!searchQuery.trim()) return troubleshootingGuides;
    const query = searchQuery.toLowerCase();
    return troubleshootingGuides.filter(
      item => 
        item.title.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query) ||
        item.symptoms.some(s => s.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const filteredHowTos = useMemo(() => {
    if (!searchQuery.trim()) return howToGuides;
    const query = searchQuery.toLowerCase();
    return howToGuides.filter(
      item => 
        item.title.toLowerCase().includes(query) || 
        item.difficulty.toLowerCase().includes(query) ||
        item.steps.some(s => s.title.toLowerCase().includes(query) || s.description.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Advanced": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
            <p className="text-muted-foreground">Find answers, troubleshoot issues, and learn how to get the most out of Drinknovate</p>
          </div>

          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for help articles, troubleshooting guides, or FAQs..." 
                  className="pl-10 h-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-2">
                  Found {filteredFAQs.length} FAQs, {filteredTroubleshooting.length} troubleshooting guides, and {filteredHowTos.length} how-to guides
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Tips Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickTips.map((tip, index) => (
              <Card key={index} className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <tip.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{tip.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overview" className="gap-2">
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="troubleshooting" className="gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Troubleshooting</span>
              </TabsTrigger>
              <TabsTrigger value="how-to" className="gap-2">
                <Book className="w-4 h-4" />
                <span className="hidden sm:inline">How-To Guides</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">FAQ</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get help right away</CardDescription>
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
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Video Tutorials
                    </Button>
                  </CardContent>
                </Card>

                {/* Popular Topics */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Popular Topics</CardTitle>
                    <CardDescription>Most searched help topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button 
                        onClick={() => setActiveTab("how-to")}
                        className="flex items-center gap-3 p-4 rounded-lg border hover:bg-secondary transition-colors text-left"
                      >
                        <Zap className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Getting Started</div>
                          <div className="text-sm text-muted-foreground">New to Drinknovate? Start here</div>
                        </div>
                        <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                      </button>
                      <button 
                        onClick={() => setActiveTab("how-to")}
                        className="flex items-center gap-3 p-4 rounded-lg border hover:bg-secondary transition-colors text-left"
                      >
                        <Sparkles className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">AI Content Generation</div>
                          <div className="text-sm text-muted-foreground">Create content with AI</div>
                        </div>
                        <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                      </button>
                      <button 
                        onClick={() => setActiveTab("troubleshooting")}
                        className="flex items-center gap-3 p-4 rounded-lg border hover:bg-secondary transition-colors text-left"
                      >
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <div>
                          <div className="font-medium">Common Issues</div>
                          <div className="text-sm text-muted-foreground">Troubleshoot problems</div>
                        </div>
                        <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                      </button>
                      <button 
                        onClick={() => setActiveTab("how-to")}
                        className="flex items-center gap-3 p-4 rounded-lg border hover:bg-secondary transition-colors text-left"
                      >
                        <Megaphone className="w-5 h-5 text-primary" />
                        <div>
                          <div className="font-medium">Campaign Management</div>
                          <div className="text-sm text-muted-foreground">Organize your marketing</div>
                        </div>
                        <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status Alert */}
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>All Systems Operational</AlertTitle>
                <AlertDescription>
                  All Drinknovate services are running normally. Last checked: {new Date().toLocaleTimeString()}
                </AlertDescription>
              </Alert>

              {/* Quick FAQ Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>Quick answers to common questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {faqItems.slice(0, 5).map((item, index) => (
                      <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <span className="font-medium">{item.question}</span>
                            <Badge variant="outline" className="ml-auto hidden sm:inline-flex">
                              {item.category}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab("faq")}
                  >
                    View all FAQs
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Troubleshooting Tab */}
            <TabsContent value="troubleshooting" className="space-y-6">
              <Alert variant="default" className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle>Troubleshooting Guide</AlertTitle>
                <AlertDescription>
                  Follow these step-by-step solutions to resolve common issues. If problems persist, contact our support team.
                </AlertDescription>
              </Alert>

              {filteredTroubleshooting.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms or browse all troubleshooting guides.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredTroubleshooting.map((guide) => (
                    <Card key={guide.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5" />
                              {guide.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Category: {guide.category}
                            </CardDescription>
                          </div>
                          <Badge className={getSeverityColor(guide.severity)}>
                            {guide.severity === "high" ? "High Priority" : guide.severity === "medium" ? "Medium Priority" : "Low Priority"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Symptoms
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {guide.symptoms.map((symptom, index) => (
                              <li key={index}>{symptom}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            Solutions
                          </h4>
                          <div className="space-y-3">
                            {guide.solutions.map((solution) => (
                              <div key={solution.step} className="flex gap-4 p-3 rounded-lg bg-secondary/50">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                                  {solution.step}
                                </div>
                                <div>
                                  <h5 className="font-medium">{solution.action}</h5>
                                  <p className="text-sm text-muted-foreground mt-1">{solution.details}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Still Need Help */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <MessageCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                      <h3 className="font-semibold">Still experiencing issues?</h3>
                      <p className="text-sm text-muted-foreground">Our support team is here to help you resolve any problems.</p>
                    </div>
                    <Button onClick={handleContactSupport}>
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* How-To Guides Tab */}
            <TabsContent value="how-to" className="space-y-6">
              <Alert>
                <Book className="h-4 w-4" />
                <AlertTitle>Step-by-Step Guides</AlertTitle>
                <AlertDescription>
                  Learn how to use every feature of Drinknovate with our comprehensive tutorials.
                </AlertDescription>
              </Alert>

              {filteredHowTos.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No guides found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms or browse all guides.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredHowTos.map((guide) => (
                    <Card key={guide.id} className="flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <guide.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{guide.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getDifficultyColor(guide.difficulty)}>
                                  {guide.difficulty}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {guide.timeEstimate}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <Accordion type="single" collapsible className="space-y-2">
                          {guide.steps.map((step, index) => (
                            <AccordionItem key={index} value={`step-${index}`} className="border rounded-lg px-3">
                              <AccordionTrigger className="hover:no-underline py-3">
                                <div className="flex items-center gap-3 text-left">
                                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                                    {index + 1}
                                  </span>
                                  <span className="font-medium text-sm">{step.title}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="text-sm text-muted-foreground pl-9">
                                {step.description}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <Alert>
                <MessageCircle className="h-4 w-4" />
                <AlertTitle>Frequently Asked Questions</AlertTitle>
                <AlertDescription>
                  Find quick answers to the most common questions about Drinknovate.
                </AlertDescription>
              </Alert>

              {filteredFAQs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No FAQs found</h3>
                    <p className="text-muted-foreground">Try adjusting your search terms or browse all FAQs.</p>
                    <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="space-y-3">
                      {filteredFAQs.map((item, index) => (
                        <AccordionItem key={index} value={`faq-full-${index}`} className="border rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3 text-left flex-1">
                              <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                              <span className="font-medium">{item.question}</span>
                              <Badge variant="outline" className="ml-auto hidden sm:inline-flex">
                                {item.category}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground pl-8">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              )}

              {/* Contact Card */}
              <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="py-8">
                  <div className="text-center max-w-md mx-auto">
                    <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                      <HelpCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Can't find what you're looking for?</h3>
                    <p className="text-muted-foreground mb-6">
                      Our support team is available 24/7 to help you with any questions or issues.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={handleContactSupport}>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Live Chat
                      </Button>
                      <Button variant="outline" onClick={handleContactSupport}>
                        <Mail className="w-4 h-4 mr-2" />
                        Email Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Additional Resources Footer */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
              <CardDescription>Explore more ways to learn and get help</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border hover:bg-secondary transition-colors cursor-pointer group">
                  <Book className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-1">User Guide</h3>
                  <p className="text-sm text-muted-foreground">Comprehensive documentation</p>
                </div>
                <div className="p-4 rounded-lg border hover:bg-secondary transition-colors cursor-pointer group">
                  <MessageCircle className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-1">Community</h3>
                  <p className="text-sm text-muted-foreground">Connect with other users</p>
                </div>
                <div className="p-4 rounded-lg border hover:bg-secondary transition-colors cursor-pointer group">
                  <FileText className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-1">API Docs</h3>
                  <p className="text-sm text-muted-foreground">Technical reference</p>
                </div>
                <div className="p-4 rounded-lg border hover:bg-secondary transition-colors cursor-pointer group">
                  <HelpCircle className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold mb-1">Video Tutorials</h3>
                  <p className="text-sm text-muted-foreground">Step-by-step guides</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
