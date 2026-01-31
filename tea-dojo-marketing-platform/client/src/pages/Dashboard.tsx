/**
 * Dashboard Page - BrewLab Marketing Platform
 * Shows created post analytics and overview with interactive insights
 */

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown,
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Instagram,
  Facebook,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Clock,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Target,
  Zap,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

// TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Time frame data for engagement chart
const engagementDataByTimeframe: Record<string, Array<{ date: string; views: number; likes: number; comments: number }>> = {
  weekly: [
    { date: "Mon", views: 1200, likes: 580, comments: 45 },
    { date: "Tue", views: 1450, likes: 720, comments: 62 },
    { date: "Wed", views: 980, likes: 490, comments: 38 },
    { date: "Thu", views: 1680, likes: 890, comments: 78 },
    { date: "Fri", views: 2100, likes: 1100, comments: 95 },
    { date: "Sat", views: 2450, likes: 1350, comments: 112 },
    { date: "Sun", views: 1890, likes: 980, comments: 82 },
  ],
  monthly: [
    { date: "Jan 1", views: 2400, likes: 1200, comments: 180 },
    { date: "Jan 8", views: 3100, likes: 1800, comments: 220 },
    { date: "Jan 15", views: 2800, likes: 1500, comments: 190 },
    { date: "Jan 22", views: 4200, likes: 2400, comments: 310 },
    { date: "Jan 29", views: 5100, likes: 3200, comments: 420 },
  ],
  yearly: [
    { date: "Jan", views: 18500, likes: 9200, comments: 1420 },
    { date: "Feb", views: 22100, likes: 11800, comments: 1680 },
    { date: "Mar", views: 19800, likes: 10500, comments: 1520 },
    { date: "Apr", views: 24500, likes: 13200, comments: 1890 },
    { date: "May", views: 28900, likes: 15800, comments: 2210 },
    { date: "Jun", views: 31200, likes: 17500, comments: 2450 },
    { date: "Jul", views: 29800, likes: 16200, comments: 2280 },
    { date: "Aug", views: 35100, likes: 19800, comments: 2780 },
    { date: "Sep", views: 32400, likes: 18100, comments: 2520 },
    { date: "Oct", views: 38200, likes: 21500, comments: 3010 },
    { date: "Nov", views: 42100, likes: 24200, comments: 3380 },
    { date: "Dec", views: 45800, likes: 26800, comments: 3720 },
  ],
  "3years": [
    { date: "2024", views: 285000, likes: 156000, comments: 21800 },
    { date: "2025", views: 368000, likes: 204000, comments: 28500 },
    { date: "2026", views: 24500, likes: 8200, comments: 1400 },
  ],
  alltime: [
    { date: "2022", views: 125000, likes: 68000, comments: 9500 },
    { date: "2023", views: 198000, likes: 108000, comments: 15100 },
    { date: "2024", views: 285000, likes: 156000, comments: 21800 },
    { date: "2025", views: 368000, likes: 204000, comments: 28500 },
    { date: "2026", views: 24500, likes: 8200, comments: 1400 },
  ],
};

