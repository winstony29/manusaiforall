import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  Check,
  Image,
  Video,
  Square,
  RectangleVertical,
  RectangleHorizontal,
  MessageSquare,
  Loader2,
  Copy,
  Download,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Instagram icon component
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

// Facebook icon component
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

type Platform = 'tiktok' | 'instagram' | 'facebook';
type InstagramFormat = 'square' | 'portrait' | 'landscape' | 'story' | 'reel';
type ContentType = 'image' | 'video';

interface FormatOption {
  id: string;
  platform: Platform;
  format?: InstagramFormat;
  contentType: ContentType;
  label: string;
  description: string;
  aspectRatio: string;
  icon: React.ReactNode;
}

const formatOptions: FormatOption[] = [
  {
    id: 'tiktok-video',
    platform: 'tiktok',
    contentType: 'video',
    label: 'TikTok Video',
    description: 'Vertical video for TikTok',
    aspectRatio: '9:16',
    icon: <TikTokIcon className="w-5 h-5" />
  },
  {
    id: 'instagram-square',
    platform: 'instagram',
    format: 'square',
    contentType: 'image',
    label: 'Instagram Square Post',
    description: 'Classic square image post',
    aspectRatio: '1:1',
    icon: <Square className="w-5 h-5" />
  },
  {
    id: 'instagram-portrait',
    platform: 'instagram',
    format: 'portrait',
    contentType: 'image',
    label: 'Instagram Portrait Post',
    description: 'Vertical image post',
    aspectRatio: '4:5',
    icon: <RectangleVertical className="w-5 h-5" />
  },
  {
    id: 'instagram-landscape',
    platform: 'instagram',
    format: 'landscape',
    contentType: 'image',
    label: 'Instagram Landscape Post',
    description: 'Horizontal image post',
    aspectRatio: '1.91:1',
    icon: <RectangleHorizontal className="w-5 h-5" />
  },
  {
    id: 'instagram-story',
    platform: 'instagram',
    format: 'story',
    contentType: 'image',
    label: 'Instagram Story',
    description: 'Full-screen vertical story',
    aspectRatio: '9:16',
    icon: <RectangleVertical className="w-5 h-5" />
  },
  {
    id: 'instagram-reel',
    platform: 'instagram',
    format: 'reel',
    contentType: 'video',
    label: 'Instagram Reel',
    description: 'Vertical video reel',
    aspectRatio: '9:16',
    icon: <Video className="w-5 h-5" />
  },
  {
    id: 'facebook-post',
    platform: 'facebook',
    contentType: 'image',
    label: 'Facebook Post',
    description: 'Standard Facebook image post',
    aspectRatio: '1.91:1',
    icon: <FacebookIcon className="w-5 h-5" />
  },
  {
    id: 'facebook-video',
    platform: 'facebook',
    contentType: 'video',
    label: 'Facebook Video',
    description: 'Video post for Facebook',
    aspectRatio: '16:9',
    icon: <Video className="w-5 h-5" />
  }
];

const steps = [
  { id: 1, title: 'Select Format' },
  { id: 2, title: 'Add Details' },
  { id: 3, title: 'Generate' }
];

