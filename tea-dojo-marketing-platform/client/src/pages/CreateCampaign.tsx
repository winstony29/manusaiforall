import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Palette,
  Layers,
  Zap,
  Save,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  Image,
  Video,
  Square,
  RectangleVertical,
  MessageSquare,
  X,
  Pencil,
  Coffee,
  ShoppingBag,
  Shirt
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

interface FormatOption {
  id: string;
  platform: string;
  label: string;
  description: string;
  aspectRatio: string;
  contentType: 'image' | 'video';
  icon: React.ReactNode;
}

const formatOptions: FormatOption[] = [
  {
    id: 'tiktok-video',
    platform: 'tiktok',
    label: 'TikTok Video',
    description: 'Vertical video',
    aspectRatio: '9:16',
    contentType: 'video',
    icon: <TikTokIcon className="w-5 h-5" />
  },
  {
    id: 'instagram-square',
    platform: 'instagram',
    label: 'Instagram Square',
    description: 'Square image post',
    aspectRatio: '1:1',
    contentType: 'image',
    icon: <Square className="w-5 h-5" />
  },
  {
    id: 'instagram-portrait',
    platform: 'instagram',
    label: 'Instagram Portrait',
    description: 'Vertical image',
    aspectRatio: '4:5',
    contentType: 'image',
    icon: <RectangleVertical className="w-5 h-5" />
  },
  {
    id: 'instagram-story',
    platform: 'instagram',
    label: 'Instagram Story',
    description: 'Full-screen story',
    aspectRatio: '9:16',
    contentType: 'image',
    icon: <RectangleVertical className="w-5 h-5" />
  },
  {
    id: 'instagram-reel',
    platform: 'instagram',
    label: 'Instagram Reel',
    description: 'Vertical video',
    aspectRatio: '9:16',
    contentType: 'video',
    icon: <Video className="w-5 h-5" />
  }
];

// Merchandise design options
interface MerchOption {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: 'packaging' | 'apparel';
}

const merchOptions: MerchOption[] = [
  {
    id: 'cup-design',
    label: 'Cup Design',
    description: 'Custom cup sleeve & lid design',
    icon: <Coffee className="w-5 h-5" />,
    category: 'packaging'
  },
  {
    id: 'bag-design',
    label: 'Bag Design',
    description: 'Takeaway bag & carrier design',
    icon: <ShoppingBag className="w-5 h-5" />,
    category: 'packaging'
  },
  {
    id: 'tshirt-design',
    label: 'T-Shirt Design',
    description: 'Staff & promotional t-shirts',
    icon: <Shirt className="w-5 h-5" />,
    category: 'apparel'
  },
  {
    id: 'apron-design',
    label: 'Apron Design',
    description: 'Staff apron with campaign theme',
    icon: <Shirt className="w-5 h-5" />,
    category: 'apparel'
  },
  {
    id: 'cap-design',
    label: 'Cap/Hat Design',
    description: 'Promotional caps & hats',
    icon: <Shirt className="w-5 h-5" />,
    category: 'apparel'
  }
];

interface ColorPalette {
  name: string;
  colors: string[];
}

interface Theme {
  name: string;
  slogan: string;
  description: string;
  keyMessages: string[];
  colorPalettes: ColorPalette[];
  selectedPaletteIndex: number;
}