// Detailed breakdown data for each stat
const statsBreakdown = {
  views: {
    total: 24500,
    change: "+12.5%",
    trend: "up",
    platforms: [
      { name: "Instagram", value: 11025, percentage: 45, change: "+18.2%", trend: "up", color: "#E4405F" },
      { name: "TikTok", value: 8575, percentage: 35, change: "+22.1%", trend: "up", color: "#000000" },
      { name: "Facebook", value: 4900, percentage: 20, change: "-5.3%", trend: "down", color: "#1877F2" },
    ],
    topPosts: [
      { title: "From 🥵 to 😎 in one sip. That's the Tea Dojo effect!", platform: "tiktok", views: 5678, benchmark: 3500, status: "above" },
      { title: "Your daily dose of freshness is here! 🍋", platform: "instagram", views: 1234, benchmark: 1500, status: "below" },
      { title: "Ever wondered what goes into our Mango Pomelo Boba?", platform: "facebook", views: 890, benchmark: 800, status: "above" },
      { title: "Weekend vibes with our new Taro Milk Tea 🍠", platform: "instagram", views: 2156, benchmark: 1500, status: "above" },
      { title: "Behind the scenes: How we make our signature pearls", platform: "tiktok", views: 4521, benchmark: 3500, status: "above" },
    ],
    insights: [
      { type: "success", message: "TikTok views increased 22% this month - your video content is performing well!" },
      { type: "warning", message: "Facebook views dropped 5.3% - consider posting more engaging content or adjusting posting times." },
      { type: "tip", message: "Posts with emojis get 15% more views on average. Keep using them!" },
    ]
  },
  likes: {
    total: 8200,
    change: "+8.3%",
    trend: "up",
    platforms: [
      { name: "Instagram", value: 3936, percentage: 48, change: "+12.5%", trend: "up", color: "#E4405F" },
      { name: "TikTok", value: 2870, percentage: 35, change: "+15.8%", trend: "up", color: "#000000" },
      { name: "Facebook", value: 1394, percentage: 17, change: "-8.2%", trend: "down", color: "#1877F2" },
    ],
    topPosts: [
      { title: "From 🥵 to 😎 in one sip. That's the Tea Dojo effect!", platform: "tiktok", views: 432, benchmark: 280, status: "above" },
      { title: "Weekend vibes with our new Taro Milk Tea 🍠", platform: "instagram", views: 312, benchmark: 200, status: "above" },
      { title: "Your daily dose of freshness is here! 🍋", platform: "instagram", views: 89, benchmark: 200, status: "below" },
      { title: "Behind the scenes: How we make our signature pearls", platform: "tiktok", views: 398, benchmark: 280, status: "above" },
      { title: "Ever wondered what goes into our Mango Pomelo Boba?", platform: "facebook", views: 67, benchmark: 120, status: "below" },
    ],
    insights: [
      { type: "success", message: "Instagram like rate is 3.2% - above industry average of 2.5%!" },
      { type: "warning", message: "Facebook engagement is declining. Try asking questions in your posts." },
      { type: "tip", message: "Posts published between 7-9 PM get 25% more likes." },
    ]
  },
  comments: {
    total: 1400,
    change: "+15.2%",
    trend: "up",
    platforms: [
      { name: "Instagram", value: 588, percentage: 42, change: "+18.9%", trend: "up", color: "#E4405F" },
      { name: "TikTok", value: 560, percentage: 40, change: "+28.4%", trend: "up", color: "#000000" },
      { name: "Facebook", value: 252, percentage: 18, change: "-12.1%", trend: "down", color: "#1877F2" },
    ],
    topPosts: [
      { title: "From 🥵 to 😎 in one sip. That's the Tea Dojo effect!", platform: "tiktok", views: 56, benchmark: 35, status: "above" },
      { title: "What's your favorite boba topping? 🧋", platform: "instagram", views: 124, benchmark: 45, status: "above" },
      { title: "Your daily dose of freshness is here! 🍋", platform: "instagram", views: 12, benchmark: 45, status: "below" },
      { title: "Rate our new drink 1-10! 🔥", platform: "tiktok", views: 89, benchmark: 35, status: "above" },
      { title: "Ever wondered what goes into our Mango Pomelo Boba?", platform: "facebook", views: 8, benchmark: 25, status: "below" },
    ],
    insights: [
      { type: "success", message: "Comment engagement up 15.2%! Your audience is more engaged than ever." },
      { type: "success", message: "TikTok comments increased 28.4% - your content is sparking conversations!" },
      { type: "tip", message: "Respond to comments within 1 hour to boost engagement by 40%." },
    ]
  },
  shares: {
    total: 892,
    change: "-2.1%",
    trend: "down",
    platforms: [
      { name: "Instagram", value: 285, percentage: 32, change: "+5.2%", trend: "up", color: "#E4405F" },
      { name: "TikTok", value: 428, percentage: 48, change: "-8.5%", trend: "down", color: "#000000" },
      { name: "Facebook", value: 179, percentage: 20, change: "-12.3%", trend: "down", color: "#1877F2" },
    ],
    topPosts: [
      { title: "From 🥵 to 😎 in one sip. That's the Tea Dojo effect!", platform: "tiktok", views: 145, benchmark: 120, status: "above" },
      { title: "Tag someone who needs this drink! 🏷️", platform: "instagram", views: 89, benchmark: 50, status: "above" },
      { title: "Your daily dose of freshness is here! 🍋", platform: "instagram", views: 23, benchmark: 50, status: "below" },
      { title: "Share if you agree: Boba > Coffee ☕", platform: "tiktok", views: 112, benchmark: 120, status: "below" },
      { title: "Ever wondered what goes into our Mango Pomelo Boba?", platform: "facebook", views: 15, benchmark: 40, status: "below" },
    ],
    insights: [
      { type: "warning", message: "Overall shares down 2.1% - consider creating more shareable content." },
      { type: "warning", message: "TikTok shares dropped 8.5% - try adding trending sounds or challenges." },
      { type: "tip", message: "Posts with 'Tag a friend' CTAs get 3x more shares on average." },
    ]
  }
};

