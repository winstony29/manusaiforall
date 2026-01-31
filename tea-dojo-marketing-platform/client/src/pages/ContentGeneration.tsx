/**
 * Content Generation Page - BrewLab Marketing Platform
 * Design: Warm Tech Naturalism
 * Features:
 * - Thematic Campaign Workflow (preview, iterate, generate)
 * - Multi-platform content generation (TikTok, Instagram, Facebook)
 * - Prompt-based editing and regeneration
 * - Video script generation
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Sparkles, 
  Wand2, 
  Video, 
  Image as ImageIcon,
  FileText,
  RefreshCw,
  Check,
  ChevronRight,
  ChevronLeft,
  Send,
  Copy,
  Download,
  Instagram,
  Facebook,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Palette,
  Target,
  Zap,
  Upload,
  X,
  File
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Workflow steps
const workflowSteps = [
  { id: 1, title: "Define Campaign", icon: Target, description: "Set your campaign goals and target audience" },
  { id: 2, title: "Theme Preview", icon: Palette, description: "AI generates a campaign theme for approval" },
  { id: 3, title: "Generate Content", icon: Zap, description: "Create content across all platforms" },
];

// Sample generated content
const sampleContent = {
  instagram: {
    caption: "Your daily dose of freshness is here! 🍋 Our Hand-Pounded Fragrant Lemon Tea is the perfect way to beat the Singapore heat. Made with real, fresh lemons and our signature tea blend, it's a taste of pure sunshine. ☀️\n\n📍 Visit us at Ang Mo Kio\n🕐 Open daily 10am - 10pm\n\n#TeaDojoSG #FreshlyMade #LemonTea #SGBubbleTea #AngMoKio #BubbleTeaSG",
    hashtags: ["#TeaDojoSG", "#FreshlyMade", "#LemonTea", "#SGBubbleTea", "#AngMoKio"],
  },
  facebook: {
    caption: "Ever wondered what goes into our Mango Pomelo Boba? 🥭✨\n\nIt's a delightful mix of fresh mango, juicy pomelo, and of course, our signature boba! The perfect blend of tropical sweetness and chewy goodness.\n\nCome on down to Tea Dojo in Ang Mo Kio to try this fan-favorite. We're open for takeaway and delivery!\n\n🛵 Order now on GrabFood & foodpanda\n📍 Ang Mo Kio Ave 10\n\n#TeaDojo #MangoPomelo #BobaLove #SGEats #BubbleTeaTime",
    hashtags: ["#TeaDojo", "#MangoPomelo", "#BobaLove", "#SGEats", "#BubbleTeaTime"],
  },
  tiktok: {
    caption: "From 🥵 to 😎 in one sip. That's the Tea Dojo effect! 🧋✨\n\nPOV: You just discovered the best bubble tea in AMK\n\n#TeaDojoSG #Singapore #BubbleTea #Refreshment #TikTokSG #SGFood #BobaTime #FYP",
    hashtags: ["#TeaDojoSG", "#Singapore", "#BubbleTea", "#TikTokSG", "#FYP"],
  },
};

const sampleVideoScript = {
  title: "The Tea Dojo Effect",
  duration: "15-30 seconds",
  scenes: [
    { time: "0-3s", visual: "Person looking tired and hot, wiping sweat", audio: "Trending upbeat audio", text: "When it's 35°C in Singapore..." },
    { time: "3-8s", visual: "Walking into Tea Dojo store, cool AC visible", audio: "Continue music", text: "But then you remember..." },
    { time: "8-15s", visual: "Close-up of bubble tea being made, boba falling", audio: "Satisfying sounds", text: "Tea Dojo exists 🧋" },
    { time: "15-20s", visual: "First sip reaction - eyes widen, smile", audio: "Music drop", text: "That first sip hits different" },
    { time: "20-25s", visual: "Happy customer with drink, thumbs up", audio: "Music outro", text: "Tea Dojo - Ang Mo Kio" },
  ],
  callToAction: "Visit Tea Dojo today! Link in bio 🔗",
};

const sampleTheme = {
  name: "Golden Fortune CNY 2026",
  slogan: "Huat with Every Sip! 🧧",
  description: "A festive celebration featuring gold and red accents, prosperity themes, and limited-edition drinks. The campaign emphasizes togetherness, good fortune, and the joy of sharing bubble tea with loved ones during the Chinese New Year season.",
  colors: ["#C41E3A", "#FFD700", "#8B0000"],
  keyMessages: [
    "Limited-edition CNY drinks",
    "Prosperity bundle deals",
    "Festive cup designs",
    "Family sharing sets"
  ],
};

export default function ContentGeneration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [themeApproved, setThemeApproved] = useState(false);
  const [contentGenerated, setContentGenerated] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [editPrompt, setEditPrompt] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [toneOfVoice, setToneOfVoice] = useState("playful");
  const [activeTab, setActiveTab] = useState("social");
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, type: string, size: number}[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [generatedVisuals, setGeneratedVisuals] = useState<string[]>([]);
  const [isGeneratingVisuals, setIsGeneratingVisuals] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const newFiles = files.map(f => ({ name: f.name, type: f.type, size: f.size }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFiles = files.map(f => ({ name: f.name, type: f.type, size: f.size }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleGenerateTheme = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentStep(2);
    }, 2000);
  };

  const handleApproveTheme = () => {
    setThemeApproved(true);
    setCurrentStep(3);
  };

  const handleGenerateContent = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setContentGenerated(true);
    }, 2500);
  };

  const handleEditContent = () => {
    if (!editPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setEditPrompt("");
    }, 1500);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const resetWorkflow = () => {
    setCurrentStep(1);
    setThemeApproved(false);
    setContentGenerated(false);
    setCampaignGoal("");
    setTargetAudience("");
    setGeneratedVisuals([]);
  };

  const generateVisualsMutation = trpc.content.generateVisuals.useMutation();

  const handleGenerateVisuals = async () => {
    setIsGeneratingVisuals(true);
    try {
      // Generate 3 visuals for different platforms
      const platforms: ("instagram" | "facebook" | "tiktok")[] = ["instagram", "facebook", "tiktok"];
      const visualPromises = platforms.map(platform => 
        generateVisualsMutation.mutateAsync({
          theme: sampleTheme.name,
          platform,
          caption: sampleContent[platform].caption,
          colors: sampleTheme.colors,
        })
      );
      
      const results = await Promise.all(visualPromises);
      const imageUrls = results.map((r: { imageUrl: string | undefined }) => r.imageUrl).filter(Boolean) as string[];
      setGeneratedVisuals(imageUrls);
      toast.success("Visuals generated successfully!");
    } catch (error) {
      console.error("Error generating visuals:", error);
      toast.error("Failed to generate visuals. Please try again.");
    } finally {
      setIsGeneratingVisuals(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              AI Content Generation
            </h1>
            <p className="text-muted-foreground text-lg">
              Create stunning marketing content for all platforms with AI assistance
            </p>
          </div>

          {/* Workflow Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl">
              {workflowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        currentStep > step.id 
                          ? "bg-primary text-primary-foreground" 
                          : currentStep === step.id 
                            ? "bg-primary/20 text-primary border-2 border-primary" 
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`mt-2 text-sm font-medium ${
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className={`w-24 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Configuration */}
            <div className="lg:col-span-1 space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-display flex items-center gap-2">
                          <Target className="w-5 h-5 text-primary" />
                          Define Your Campaign
                        </CardTitle>
                        <CardDescription>
                          Tell us about your marketing goals
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="goal">Campaign Goal</Label>
                          <Textarea 
                            id="goal"
                            placeholder="e.g., Promote our new CNY limited-edition drinks and increase store visits during the festive season"
                            value={campaignGoal}
                            onChange={(e) => setCampaignGoal(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="audience">Target Audience</Label>
                          <Input 
                            id="audience"
                            placeholder="e.g., Young adults 18-35, bubble tea lovers in Singapore"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tone">Tone of Voice</Label>
                          <Select value={toneOfVoice} onValueChange={setToneOfVoice}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="playful">Playful & Fun</SelectItem>
                              <SelectItem value="sophisticated">Sophisticated & Premium</SelectItem>
                              <SelectItem value="informative">Informative & Educational</SelectItem>
                              <SelectItem value="energetic">Energetic & Exciting</SelectItem>
                              <SelectItem value="warm">Warm & Friendly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* File Upload Dropzone */}
                        <div className="space-y-2">
                          <Label>Reference Materials (Optional)</Label>
                          <div 
                            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                              isDragging 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            <input 
                              id="file-upload"
                              type="file"
                              multiple
                              accept="image/*,.pdf,.doc,.docx,.txt"
                              className="hidden"
                              onChange={handleFileInput}
                            />
                            <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Images, PDFs, or documents up to 10MB
                            </p>
                          </div>
                          
                          {/* Uploaded Files List */}
                          {uploadedFiles.length > 0 && (
                            <div className="space-y-2 mt-3">
                              {uploadedFiles.map((file, index) => (
                                <div 
                                  key={index} 
                                  className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    {file.type.startsWith('image/') ? (
                                      <ImageIcon className="w-4 h-4 text-primary flex-shrink-0" />
                                    ) : (
                                      <File className="w-4 h-4 text-primary flex-shrink-0" />
                                    )}
                                    <span className="text-sm truncate">{file.name}</span>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                      {formatFileSize(file.size)}
                                    </span>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeFile(index);
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90"
                          onClick={handleGenerateTheme}
                          disabled={isGenerating || !campaignGoal.trim()}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating Theme...
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4 mr-2" />
                              Generate Campaign Theme
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-display flex items-center gap-2">
                          <Palette className="w-5 h-5 text-primary" />
                          Theme Preview
                        </CardTitle>
                        <CardDescription>
                          Review and refine your campaign theme
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-secondary/50 rounded-lg">
                          <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                            {sampleTheme.name}
                          </h3>
                          <p className="text-[oklch(0.60_0.12_45)] font-medium mb-3">
                            {sampleTheme.slogan}
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            {sampleTheme.description}
                          </p>
                          <div className="flex gap-2 mb-4">
                            {sampleTheme.colors.map((color, i) => (
                              <div 
                                key={i}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Key Messages</p>
                            <ul className="text-sm space-y-1">
                              {sampleTheme.keyMessages.map((msg, i) => (
                                <li key={i} className="flex items-center gap-2">
                                  <Check className="w-3 h-3 text-primary" />
                                  {msg}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Refine Theme (Optional)</Label>
                          <Textarea 
                            placeholder="e.g., Make it more family-oriented, add more emphasis on sharing..."
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={handleRegenerate}
                            disabled={isGenerating}
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                            Regenerate
                          </Button>
                          <Button 
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={handleApproveTheme}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve Theme
                          </Button>
                        </div>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setCurrentStep(1)}
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back to Campaign Setup
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="font-display flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" />
                          Generate Content
                        </CardTitle>
                        <CardDescription>
                          Create content for all platforms
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm font-medium text-primary">Theme: {sampleTheme.name}</p>
                          <p className="text-xs text-muted-foreground">{sampleTheme.slogan}</p>
                        </div>

                        {!contentGenerated ? (
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={handleGenerateContent}
                            disabled={isGenerating}
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating All Content...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate All Content
                              </>
                            )}
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                              <Check className="w-5 h-5" />
                              <span className="font-medium">Content Generated!</span>
                            </div>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={resetWorkflow}
                            >
                              Start New Campaign
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {contentGenerated && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="font-display text-lg flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            Edit with AI
                          </CardTitle>
                          <CardDescription>
                            Refine content using natural language
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Textarea 
                            placeholder="e.g., Make the tone more playful, add a call-to-action, change the hashtags..."
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <Button 
                            className="w-full"
                            onClick={handleEditContent}
                            disabled={isGenerating || !editPrompt.trim()}
                          >
                            {isGenerating ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4 mr-2" />
                            )}
                            Apply Changes
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Panel - Content Preview */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display">Content Preview</CardTitle>
                    {contentGenerated && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy All
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                      <TabsTrigger value="social" className="gap-2">
                        <FileText className="w-4 h-4" />
                        Social Posts
                      </TabsTrigger>
                      <TabsTrigger value="video" className="gap-2">
                        <Video className="w-4 h-4" />
                        Video Script
                      </TabsTrigger>
                      <TabsTrigger value="visuals" className="gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Visuals
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="social">
                      {contentGenerated ? (
                        <div className="space-y-6">
                          {/* Platform Selector */}
                          <div className="flex gap-2">
                            <Button 
                              variant={selectedPlatform === "instagram" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedPlatform("instagram")}
                              className={selectedPlatform === "instagram" ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
                            >
                              <Instagram className="w-4 h-4 mr-2" />
                              Instagram
                            </Button>
                            <Button 
                              variant={selectedPlatform === "facebook" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedPlatform("facebook")}
                              className={selectedPlatform === "facebook" ? "bg-[#1877F2]" : ""}
                            >
                              <Facebook className="w-4 h-4 mr-2" />
                              Facebook
                            </Button>
                            <Button 
                              variant={selectedPlatform === "tiktok" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedPlatform("tiktok")}
                              className={selectedPlatform === "tiktok" ? "bg-black" : ""}
                            >
                              <TikTokIcon className="w-4 h-4 mr-2" />
                              TikTok
                            </Button>
                          </div>

                          {/* Content Display */}
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Phone Mockup */}
                            <div className="flex justify-center">
                              <div className="w-[280px] bg-black rounded-[40px] p-3 shadow-2xl">
                                <div className="bg-white rounded-[32px] overflow-hidden">
                                  {/* Phone Header */}
                                  <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {selectedPlatform === "instagram" && <Instagram className="w-5 h-5" />}
                                      {selectedPlatform === "facebook" && <Facebook className="w-5 h-5 text-[#1877F2]" />}
                                      {selectedPlatform === "tiktok" && <TikTokIcon className="w-5 h-5" />}
                                      <span className="font-semibold text-sm">teadojo</span>
                                    </div>
                                  </div>
                                  {/* Post Image */}
                                  <div className="aspect-square bg-gradient-to-br from-[#C41E3A] to-[#FFD700] flex items-center justify-center">
                                    <div className="text-center text-white p-4">
                                      <p className="font-display text-2xl font-bold mb-2">🧧</p>
                                      <p className="font-display text-lg font-bold">{sampleTheme.slogan}</p>
                                      <p className="text-sm mt-2 opacity-90">Limited Edition CNY Drinks</p>
                                    </div>
                                  </div>
                                  {/* Caption Preview */}
                                  <div className="p-3">
                                    <p className="text-xs text-gray-800 line-clamp-3">
                                      {sampleContent[selectedPlatform as keyof typeof sampleContent].caption.substring(0, 100)}...
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Full Caption */}
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium mb-2 block">Caption</Label>
                                <div className="p-4 bg-secondary/30 rounded-lg">
                                  <p className="text-sm whitespace-pre-line">
                                    {sampleContent[selectedPlatform as keyof typeof sampleContent].caption}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium mb-2 block">Hashtags</Label>
                                <div className="flex flex-wrap gap-2">
                                  {sampleContent[selectedPlatform as keyof typeof sampleContent].hashtags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Regenerate
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                            No Content Yet
                          </h3>
                          <p className="text-muted-foreground max-w-sm">
                            Complete the campaign setup and generate content to see previews here
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="video">
                      {contentGenerated ? (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-display font-semibold text-lg">{sampleVideoScript.title}</h3>
                              <p className="text-sm text-muted-foreground">Duration: {sampleVideoScript.duration}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {sampleVideoScript.scenes.map((scene, i) => (
                              <div key={i} className="p-4 bg-secondary/30 rounded-lg border-l-4 border-primary">
                                <div className="flex items-start justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">{scene.time}</Badge>
                                  <span className="text-xs text-muted-foreground">{scene.audio}</span>
                                </div>
                                <p className="text-sm font-medium text-foreground mb-1">{scene.visual}</p>
                                <p className="text-sm text-primary font-medium">"{scene.text}"</p>
                              </div>
                            ))}
                          </div>

                          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <p className="text-sm font-medium text-primary">Call to Action</p>
                            <p className="text-sm text-foreground">{sampleVideoScript.callToAction}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Video className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                            No Video Script Yet
                          </h3>
                          <p className="text-muted-foreground max-w-sm">
                            Generate content to see video scripts for TikTok and Reels
                          </p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="visuals">
                      {contentGenerated ? (
                        <div className="space-y-6">
                          <p className="text-sm text-muted-foreground">
                            AI-generated visuals based on your campaign theme
                          </p>
                          {generatedVisuals.length > 0 ? (
                            <>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {generatedVisuals.map((imageUrl, i) => (
                                  <div key={i} className="aspect-square rounded-lg border border-border overflow-hidden group cursor-pointer hover:border-primary transition-colors">
                                    <img 
                                      src={imageUrl} 
                                      alt={`Generated visual ${i + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                              <Button 
                                className="w-full" 
                                variant="outline"
                                onClick={handleGenerateVisuals}
                                disabled={isGeneratingVisuals}
                              >
                                {isGeneratingVisuals ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate More Visuals
                                  </>
                                )}
                              </Button>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                <ImageIcon className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                                Ready to Generate Visuals
                              </h3>
                              <p className="text-muted-foreground max-w-sm mb-4">
                                Click below to create AI-powered visuals for your campaign
                              </p>
                              <Button 
                                onClick={handleGenerateVisuals}
                                disabled={isGeneratingVisuals}
                                className="bg-primary hover:bg-primary/90"
                              >
                                {isGeneratingVisuals ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating Visuals...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Visuals
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                            No Visuals Yet
                          </h3>
                          <p className="text-muted-foreground max-w-sm">
                            Generate content to create AI-powered visuals for your campaign
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
