/**
 * Campaigns Page - Drinknovate Marketing Platform
 * Social media marketing campaigns management
 */

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Instagram,
  Facebook,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Trash2,
  Edit,
  Copy,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Sample campaigns data
const campaigns = [
  {
    id: 1,
    name: "Golden Fortune CNY 2026",
    description: "Chinese New Year campaign featuring prosperity-themed drinks and festive promotions",
    status: "active",
    platforms: ["instagram", "tiktok", "facebook"],
    startDate: "Jan 29, 2026",
    endDate: "Feb 15, 2026",
    posts: 12,
    published: 8,
    scheduled: 4,
    metrics: { views: 45200, likes: 3420, comments: 456, shares: 234 },
    image: "/images/hero-tea-ai.jpg"
  },
  {
    id: 2,
    name: "Valentine's Day Special",
    description: "Love is in the Tea - Couple specials and heart-themed drinks",
    status: "scheduled",
    platforms: ["instagram", "facebook"],
    startDate: "Feb 10, 2026",
    endDate: "Feb 14, 2026",
    posts: 6,
    published: 0,
    scheduled: 6,
    metrics: { views: 0, likes: 0, comments: 0, shares: 0 },
    image: "/images/content-generation.jpg"
  },
  {
    id: 3,
    name: "Weekly Drink Features",
    description: "Ongoing campaign highlighting different drinks each week",
    status: "active",
    platforms: ["instagram", "tiktok"],
    startDate: "Jan 1, 2026",
    endDate: "Dec 31, 2026",
    posts: 52,
    published: 4,
    scheduled: 48,
    metrics: { views: 12800, likes: 890, comments: 123, shares: 67 },
    image: "/images/calendar-planning.jpg"
  },
  {
    id: 4,
    name: "National Day 2025",
    description: "Our Singapore, Our Tea - Patriotic themed content",
    status: "completed",
    platforms: ["instagram", "tiktok", "facebook"],
    startDate: "Aug 1, 2025",
    endDate: "Aug 9, 2025",
    posts: 15,
    published: 15,
    scheduled: 0,
    metrics: { views: 89400, likes: 7230, comments: 892, shares: 456 },
    image: "/images/analytics-dashboard.jpg"
  },
  {
    id: 5,
    name: "Christmas 2025",
    description: "A Jolly Tea-mas - Holiday specials and gift sets",
    status: "completed",
    platforms: ["instagram", "facebook"],
    startDate: "Dec 1, 2025",
    endDate: "Dec 25, 2025",
    posts: 20,
    published: 20,
    scheduled: 0,
    metrics: { views: 67800, likes: 5120, comments: 678, shares: 345 },
    image: "/images/brand-customization.jpg"
  },
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

const getStatusConfig = (status: string) => {
  switch (status) {
    case "active":
      return { color: "bg-green-100 text-green-800 border-green-200", icon: Play, label: "Active" };
    case "scheduled":
      return { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock, label: "Scheduled" };
    case "paused":
      return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Pause, label: "Paused" };
    case "completed":
      return { color: "bg-gray-100 text-gray-800 border-gray-200", icon: CheckCircle2, label: "Completed" };
    default:
      return { color: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock, label: status };
  }
};

export default function Campaigns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || campaign.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === "active").length,
    scheduled: campaigns.filter(c => c.status === "scheduled").length,
    completed: campaigns.filter(c => c.status === "completed").length,
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Campaigns
            </h1>
            <p className="text-muted-foreground">
              Manage your social media marketing campaigns
            </p>
          </div>
          <Link href="/dashboard/generate">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Campaigns</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign, index) => {
            const statusConfig = getStatusConfig(campaign.status);
            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Campaign Image */}
                  <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/20">
                    <img 
                      src={campaign.image} 
                      alt={campaign.name}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant="outline" className={statusConfig.color}>
                        <statusConfig.icon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="font-display text-lg">{campaign.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="line-clamp-2">{campaign.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Platforms */}
                    <div className="flex items-center gap-2">
                      {campaign.platforms.map((platform) => (
                        <div
                          key={platform}
                          className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                        >
                          {getPlatformIcon(platform)}
                        </div>
                      ))}
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{campaign.startDate} - {campaign.endDate}</span>
                    </div>

                    {/* Posts Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Posts</span>
                        <span className="font-medium">{campaign.published}/{campaign.posts}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(campaign.published / campaign.posts) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Metrics */}
                    {campaign.metrics.views > 0 && (
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border">
                        <div className="text-center">
                          <Eye className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                          <p className="text-xs font-medium">{(campaign.metrics.views / 1000).toFixed(1)}K</p>
                        </div>
                        <div className="text-center">
                          <Heart className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                          <p className="text-xs font-medium">{(campaign.metrics.likes / 1000).toFixed(1)}K</p>
                        </div>
                        <div className="text-center">
                          <MessageCircle className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                          <p className="text-xs font-medium">{campaign.metrics.comments}</p>
                        </div>
                        <div className="text-center">
                          <Share2 className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                          <p className="text-xs font-medium">{campaign.metrics.shares}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No campaigns found matching your criteria.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