const platformData = [
  { name: "Instagram", value: 45, color: "#E4405F" },
  { name: "TikTok", value: 35, color: "#000000" },
  { name: "Facebook", value: 20, color: "#1877F2" },
];

const recentPosts = [
  {
    id: 1,
    platform: "instagram",
    content: "Your daily dose of freshness is here! 🍋 Our Hand-Pounded Fragrant Lemon Tea...",
    date: "2 hours ago",
    views: 1234,
    likes: 89,
    comments: 12,
    status: "published"
  },
  {
    id: 2,
    platform: "tiktok",
    content: "From 🥵 to 😎 in one sip. That's the Tea Dojo effect! 🧋✨",
    date: "5 hours ago",
    views: 5678,
    likes: 432,
    comments: 56,
    status: "published"
  },
  {
    id: 3,
    platform: "facebook",
    content: "Ever wondered what goes into our Mango Pomelo Boba? 🥭✨",
    date: "1 day ago",
    views: 890,
    likes: 67,
    comments: 8,
    status: "published"
  },
  {
    id: 4,
    platform: "instagram",
    content: "CNY Special: Golden Fortune Bubble Tea 🧧",
    date: "Scheduled for Feb 1",
    views: 0,
    likes: 0,
    comments: 0,
    status: "scheduled"
  },
];

type StatType = "views" | "likes" | "comments" | "shares";

const stats: Array<{ label: string; value: string; change: string; trend: string; icon: any; type: StatType }> = [
  { label: "Total Views", value: "24.5K", change: "+12.5%", trend: "up", icon: Eye, type: "views" },
  { label: "Total Likes", value: "8.2K", change: "+8.3%", trend: "up", icon: Heart, type: "likes" },
  { label: "Comments", value: "1.4K", change: "+15.2%", trend: "up", icon: MessageCircle, type: "comments" },
  { label: "Shares", value: "892", change: "-2.1%", trend: "down", icon: Share2, type: "shares" },
];

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "instagram":
      return <Instagram className="w-4 h-4" />;
    case "tiktok":
      return <TikTokIcon className="w-4 h-4" />;
    case "facebook":
      return <Facebook className="w-4 h-4" />;
    default:
      return null;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "instagram":
      return "bg-pink-500";
    case "tiktok":
      return "bg-black";
    case "facebook":
      return "bg-blue-600";
    default:
      return "bg-gray-500";
  }
};