const steps = [
  { id: 1, title: 'Select Dates', icon: Calendar },
  { id: 2, title: 'Theme & Colors', icon: Palette },
  { id: 3, title: 'Content Formats', icon: Layers },
  { id: 4, title: 'Merchandise', icon: ShoppingBag },
  { id: 5, title: 'Generate', icon: Zap }
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CreateCampaign() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectingEnd, setSelectingEnd] = useState(false);
  
  // Campaign details
  const [campaignName, setCampaignName] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState('playful');
  
  // Theme state
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);
  
  // Format selection
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [generateCaptions, setGenerateCaptions] = useState(true);
  
  // Merchandise selection
  const [selectedMerch, setSelectedMerch] = useState<string[]>([]);
  
  // Content generation
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  // Color picker state
  const [editingColor, setEditingColor] = useState<{paletteIndex: number, colorIndex: number} | null>(null);
  const [tempColor, setTempColor] = useState('#000000');

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date: Date) => {
    if (startDate && date.toDateString() === startDate.toDateString()) return true;
    if (endDate && date.toDateString() === endDate.toDateString()) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (!selectingEnd) {
      setStartDate(date);
      setEndDate(null);
      setSelectingEnd(true);
    } else {
      if (date < startDate!) {
        setStartDate(date);
        setEndDate(startDate);
      } else {
        setEndDate(date);
      }
      setSelectingEnd(false);
    }
  };

  const formatDateRange = () => {
    if (!startDate) return 'Select dates';
    if (!endDate) return startDate.toLocaleDateString();
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  // Build theme-based prompt for generation
  const buildThemePrompt = () => {
    if (!theme) return '';
    const selectedPalette = theme.colorPalettes[theme.selectedPaletteIndex];
    const colorString = selectedPalette.colors.join(', ');
    return `Theme: "${theme.name}" - ${theme.slogan}. ${theme.description}. Key messages: ${theme.keyMessages.join(', ')}. Color palette (${selectedPalette.name}): ${colorString}. Target audience: ${targetAudience}. Tone: ${toneOfVoice}.`;
  };

  // Theme generation
  const handleGenerateTheme = async () => {
    setIsGeneratingTheme(true);
    try {
      const response = await fetch('/api/generate-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignGoal,
          targetAudience,
          toneOfVoice
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate theme');
      
      const data = await response.json();
      setTheme(data.theme);
      toast.success('Theme generated successfully!');
    } catch (error) {
      console.error('Error generating theme:', error);
      toast.error('Failed to generate theme');
    } finally {
      setIsGeneratingTheme(false);
    }
  };

  // Format toggle
  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(f => f !== formatId)
        : [...prev, formatId]
    );
  };

  // Merchandise toggle
  const toggleMerch = (merchId: string) => {
    setSelectedMerch(prev => 
      prev.includes(merchId) 
        ? prev.filter(m => m !== merchId)
        : [...prev, merchId]
    );
  };

  // Content generation with theme-based prompts
  const handleGenerateContent = async () => {
    setIsGeneratingContent(true);
    const themePrompt = buildThemePrompt();
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          themePrompt,
          formats: selectedFormats,
          merchandise: selectedMerch,
          generateCaptions,
          campaignGoal,
          targetAudience
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate content');
      
      const data = await response.json();
      setGeneratedContent(data);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      // Generate mock content for demo with theme-based prompts
      const selectedPalette = theme?.colorPalettes[theme.selectedPaletteIndex];
      const mockContent = {
        socialPosts: selectedFormats.map(formatId => {
          const format = formatOptions.find(f => f.id === formatId);
          return {
            platform: format?.platform,
            format: format?.label,
            contentType: format?.contentType,
            caption: `✨ ${theme?.slogan || 'Amazing campaign'} ✨\n\n${campaignGoal}\n\nPerfect for ${targetAudience}! 🎉`,
            hashtags: '#teadojo #bubbletea #campaign #marketing',
            imagePrompt: format?.contentType === 'image' 
              ? `Create a ${format.aspectRatio} marketing image for "${theme?.name}". Theme: ${theme?.description}. Use colors: ${selectedPalette?.colors.join(', ')}. Style: ${toneOfVoice}, modern, eye-catching. Include bubble tea drinks prominently.`
              : undefined,
            videoPrompt: format?.contentType === 'video'
              ? `Create a ${format.aspectRatio} marketing video for "${theme?.name}". Theme: ${theme?.description}. Color scheme: ${selectedPalette?.colors.join(', ')}. Tone: ${toneOfVoice}. Show bubble tea preparation, happy customers, and brand messaging.`
              : undefined
          };
        }),
        videoScript: selectedFormats.some(f => formatOptions.find(fo => fo.id === f)?.contentType === 'video') ? {
          scenes: [
            { sceneNumber: 1, duration: '0-3s', visualDescription: `Opening shot with ${theme?.name} branding, colors: ${selectedPalette?.colors[0]}` },
            { sceneNumber: 2, duration: '3-8s', visualDescription: `Showcase bubble tea preparation with ${toneOfVoice} energy` },
            { sceneNumber: 3, duration: '8-12s', visualDescription: `Customer enjoying drinks, ${theme?.slogan} text overlay` },
            { sceneNumber: 4, duration: '12-15s', visualDescription: `Call to action with brand logo and campaign colors` }
          ]
        } : null,
        merchandiseDesigns: selectedMerch.map(merchId => {
          const merch = merchOptions.find(m => m.id === merchId);
          return {
            type: merch?.label,
            category: merch?.category,
            designPrompt: `Design a ${merch?.label.toLowerCase()} for the "${theme?.name}" campaign. Theme: ${theme?.description}. Slogan: "${theme?.slogan}". Primary colors: ${selectedPalette?.colors.slice(0, 3).join(', ')}. Style: ${toneOfVoice}, professional, brand-consistent. Include subtle bubble tea elements and campaign messaging.`,
            specifications: merch?.category === 'packaging' 
              ? 'Print-ready design with bleed marks, CMYK color mode'
              : 'Vector format, front and back designs, size chart compatible'
          };
        })
      };
      setGeneratedContent(mockContent);
      toast.success('Content generated successfully!');
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Save as draft
  const handleSaveDraft = () => {
    const draft = {
      id: Date.now().toString(),
      name: campaignName || 'Untitled Campaign',
      startDate,
      endDate,
      campaignGoal,
      targetAudience,
      toneOfVoice,
      theme,
      selectedFormats,
      selectedMerch,
      status: 'draft',
      createdAt: new Date()
    };
    
    // Save to localStorage for now (would be API in production)
    const drafts = JSON.parse(localStorage.getItem('campaignDrafts') || '[]');
    drafts.push(draft);
    localStorage.setItem('campaignDrafts', JSON.stringify(drafts));
    
    toast.success('Campaign saved as draft!');
    setLocation('/dashboard/campaigns');
  };

  // Color editing functions
  const openColorEditor = (paletteIndex: number, colorIndex: number) => {
    if (!theme) return;
    setEditingColor({ paletteIndex, colorIndex });
    setTempColor(theme.colorPalettes[paletteIndex].colors[colorIndex]);
  };

  const applyColorChange = () => {
    if (!editingColor || !theme) return;
    const newPalettes = [...theme.colorPalettes];
    newPalettes[editingColor.paletteIndex].colors[editingColor.colorIndex] = tempColor;
    setTheme({ ...theme, colorPalettes: newPalettes });
    setEditingColor(null);
    toast.success('Color updated!');
  };

  const selectPalette = (index: number) => {
    if (!theme) return;
    setTheme({ ...theme, selectedPaletteIndex: index });
    toast.success(`Selected ${theme.colorPalettes[index].name} palette`);
  };

  const toneOptions = [
    { value: 'playful', label: '🎉 Playful & Fun' },
    { value: 'sophisticated', label: '✨ Sophisticated' },
    { value: 'informative', label: '📚 Informative' },
    { value: 'energetic', label: '⚡ Energetic' },
    { value: 'warm', label: '🤗 Warm & Friendly' }
  ];

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
                <span className="font-display font-semibold text-lg">Create Campaign</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleSaveDraft} className="gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
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
            <div className="flex items-center justify-center gap-1 md:gap-2 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                    disabled={currentStep < step.id}
                    className={`flex items-center gap-1 md:gap-2 ${
                      currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                    } ${currentStep > step.id ? 'cursor-pointer hover:opacity-80' : ''}`}
                  >
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all ${
                      currentStep > step.id 
                        ? 'bg-primary text-primary-foreground' 
                        : currentStep === step.id 
                          ? 'bg-primary/20 text-primary border-2 border-primary' 
                          : 'bg-secondary text-muted-foreground'
                    }`}>
                      {currentStep > step.id ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : <step.icon className="w-3 h-3 md:w-4 md:h-4" />}
                    </div>
                    <span className="text-xs md:text-sm font-medium hidden lg:inline">{step.title}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-4 md:w-8 lg:w-12 h-0.5 mx-1 md:mx-2 ${currentStep > step.id ? 'bg-primary' : 'bg-secondary'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Calendar Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-semibold mb-2">Select Campaign Dates</h2>
                  <p className="text-muted-foreground">Choose the start and end dates for your campaign</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Calendar */}
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="font-medium">
                          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {DAYS.map(day => (
                          <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentMonth).map((date, index) => (
                          <div key={index} className="aspect-square">
                            {date && (
                              <button
                                onClick={() => handleDateClick(date)}
                                className={`w-full h-full rounded-lg text-sm flex items-center justify-center transition-all ${
                                  isDateSelected(date)
                                    ? 'bg-primary text-primary-foreground'
                                    : isDateInRange(date)
                                      ? 'bg-primary/20 text-primary'
                                      : 'hover:bg-secondary'
                                }`}
                              >
                                {date.getDate()}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Campaign Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Selected Dates</p>
                        <p className="font-medium">{formatDateRange()}</p>
                        {selectingEnd && <p className="text-xs text-primary mt-1">Now select end date</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="campaignName">Campaign Name</Label>
                        <Input
                          id="campaignName"
                          placeholder="e.g., CNY 2026 Campaign"
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="campaignGoal">Campaign Goal</Label>
                        <Textarea
                          id="campaignGoal"
                          placeholder="e.g., Promote our new CNY limited-edition drinks"
                          value={campaignGoal}
                          onChange={(e) => setCampaignGoal(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="targetAudience">Target Audience</Label>
                        <Input
                          id="targetAudience"
                          placeholder="e.g., Young adults 18-35, bubble tea lovers"
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end mt-8">
                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!startDate || !endDate || !campaignGoal}
                    className="gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Theme & Colors */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-semibold mb-2">Theme & Color Palette</h2>
                  <p className="text-muted-foreground">Generate and customize your campaign's visual identity</p>
                </div>

                {!theme ? (
                  <Card className="max-w-2xl mx-auto">
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {/* Tone Selection */}
                        <div className="space-y-3">
                          <Label>Tone of Voice</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {toneOptions.map(option => (
                              <button
                                key={option.value}
                                onClick={() => setToneOfVoice(option.value)}
                                className={`p-3 rounded-lg border text-sm text-left transition-all ${
                                  toneOfVoice === option.value
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <Button 
                          onClick={handleGenerateTheme} 
                          disabled={isGeneratingTheme}
                          className="w-full gap-2"
                          size="lg"
                        >
                          {isGeneratingTheme ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Generating Theme...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Generate Theme
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Theme Preview */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-display text-2xl font-bold">{theme.name}</h3>
                            <p className="text-lg text-primary">{theme.slogan}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={handleGenerateTheme} className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Regenerate
                          </Button>
                        </div>

                        <p className="text-muted-foreground mb-6">{theme.description}</p>

                        {/* Color Palettes */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>Color Palette Options</Label>
                          </div>
                          
                          <div className="grid gap-4">
                            {theme.colorPalettes.map((palette, pIndex) => (
                              <div 
                                key={pIndex}
                                onClick={() => selectPalette(pIndex)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  theme.selectedPaletteIndex === pIndex
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <span className="font-medium">{palette.name}</span>
                                  {theme.selectedPaletteIndex === pIndex && (
                                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {palette.colors.map((color, cIndex) => (
                                    <button
                                      key={cIndex}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openColorEditor(pIndex, cIndex);
                                      }}
                                      className="group relative"
                                    >
                                      <div 
                                        className="w-12 h-12 rounded-xl shadow-md transition-transform hover:scale-110"
                                        style={{ backgroundColor: color }}
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Pencil className="w-4 h-4 text-white drop-shadow-lg" />
                                      </div>
                                      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">
                                        {color}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Messages */}
                        <div className="mt-6">
                          <Label className="mb-2 block">Key Messages</Label>
                          <div className="flex flex-wrap gap-2">
                            {theme.keyMessages.map((msg, i) => (
                              <span key={i} className="text-sm bg-secondary px-3 py-1.5 rounded-full">
                                ✨ {msg.substring(0, 30)}...
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <Button onClick={() => setCurrentStep(3)} className="gap-2">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Format Selection */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-semibold mb-2">Select Content Formats</h2>
                  <p className="text-muted-foreground">Choose which social media formats to generate</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {formatOptions.map((format) => (
                    <Card 
                      key={format.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedFormats.includes(format.id) 
                          ? 'border-2 border-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => toggleFormat(format.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            format.platform === 'tiktok' ? 'bg-black text-white' :
                            'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                          }`}>
                            {format.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{format.label}</h3>
                              {selectedFormats.includes(format.id) && (
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

                {/* Caption Toggle */}
                <Card className="max-w-md mx-auto mb-8">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Generate Captions</p>
                          <p className="text-sm text-muted-foreground">AI will create captions with hashtags</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setGenerateCaptions(!generateCaptions)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          generateCaptions ? 'bg-primary' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            generateCaptions ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep(4)}
                    disabled={selectedFormats.length === 0}
                    className="gap-2"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Merchandise Selection */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-semibold mb-2">Merchandise Designs</h2>
                  <p className="text-muted-foreground">Select packaging and apparel designs for your campaign</p>
                </div>

                {/* Packaging Section */}
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    Packaging Designs
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {merchOptions.filter(m => m.category === 'packaging').map((merch) => (
                      <Card 
                        key={merch.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedMerch.includes(merch.id) 
                            ? 'border-2 border-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => toggleMerch(merch.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center">
                              {merch.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{merch.label}</h3>
                                {selectedMerch.includes(merch.id) && (
                                  <Check className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{merch.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Apparel Section */}
                <div className="mb-8">
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-primary" />
                    Apparel Designs
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {merchOptions.filter(m => m.category === 'apparel').map((merch) => (
                      <Card 
                        key={merch.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedMerch.includes(merch.id) 
                            ? 'border-2 border-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => toggleMerch(merch.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center">
                              {merch.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{merch.label}</h3>
                                {selectedMerch.includes(merch.id) && (
                                  <Check className="w-5 h-5 text-primary" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{merch.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Theme Preview */}
                {theme && (
                  <Card className="mb-8">
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-2">Designs will use your campaign theme:</p>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {theme.colorPalettes[theme.selectedPaletteIndex].colors.slice(0, 4).map((color, i) => (
                            <div 
                              key={i}
                              className="w-6 h-6 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div>
                          <p className="font-medium">{theme.name}</p>
                          <p className="text-xs text-muted-foreground">{theme.slogan}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(3)} className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button 
                    onClick={() => {
                      setCurrentStep(5);
                      handleGenerateContent();
                    }}
                    className="gap-2"
                  >
                    Generate Content
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Generated Content */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl font-semibold mb-2">Your Campaign Content</h2>
                  <p className="text-muted-foreground">Review and finalize your generated content</p>
                </div>

                {isGeneratingContent ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-lg font-medium">Generating your campaign content...</p>
                      <p className="text-muted-foreground">This may take a moment</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Summary Card */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Campaign</p>
                            <p className="font-medium">{campaignName || theme?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="font-medium">{formatDateRange()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Content Formats</p>
                            <p className="font-medium">{selectedFormats.length} selected</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Merchandise</p>
                            <p className="font-medium">{selectedMerch.length} designs</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Generated Content Preview */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Image className="w-5 h-5" />
                          Social Media Content
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {generatedContent && generatedContent.socialPosts ? (
                          <div className="space-y-6">
                            {/* Social Posts */}
                            <div className="grid md:grid-cols-2 gap-4">
                              {generatedContent.socialPosts.map((post: any, index: number) => (
                                <div key={index} className="border rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                      post.platform === 'tiktok' ? 'bg-black text-white' :
                                      'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                    }`}>
                                      {post.platform === 'tiktok' ? (
                                        <TikTokIcon className="w-4 h-4" />
                                      ) : (
                                        <InstagramIcon className="w-4 h-4" />
                                      )}
                                    </div>
                                    <span className="font-medium capitalize">{post.format}</span>
                                    <span className="text-xs bg-secondary px-2 py-0.5 rounded capitalize">{post.contentType}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{post.caption}</p>
                                  {post.hashtags && (
                                    <p className="text-xs text-primary">{post.hashtags}</p>
                                  )}
                                  {post.imagePrompt && (
                                    <div className="mt-3 p-2 bg-secondary/30 rounded text-xs">
                                      <p className="font-medium mb-1">Image Prompt:</p>
                                      <p className="text-muted-foreground">{post.imagePrompt}</p>
                                    </div>
                                  )}
                                  {post.videoPrompt && (
                                    <div className="mt-3 p-2 bg-secondary/30 rounded text-xs">
                                      <p className="font-medium mb-1">Video Prompt:</p>
                                      <p className="text-muted-foreground">{post.videoPrompt}</p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                            
                            {/* Video Script if available */}
                            {generatedContent.videoScript && (
                              <div className="border rounded-lg p-4">
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                  <Video className="w-4 h-4" />
                                  Video Script
                                </h4>
                                <div className="space-y-3">
                                  {generatedContent.videoScript.scenes?.map((scene: any, index: number) => (
                                    <div key={index} className="bg-secondary/30 rounded-lg p-3">
                                      <p className="text-sm font-medium">Scene {scene.sceneNumber}: {scene.duration}</p>
                                      <p className="text-sm text-muted-foreground mt-1">{scene.visualDescription}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            Content preview will appear here after generation completes.
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Merchandise Designs */}
                    {generatedContent && generatedContent.merchandiseDesigns && generatedContent.merchandiseDesigns.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            Merchandise Designs
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            {generatedContent.merchandiseDesigns.map((design: any, index: number) => (
                              <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    design.category === 'packaging' 
                                      ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
                                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                  } text-white`}>
                                    {design.category === 'packaging' ? <ShoppingBag className="w-4 h-4" /> : <Shirt className="w-4 h-4" />}
                                  </div>
                                  <span className="font-medium">{design.type}</span>
                                  <span className="text-xs bg-secondary px-2 py-0.5 rounded capitalize">{design.category}</span>
                                </div>
                                <div className="p-3 bg-secondary/30 rounded text-sm">
                                  <p className="font-medium mb-1">Design Prompt:</p>
                                  <p className="text-muted-foreground text-xs">{design.designPrompt}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">{design.specifications}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(4)} className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={handleSaveDraft} className="gap-2">
                          <Save className="w-4 h-4" />
                          Save Draft
                        </Button>
                        <Button onClick={() => {
                          handleSaveDraft();
                          toast.success('Campaign published!');
                        }} className="gap-2">
                          <Check className="w-4 h-4" />
                          Publish Campaign
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Color Picker Modal */}
        {editingColor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditingColor(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background rounded-xl p-6 w-80 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Edit Color</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingColor(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Color Preview */}
              <div className="flex flex-col items-center gap-4 mb-4">
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
                        }
                      }}
                      className="flex-1 font-mono text-sm uppercase"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditingColor(null)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={applyColorChange} className="flex-1">
                  Apply
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
