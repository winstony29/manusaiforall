/**
 * Dashboard Page - Drinknovate Marketing Platform
 * Shows created post analytics and overview
 */

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Calendar,
  Sparkles,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Sample analytics data
const engagementData = [
  { date: "Jan 1", views: 2400, likes: 1200, comments: 180 },
  { date: "Jan 8", views: 3100, likes: 1800, comments: 220 },
  { date: "Jan 15", views: 2800, likes: 1500, comments: 190 },
  { date: "Jan 22", views: 4200, likes: 2400, comments: 310 },
  { date: "Jan 29", views: 5100, likes: 3200, comments: 420 },
];

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

const stats = [
  { label: "Total Views", value: "24.5K", change: "+12.5%", trend: "up", icon: Eye },
  { label: "Total Likes", value: "8.2K", change: "+8.3%", trend: "up", icon: Heart },
  { label: "Comments", value: "1.4K", change: "+15.2%", trend: "up", icon: MessageCircle },
  { label: "Shares", value: "892", change: "-2.1%", trend: "down", icon: Share2 },
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

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your content performance across all platforms
            </p>
          </div>
          <Link href="/dashboard/generate">
            <Button className="bg-primary hover:bg-primary/90">
              <Sparkles className="w-4 h-4 mr-2" />
              Create New Content
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={stat.trend === "up" ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50"}
                    >
                      {stat.trend === "up" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Engagement Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Engagement Over Time
              </CardTitle>
              <CardDescription>Views, likes, and comments for the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Area type="monotone" dataKey="views" stackId="1" stroke="#2D5A3D" fill="#2D5A3D" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="likes" stackId="2" stroke="#C4704B" fill="#C4704B" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="comments" stackId="3" stroke="#D4A853" fill="#D4A853" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Platform Distribution</CardTitle>
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
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {platformData.map((platform) => (
                  <div key={platform.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                    <span className="text-sm text-muted-foreground">{platform.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Posts
              </CardTitle>
              <CardDescription>Your latest content across all platforms</CardDescription>
            </div>
            <Link href="/dashboard/campaigns">
              <Button variant="outline" size="sm">
                View All
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full ${getPlatformColor(post.platform)} flex items-center justify-center text-white`}>
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{post.content}</p>
                    <p className="text-xs text-muted-foreground">{post.date}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </div>
                  </div>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status === "published" ? "Published" : "Scheduled"}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