// Stat Detail Modal Component
function StatDetailModal({ 
  isOpen, 
  onClose, 
  statType 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  statType: StatType | null;
}) {
  if (!statType) return null;
  
  const data = statsBreakdown[statType];
  const statLabels: Record<StatType, string> = {
    views: "Views",
    likes: "Likes", 
    comments: "Comments",
    shares: "Shares"
  };
  
  const statIcons: Record<StatType, any> = {
    views: Eye,
    likes: Heart,
    comments: MessageCircle,
    shares: Share2
  };
  
  const StatIcon = statIcons[statType];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-7xl max-h-[95vh] overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <StatIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="font-display">{statLabels[statType]} Breakdown</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-bold">{data.total.toLocaleString()}</span>
                <Badge 
                  variant="outline" 
                  className={data.trend === "up" ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50"}
                >
                  {data.trend === "up" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {data.change}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Detailed analytics breakdown by platform and top performing posts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Platform Breakdown */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Platform Performance
            </h3>
            <div className="grid gap-4">
              {data.platforms.map((platform) => (
                <div key={platform.name} className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: platform.color }}
                      >
                        {platform.name === "Instagram" && <Instagram className="w-5 h-5" />}
                        {platform.name === "TikTok" && <TikTokIcon className="w-5 h-5" />}
                        {platform.name === "Facebook" && <Facebook className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-semibold">{platform.name}</p>
                        <p className="text-sm text-muted-foreground">{platform.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{platform.value.toLocaleString()}</p>
                      <Badge 
                        variant="outline" 
                        className={platform.trend === "up" ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50"}
                      >
                        {platform.trend === "up" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {platform.change}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={platform.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Top Posts */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Top Performing Posts
            </h3>
            <div className="space-y-3">
              {data.topPosts.map((post, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl border ${
                    post.status === "above" 
                      ? "bg-green-50/50 border-green-200" 
                      : "bg-red-50/50 border-red-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full ${getPlatformColor(post.platform)} flex items-center justify-center text-white flex-shrink-0 mt-0.5`}>
                        {getPlatformIcon(post.platform)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{post.title}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="font-semibold">{post.views.toLocaleString()} {statLabels[statType].toLowerCase()}</span>
                          <span className="text-muted-foreground">vs benchmark: {post.benchmark.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={post.status === "above" ? "text-green-600 border-green-300 bg-green-100" : "text-red-600 border-red-300 bg-red-100"}
                    >
                      {post.status === "above" ? (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Above avg
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Below avg
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Insights & Recommendations
            </h3>
            <div className="space-y-3">
              {data.insights.map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl flex items-start gap-3 ${
                    insight.type === "success" 
                      ? "bg-green-50 border border-green-200" 
                      : insight.type === "warning"
                      ? "bg-amber-50 border border-amber-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  {insight.type === "success" && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                  {insight.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
                  {insight.type === "tip" && <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />}
                  <p className={`text-sm ${
                    insight.type === "success" 
                      ? "text-green-800" 
                      : insight.type === "warning"
                      ? "text-amber-800"
                      : "text-blue-800"
                  }`}>
                    {insight.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState("monthly");
  const [selectedStat, setSelectedStat] = useState<StatType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatClick = (statType: StatType) => {
    setSelectedStat(statType);
    setIsModalOpen(true);
  };

  const timeframeLabels: Record<string, string> = {
    weekly: "This Week",
    monthly: "This Month",
    yearly: "This Year",
    "3years": "Last 3 Years",
    alltime: "All Time"
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-gradient-to-br from-background via-background to-secondary/20 min-h-screen">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your content performance across all platforms
            </p>
          </div>
          <Link href="/dashboard/generate">
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
              <Sparkles className="w-4 h-4 mr-2" />
              Create New Content
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid - Now Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 group"
                onClick={() => handleStatClick(stat.type)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={stat.trend === "up" ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50"}
                    >
                      {stat.trend === "up" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Engagement Chart with Timeframe Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle className="font-display flex items-center gap-2 text-xl">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Engagement Over Time
                  </CardTitle>
                  <CardDescription className="mt-1">Views, likes, and comments for {timeframeLabels[timeframe].toLowerCase()}</CardDescription>
                </div>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="3years">Last 3 Years</SelectItem>
                    <SelectItem value="alltime">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={engagementDataByTimeframe[timeframe]}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2D5A3D" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#2D5A3D" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E4405F" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#E4405F" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4A853" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#D4A853" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                        }}
                        formatter={(value: number) => [value.toLocaleString(), ""]}
                      />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        iconType="circle"
                        iconSize={8}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        name="Views"
                        stroke="#2D5A3D" 
                        strokeWidth={2}
                        fill="url(#colorViews)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="likes" 
                        name="Likes"
                        stroke="#E4405F" 
                        strokeWidth={2}
                        fill="url(#colorLikes)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="comments" 
                        name="Comments"
                        stroke="#D4A853" 
                        strokeWidth={2}
                        fill="url(#colorComments)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Platform Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-sm hover:shadow-md transition-shadow h-full">
              <CardHeader>
                <CardTitle className="font-display text-xl">Platform Distribution</CardTitle>
                <CardDescription>Content performance by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px"
                        }}
                        formatter={(value: number) => [`${value}%`, "Share"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  {platformData.map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                        <span className="text-sm font-medium">{platform.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{platform.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display flex items-center gap-2 text-xl">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Posts
                </CardTitle>
                <CardDescription>Your latest content across all platforms</CardDescription>
              </div>
              <Link href="/dashboard/posts">
                <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all hover:shadow-sm cursor-pointer group"
                  >
                    <div className={`w-11 h-11 rounded-full ${getPlatformColor(post.platform)} flex items-center justify-center text-white shadow-sm`}>
                      {getPlatformIcon(post.platform)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{post.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                    </div>
                    <div className="flex items-center gap-5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5 min-w-[60px]">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-[50px]">
                        <Heart className="w-4 h-4" />
                        <span className="font-medium">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5 min-w-[40px]">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">{post.comments}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={post.status === "published" ? "default" : "secondary"}
                      className={post.status === "published" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {post.status === "published" ? "Published" : "Scheduled"}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stat Detail Modal */}
      <StatDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        statType={selectedStat}
      />
    </DashboardLayout>
  );
}