export default function CreatePost() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [generateCaption, setGenerateCaption] = useState(true);
  const [postDescription, setPostDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    caption: string;
    hashtags: string[];
    imagePrompt?: string;
    videoScript?: string;
  } | null>(null);

  const selectedFormatData = formatOptions.find(f => f.id === selectedFormat);

  const handleGenerateContent = async () => {
    if (!selectedFormatData) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: selectedFormatData,
          description: postDescription,
          targetAudience,
          generateCaption
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate content');
      
      const data = await response.json();
      setGeneratedContent(data);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      // Generate mock content for demo
      setGeneratedContent({
        caption: `✨ ${postDescription || 'Check out our latest creation!'} \n\nPerfect for ${targetAudience || 'everyone'}! 🎉`,
        hashtags: ['#drinknovate', '#bubletea', '#singapore', '#foodie', '#drinks'],
        imagePrompt: selectedFormatData.contentType === 'image' 
          ? `A vibrant, eye-catching ${selectedFormatData.aspectRatio} image featuring bubble tea drinks with modern aesthetic, bright colors, and appetizing presentation`
          : undefined,
        videoScript: selectedFormatData.contentType === 'video'
          ? `Scene 1: Opening shot of colorful bubble tea drinks\nScene 2: Close-up of toppings being added\nScene 3: Happy customer enjoying the drink\nScene 4: Brand logo with call to action`
          : undefined
      });
      toast.success('Content generated successfully!');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        {/* Header */}
        <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/generate">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">D</span>
                </div>
                <span className="font-display font-semibold text-lg">Create Post</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Powered
              </span>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className="border-b bg-background/50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep > step.id 
                        ? 'bg-primary text-primary-foreground' 
                        : currentStep === step.id 
                          ? 'bg-primary/20 text-primary border-2 border-primary' 
                          : 'bg-secondary text-muted-foreground'
                    }`}>
                      {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 md:w-12 h-0.5 mx-2 ${currentStep > step.id ? 'bg-primary' : 'bg-secondary'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Format */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-semibold mb-2">Select Post Format</h2>
                  <p className="text-muted-foreground">Choose the platform and format for your post</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formatOptions.map((format) => (
                    <Card 
                      key={format.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedFormat === format.id 
                          ? 'border-2 border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedFormat(format.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            format.platform === 'tiktok' ? 'bg-black text-white' :
                            format.platform === 'instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {format.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{format.label}</h3>
                              {selectedFormat === format.id && (
                                <Check className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{format.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs bg-secondary px-2 py-0.5 rounded">{format.aspectRatio}</span>
                              <span className="text-xs bg-secondary px-2 py-0.5 rounded capitalize">{format.contentType}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end mt-8">
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedFormat}
                    className="gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Add Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-semibold mb-2">Add Post Details</h2>
                  <p className="text-muted-foreground">Tell us about your post</p>
                </div>

                <Card>
                  <CardContent className="p-6 space-y-6">
                    {/* Selected Format Display */}
                    {selectedFormatData && (
                      <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedFormatData.platform === 'tiktok' ? 'bg-black text-white' :
                          selectedFormatData.platform === 'instagram' ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' :
                          'bg-blue-600 text-white'
                        }`}>
                          {selectedFormatData.icon}
                        </div>
                        <div>
                          <p className="font-medium">{selectedFormatData.label}</p>
                          <p className="text-sm text-muted-foreground">{selectedFormatData.aspectRatio} • {selectedFormatData.contentType}</p>
                        </div>
                      </div>
                    )}

                    {/* Post Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">What is this post about?</Label>
                      <Textarea
                        id="description"
                        placeholder="e.g., Promoting our new summer mango bubble tea collection"
                        value={postDescription}
                        onChange={(e) => setPostDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    {/* Target Audience */}
                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience (optional)</Label>
                      <Input
                        id="audience"
                        placeholder="e.g., Young adults 18-35, bubble tea lovers"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                      />
                    </div>

                    {/* Generate Caption Toggle */}
                    <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Generate Caption</p>
                          <p className="text-sm text-muted-foreground">AI will create a caption with hashtags</p>
                        </div>
                      </div>
                      <Switch
                        checked={generateCaption}
                        onCheckedChange={setGenerateCaption}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={() => {
                      setCurrentStep(3);
                      handleGenerateContent();
                    }}
                    disabled={!postDescription}
                    className="gap-2"
                  >
                    Generate Content
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Generated Content */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-3xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-semibold mb-2">Your Generated Content</h2>
                  <p className="text-muted-foreground">Review and customize your post</p>
                </div>

                {isGenerating ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-lg font-medium">Generating your content...</p>
                      <p className="text-muted-foreground">This may take a few seconds</p>
                    </CardContent>
                  </Card>
                ) : generatedContent ? (
                  <div className="space-y-6">
                    {/* Caption */}
                    {generateCaption && (
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Caption</CardTitle>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(generatedContent.caption)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap">{generatedContent.caption}</p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {generatedContent.hashtags.map((tag, i) => (
                              <span key={i} className="text-sm text-primary bg-primary/10 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Image Prompt */}
                    {generatedContent.imagePrompt && (
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Image className="w-5 h-5" />
                              Image Prompt
                            </CardTitle>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(generatedContent.imagePrompt!)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{generatedContent.imagePrompt}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Video Script */}
                    {generatedContent.videoScript && (
                      <Card>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Video className="w-5 h-5" />
                              Video Script
                            </CardTitle>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => copyToClipboard(generatedContent.videoScript!)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap text-muted-foreground">{generatedContent.videoScript}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={handleGenerateContent} className="gap-2">
                          <RefreshCw className="w-4 h-4" />
                          Regenerate
                        </Button>
                        <Button className="gap-2">
                          <Download className="w-4 h-4" />
                          Save Post
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </DashboardLayout>
  );
}
