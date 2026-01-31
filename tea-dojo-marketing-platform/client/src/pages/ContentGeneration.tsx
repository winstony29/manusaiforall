/**
 * Content Generation Page - Drinknovate Marketing Platform
 * Design: Warm Tech Naturalism
 * Features:
 * - Thematic Campaign Workflow (preview, iterate, generate)
 * - Multi-platform content generation (TikTok, Instagram, Facebook)
 * - Prompt-based editing and regeneration
 * - Video script generation
 * - LLM-powered content generation
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
  File,
  AlertCircle,
  Pencil
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { toast } from "sonner";
// Using native HTML color input instead of react-colorful for better compatibility

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

// Types for generated content
interface Theme {
  name: string;
  slogan: string;
  description: string;
  colors: string[];
  colorPalettes: string[][];
  selectedPaletteIndex: number;
  paletteNames?: string[];
  keyMessages: string[];
}

interface SocialContent {
  instagram: {
    caption: string;
    hashtags: string[];
  };
  facebook: {
    caption: string;
    hashtags: string[];
  };
  tiktok: {
    caption: string;
    hashtags: string[];
  };
}

interface VideoScript {
  title: string;
  duration: string;
  scenes: Array<{
    time: string;
    visual: string;
    audio: string;
    text: string;
  }>;
  callToAction: string;
}

// Default empty theme
const emptyTheme: Theme = {
  name: "",
  slogan: "",
  description: "",
  colors: [],
  colorPalettes: [],
  selectedPaletteIndex: 0,
  paletteNames: ['Classic', 'Modern', 'Soft'],
  keyMessages: [],
};

// Default empty content
const emptyContent: SocialContent = {
  instagram: { caption: "", hashtags: [] },
  facebook: { caption: "", hashtags: [] },
  tiktok: { caption: "", hashtags: [] },
};

const emptyVideoScript: VideoScript = {
  title: "",
  duration: "",
  scenes: [],
  callToAction: "",
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
  const [refinementPrompt, setRefinementPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // Color picker state
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);
  const [editingPaletteIndex, setEditingPaletteIndex] = useState<number | null>(null);
  const [tempColor, setTempColor] = useState("#000000");

  // Generated content state
  const [generatedTheme, setGeneratedTheme] = useState<Theme>(emptyTheme);
  const [generatedContent, setGeneratedContent] = useState<SocialContent>(emptyContent);
  const [generatedVideoScript, setGeneratedVideoScript] = useState<VideoScript>(emptyVideoScript);

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

  const handleGenerateTheme = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignGoal,
          targetAudience,
          toneOfVoice,
        }),
      });

      const data = await response.json();

      if (data.success && data.theme) {
        // Ensure theme has proper structure with colorPalettes
        const theme = {
          ...data.theme,
          colorPalettes: data.theme.colorPalettes || [data.theme.colors || []],
          colors: data.theme.colorPalettes?.[0] || data.theme.colors || [],
          selectedPaletteIndex: 0,
          paletteNames: data.theme.paletteNames || ['Classic', 'Modern', 'Soft'],
        };
        setGeneratedTheme(theme);
        setCurrentStep(2);
        toast.success("Theme generated successfully!");
      } else {
        throw new Error(data.error || 'Failed to generate theme');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate theme';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveTheme = () => {
    setThemeApproved(true);
    setCurrentStep(3);
  };

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme: generatedTheme,
          campaignGoal,
          targetAudience,
          toneOfVoice,
        }),
      });

      const data = await response.json();

      if (data.success && data.content) {
        setGeneratedContent(data.content.social);
        setGeneratedVideoScript(data.content.video);
        setContentGenerated(true);
        toast.success("Content generated successfully!");
      } else {
        throw new Error(data.error || 'Failed to generate content');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditContent = async () => {
    if (!editPrompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/edit-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentContent: generatedContent,
          editPrompt,
          platform: selectedPlatform,
        }),
      });

      const data = await response.json();

      if (data.success && data.content) {
        setGeneratedContent(data.content);
        setEditPrompt("");
        toast.success("Content updated successfully!");
      } else {
        throw new Error(data.error || 'Failed to edit content');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to edit content';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/regenerate-theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentTheme: generatedTheme,
          refinementPrompt,
          campaignGoal,
          targetAudience,
          toneOfVoice,
        }),
      });

      const data = await response.json();

      if (data.success && data.theme) {
        // Ensure theme has proper structure with colorPalettes
        const theme = {
          ...data.theme,
          colorPalettes: data.theme.colorPalettes || [data.theme.colors || []],
          colors: data.theme.colorPalettes?.[0] || data.theme.colors || [],
          selectedPaletteIndex: 0,
          paletteNames: data.theme.paletteNames || ['Classic', 'Modern', 'Soft'],
        };
        setGeneratedTheme(theme);
        setRefinementPrompt("");
        toast.success("Theme regenerated successfully!");
      } else {
        throw new Error(data.error || 'Failed to regenerate theme');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate theme';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Select a different color palette option
  const selectPalette = (index: number) => {
    if (generatedTheme.colorPalettes && generatedTheme.colorPalettes[index]) {
      setGeneratedTheme({
        ...generatedTheme,
        colors: generatedTheme.colorPalettes[index],
        selectedPaletteIndex: index,
      });
      toast.success(`Selected ${generatedTheme.paletteNames?.[index] || `Palette ${index + 1}`}`);
    }
  };

  // Open color picker for a specific color
  const openColorPicker = (paletteIndex: number, colorIndex: number, currentColor: string) => {
    setEditingPaletteIndex(paletteIndex);
    setEditingColorIndex(colorIndex);
    setTempColor(currentColor);
    setColorPickerOpen(true);
  };

  // Apply the edited color
  const applyColorChange = () => {
    if (editingPaletteIndex === null || editingColorIndex === null) return;
    
    const newColorPalettes = [...generatedTheme.colorPalettes];
    newColorPalettes[editingPaletteIndex] = [...newColorPalettes[editingPaletteIndex]];
    newColorPalettes[editingPaletteIndex][editingColorIndex] = tempColor;
    
    // Also update the active colors if this is the selected palette
    const newColors = editingPaletteIndex === generatedTheme.selectedPaletteIndex
      ? newColorPalettes[editingPaletteIndex]
      : generatedTheme.colors;
    
    setGeneratedTheme({
      ...generatedTheme,
      colorPalettes: newColorPalettes,
      colors: newColors,
    });
    
    setColorPickerOpen(false);
    setEditingColorIndex(null);
    setEditingPaletteIndex(null);
    toast.success("Color updated!");
  };

  // Cancel color editing
  const cancelColorEdit = () => {
    setColorPickerOpen(false);
    setEditingColorIndex(null);
    setEditingPaletteIndex(null);
  };

  // Regenerate only the color palettes
  const handleRegeneratePalette = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/regenerate-palette', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeName: generatedTheme.name,
          themeDescription: generatedTheme.description,
          campaignGoal,
        }),
      });

      const data = await response.json();

      if (data.success && data.colorPalettes) {
        setGeneratedTheme({
          ...generatedTheme,
          colorPalettes: data.colorPalettes,
          colors: data.colorPalettes[0],
          selectedPaletteIndex: 0,
          paletteNames: data.paletteNames || ['Classic', 'Modern', 'Soft'],
        });
        toast.success("New color palettes generated!");
      } else {
        throw new Error(data.error || 'Failed to regenerate palettes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate palettes';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateContent = async () => {
    await handleGenerateContent();
  };

  const resetWorkflow = () => {
    setCurrentStep(1);
    setThemeApproved(false);
    setContentGenerated(false);
    setCampaignGoal("");
    setTargetAudience("");
    setGeneratedTheme(emptyTheme);
    setGeneratedContent(emptyContent);
    setGeneratedVideoScript(emptyVideoScript);
    setError(null);
  };

  // Go to a specific step (only allow going back to completed steps)
  const goToStep = (stepId: number) => {
    if (stepId < currentStep) {
      // Going back - reset states appropriately
      if (stepId === 1) {
        // Going back to step 1 - keep the form data but reset theme and content
        setThemeApproved(false);
        setContentGenerated(false);
        setGeneratedTheme(emptyTheme);
        setGeneratedContent(emptyContent);
        setGeneratedVideoScript(emptyVideoScript);
      } else if (stepId === 2) {
        // Going back to step 2 - keep theme but reset content
        setThemeApproved(false);
        setContentGenerated(false);
        setGeneratedContent(emptyContent);
        setGeneratedVideoScript(emptyVideoScript);
      }
      setCurrentStep(stepId);
      setError(null);
    }
  };

  // Go back one step
  const goBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const copyAllContent = () => {
    const allContent = `
Instagram:
${generatedContent.instagram.caption}
${generatedContent.instagram.hashtags.join(' ')}

Facebook:
${generatedContent.facebook.caption}
${generatedContent.facebook.hashtags.join(' ')}

TikTok:
${generatedContent.tiktok.caption}
${generatedContent.tiktok.hashtags.join(' ')}

Video Script - ${generatedVideoScript.title}
Duration: ${generatedVideoScript.duration}
${generatedVideoScript.scenes.map(s => `${s.time}: ${s.visual} | ${s.text}`).join('\n')}
CTA: ${generatedVideoScript.callToAction}
    `.trim();
    
    navigator.clipboard.writeText(allContent);
    toast.success("All content copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">D</span>
              </div>
              <span className="font-display font-semibold text-lg text-foreground">Content Studio</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/5">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16">
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

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Error</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}

          {/* Workflow Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-0 max-w-2xl mx-auto">
              {workflowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={() => goToStep(step.id)}
                      disabled={step.id >= currentStep}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        currentStep > step.id 
                          ? "bg-primary text-primary-foreground cursor-pointer hover:bg-primary/80 hover:scale-105" 
                          : currentStep === step.id 
                            ? "bg-primary/20 text-primary border-2 border-primary cursor-default" 
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                      title={currentStep > step.id ? `Go back to ${step.title}` : ''}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </button>
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

          <div className={`grid gap-8 ${contentGenerated ? 'lg:grid-cols-3' : 'lg:grid-cols-1 max-w-3xl mx-auto'}`}>
            {/* Left Panel - Configuration (Full width when no content, 1/3 when content exists) */}
            <div className={`${contentGenerated ? 'lg:col-span-1' : ''} space-y-6`}>
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
                        <div className="space-y-3">
                          <Label>Tone of Voice</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'playful', label: 'Playful & Fun', emoji: '🎉' },
                              { value: 'sophisticated', label: 'Sophisticated & Premium', emoji: '✨' },
                              { value: 'informative', label: 'Informative & Educational', emoji: '📚' },
                              { value: 'energetic', label: 'Energetic & Exciting', emoji: '⚡' },
                              { value: 'warm', label: 'Warm & Friendly', emoji: '🤗' },
                            ].map((tone) => (
                              <label
                                key={tone.value}
                                className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  toneOfVoice === tone.value
                                    ? 'border-primary bg-primary/10 shadow-sm'
                                    : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="toneOfVoice"
                                  value={tone.value}
                                  checked={toneOfVoice === tone.value}
                                  onChange={(e) => setToneOfVoice(e.target.value)}
                                  className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  toneOfVoice === tone.value
                                    ? 'border-primary bg-primary'
                                    : 'border-muted-foreground'
                                }`}>
                                  {toneOfVoice === tone.value && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                                <span className="text-sm font-medium">{tone.emoji} {tone.label}</span>
                              </label>
                            ))}
                          </div>
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
                        <div className="p-5 bg-secondary/50 rounded-xl">
                          {/* Campaign Name - Large & Bold */}
                          <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                            {generatedTheme.name || "Generating..."}
                          </h3>
                          
                          {/* Slogan - Prominent */}
                          <p className="text-[oklch(0.60_0.12_45)] font-semibold text-lg mb-4">
                            {generatedTheme.slogan}
                          </p>
                          
                          {/* Color Palette Options */}
                          {generatedTheme.colorPalettes && generatedTheme.colorPalettes.length > 0 && (
                            <div className="mb-5 space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-muted-foreground">Color Palette Options</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleRegeneratePalette}
                                  disabled={isGenerating}
                                  className="text-xs h-7 px-2"
                                >
                                  <RefreshCw className={`w-3 h-3 mr-1 ${isGenerating ? "animate-spin" : ""}`} />
                                  New Palettes
                                </Button>
                              </div>
                              
                              {/* Palette Options */}
                              <div className="space-y-3">
                                {generatedTheme.colorPalettes.map((palette, paletteIndex) => (
                                  <div 
                                    key={paletteIndex}
                                    onClick={() => selectPalette(paletteIndex)}
                                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                                      generatedTheme.selectedPaletteIndex === paletteIndex
                                        ? 'bg-primary/10 border-2 border-primary shadow-md'
                                        : 'bg-background/50 border-2 border-transparent hover:border-primary/30 hover:bg-primary/5'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-medium text-muted-foreground">
                                        {generatedTheme.paletteNames?.[paletteIndex] || `Option ${paletteIndex + 1}`}
                                      </span>
                                      {generatedTheme.selectedPaletteIndex === paletteIndex && (
                                        <Badge variant="default" className="text-xs h-5">
                                          <Check className="w-3 h-3 mr-1" />
                                          Selected
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      {palette.map((color, colorIndex) => (
                                        <div key={colorIndex} className="group relative">
                                          <div 
                                            className="w-10 h-10 rounded-lg border-2 border-white shadow-md transition-transform hover:scale-110 cursor-pointer"
                                            style={{ backgroundColor: color }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openColorPicker(paletteIndex, colorIndex, color);
                                            }}
                                          >
                                            {/* Edit icon overlay on hover */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                              <Pencil className="w-4 h-4 text-white" />
                                            </div>
                                          </div>
                                          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                                            {color}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Key Messages - Simplified as Tags */}
                          {generatedTheme.keyMessages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6">
                              {generatedTheme.keyMessages.map((msg, i) => {
                                // Extract just the key phrase (first 4-6 words)
                                const shortMsg = msg.split(' ').slice(0, 5).join(' ');
                                return (
                                  <span 
                                    key={i} 
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {shortMsg.length < msg.length ? shortMsg + '...' : shortMsg}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Refine Theme (Optional)</Label>
                          <Textarea 
                            placeholder="e.g., Make it more family-oriented, add more emphasis on sharing..."
                            className="min-h-[80px]"
                            value={refinementPrompt}
                            onChange={(e) => setRefinementPrompt(e.target.value)}
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
                          className="w-full text-muted-foreground hover:text-foreground"
                          onClick={goBack}
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
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                          <p className="font-semibold text-primary text-lg">{generatedTheme.name}</p>
                          <p className="text-sm text-muted-foreground mb-3">{generatedTheme.slogan}</p>
                          {generatedTheme.colors.length > 0 && (
                            <div className="flex gap-2">
                              {generatedTheme.colors.map((color, i) => (
                                <div 
                                  key={i}
                                  className="w-10 h-10 rounded-lg shadow-md"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {!contentGenerated ? (
                          <div className="space-y-3">
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full text-muted-foreground hover:text-foreground"
                              onClick={goBack}
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Back to Theme Preview
                            </Button>
                          </div>
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
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full text-muted-foreground hover:text-foreground"
                              onClick={goBack}
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Back to Theme Preview
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

            {/* Right Panel - Content Preview (Only shown when content is generated) */}
            {contentGenerated && (
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display">Content Preview</CardTitle>
                    {contentGenerated && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copyAllContent}>
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
                                  <div 
                                    className="aspect-square flex items-center justify-center"
                                    style={{
                                      background: generatedTheme.colors.length >= 2 
                                        ? `linear-gradient(135deg, ${generatedTheme.colors[0]}, ${generatedTheme.colors[1]})`
                                        : 'linear-gradient(135deg, #C41E3A, #FFD700)'
                                    }}
                                  >
                                    <div className="text-center text-white p-4">
                                      <p className="font-display text-2xl font-bold mb-2">
                                        {generatedTheme.slogan.match(/[\u{1F300}-\u{1F9FF}]/gu)?.[0] || '🧋'}
                                      </p>
                                      <p className="font-display text-lg font-bold">{generatedTheme.slogan}</p>
                                      <p className="text-sm mt-2 opacity-90">{generatedTheme.keyMessages[0]}</p>
                                    </div>
                                  </div>
                                  {/* Caption Preview */}
                                  <div className="p-3">
                                    <p className="text-xs text-gray-800 line-clamp-3">
                                      {generatedContent[selectedPlatform as keyof typeof generatedContent].caption.substring(0, 100)}...
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
                                    {generatedContent[selectedPlatform as keyof typeof generatedContent].caption}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium mb-2 block">Hashtags</Label>
                                <div className="flex flex-wrap gap-2">
                                  {generatedContent[selectedPlatform as keyof typeof generatedContent].hashtags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => copyToClipboard(
                                    generatedContent[selectedPlatform as keyof typeof generatedContent].caption + '\n\n' +
                                    generatedContent[selectedPlatform as keyof typeof generatedContent].hashtags.join(' ')
                                  )}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={handleRegenerateContent}
                                  disabled={isGenerating}
                                >
                                  <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
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
                              <h3 className="font-display font-semibold text-lg">{generatedVideoScript.title}</h3>
                              <p className="text-sm text-muted-foreground">Duration: {generatedVideoScript.duration}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleRegenerateContent}
                                disabled={isGenerating}
                              >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                                Regenerate
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {generatedVideoScript.scenes.map((scene, i) => (
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
                            <p className="text-sm text-foreground">{generatedVideoScript.callToAction}</p>
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
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <div 
                                key={i} 
                                className="aspect-square rounded-lg border border-border flex items-center justify-center group cursor-pointer hover:border-primary transition-colors"
                                style={{
                                  background: generatedTheme.colors.length >= 2 
                                    ? `linear-gradient(135deg, ${generatedTheme.colors[0]}20, ${generatedTheme.colors[1]}20)`
                                    : 'linear-gradient(135deg, #C41E3A20, #FFD70020)'
                                }}
                              >
                                <div className="text-center p-4">
                                  <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-xs text-muted-foreground">Visual {i}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button className="w-full" variant="outline">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate More Visuals
                          </Button>
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
            )}
          </div>
        </div>
      </main>

      {/* Color Picker Modal */}
      <AnimatePresence>
        {colorPickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={cancelColorEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-lg">Edit Color</h3>
                <Button variant="ghost" size="sm" onClick={cancelColorEdit}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Color Picker & Preview */}
              <div className="flex flex-col items-center gap-4 mb-4">
                {/* Color Preview with Native Picker */}
                <div className="relative group">
                  <div 
                    className="w-32 h-32 rounded-2xl shadow-lg border-4 border-white"
                    style={{ backgroundColor: tempColor }}
                  />
                  <input
                    type="color"
                    value={tempColor}
                    onChange={(e) => setTempColor(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to pick
                    </div>
                  </div>
                </div>
                
                {/* Hex Input */}
                <div className="w-full space-y-2">
                  <Label className="text-xs text-muted-foreground">Hex Code</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono">#</span>
                    <Input
                      value={tempColor.replace('#', '').toUpperCase()}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').substring(0, 6);
                        if (val.length === 6) {
                          setTempColor('#' + val);
                        } else if (val.length < 6) {
                          setTempColor('#' + val.padEnd(6, '0'));
                        }
                      }}
                      className="flex-1 font-mono text-sm uppercase bg-secondary/30"
                      maxLength={6}
                      placeholder="000000"
                    />
                  </div>
                </div>
              </div>
              
              {/* RGB Sliders */}
              <div className="space-y-3 mb-4">
                {(() => {
                  const hex = tempColor.replace('#', '');
                  const r = parseInt(hex.substring(0, 2), 16) || 0;
                  const g = parseInt(hex.substring(2, 4), 16) || 0;
                  const b = parseInt(hex.substring(4, 6), 16) || 0;
                  
                  const updateRGB = (newR: number, newG: number, newB: number) => {
                    const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
                    setTempColor('#' + toHex(newR) + toHex(newG) + toHex(newB));
                  };
                  
                  return (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-8 text-center text-xs font-medium text-red-600">R</div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={r}
                          onChange={(e) => updateRGB(parseInt(e.target.value), g, b)}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                          style={{ background: `linear-gradient(to right, rgb(0,${g},${b}), rgb(255,${g},${b}))` }}
                        />
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={r}
                          onChange={(e) => updateRGB(parseInt(e.target.value) || 0, g, b)}
                          className="w-16 text-center font-mono text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 text-center text-xs font-medium text-green-600">G</div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={g}
                          onChange={(e) => updateRGB(r, parseInt(e.target.value), b)}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                          style={{ background: `linear-gradient(to right, rgb(${r},0,${b}), rgb(${r},255,${b}))` }}
                        />
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={g}
                          onChange={(e) => updateRGB(r, parseInt(e.target.value) || 0, b)}
                          className="w-16 text-center font-mono text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 text-center text-xs font-medium text-blue-600">B</div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={b}
                          onChange={(e) => updateRGB(r, g, parseInt(e.target.value))}
                          className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                          style={{ background: `linear-gradient(to right, rgb(${r},${g},0), rgb(${r},${g},255))` }}
                        />
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={b}
                          onChange={(e) => updateRGB(r, g, parseInt(e.target.value) || 0)}
                          className="w-16 text-center font-mono text-sm"
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={cancelColorEdit}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={applyColorChange}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Apply
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
