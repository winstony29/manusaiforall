/**
 * Calendar Page - BrewLab Marketing Platform
 * Promotional calendar with Singapore-specific events
 */

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Sparkles,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

// Calendar events data (holidays and pre-defined campaigns)
const staticCalendarEvents = {
  "2026-01": [
    { date: 1, title: "New Year's Day", type: "holiday", color: "bg-red-500" },
  ],
  "2026-02": [
    { date: 1, title: "Chinese New Year", type: "holiday", color: "bg-red-500" },
    { date: 2, title: "CNY Day 2", type: "holiday", color: "bg-red-500" },
  ],
  "2026-03": [
  ],
  "2026-04": [
    { date: 3, title: "Hari Raya Puasa", type: "holiday", color: "bg-green-500" },
    { date: 10, title: "Good Friday", type: "holiday", color: "bg-gray-500" },
  ],
  "2026-05": [
    { date: 1, title: "Labour Day", type: "holiday", color: "bg-blue-500" },
    { date: 26, title: "Vesak Day", type: "holiday", color: "bg-yellow-500" },
  ],
  "2026-06": [
    { date: 10, title: "Hari Raya Haji", type: "holiday", color: "bg-green-500" },
  ],
  "2026-07": [
  ],
  "2026-08": [
    { date: 9, title: "National Day", type: "holiday", color: "bg-red-500" },
  ],
  "2026-09": [
  ],
  "2026-10": [
  ],
  "2026-11": [
    { date: 7, title: "Deepavali", type: "holiday", color: "bg-yellow-500" },
  ],
  "2026-12": [
    { date: 25, title: "Christmas", type: "holiday", color: "bg-red-500" },
  ],
};

interface Campaign {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  campaignGoal: string;
  status: 'draft' | 'active' | 'completed';
  theme?: {
    name: string;
    colorPalettes: { colors: string[] }[];
    selectedPaletteIndex: number;
  };
  createdAt: string;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(0); // January 2026
  const [currentYear] = useState(2026);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    // Load campaigns from localStorage
    const drafts = JSON.parse(localStorage.getItem('campaignDrafts') || '[]');
    setCampaigns(drafts);
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getCampaignColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-primary';
    }
  };

  const getEventsForMonth = (month: number) => {
    const key = `2026-${String(month + 1).padStart(2, '0')}`;
    const staticEvents = staticCalendarEvents[key as keyof typeof staticCalendarEvents] || [];
    
    // Add campaigns from localStorage
    const campaignEvents: Array<{ date: number; title: string; type: string; color: string }> = [];
    
    campaigns.forEach(campaign => {
      if (campaign.startDate) {
        const startDate = new Date(campaign.startDate);
        const endDate = campaign.endDate ? new Date(campaign.endDate) : startDate;
        
        // Check if campaign falls in current month
        if (startDate.getFullYear() === currentYear && startDate.getMonth() === month) {
          campaignEvents.push({
            date: startDate.getDate(),
            title: campaign.name,
            type: 'campaign',
            color: getCampaignColor(campaign.status)
          });
        }
        
        // If campaign spans multiple days in the same month, add end date marker
        if (endDate.getFullYear() === currentYear && 
            endDate.getMonth() === month && 
            endDate.getDate() !== startDate.getDate()) {
          campaignEvents.push({
            date: endDate.getDate(),
            title: `${campaign.name} (End)`,
            type: 'campaign',
            color: getCampaignColor(campaign.status)
          });
        }
      }
    });
    
    return [...staticEvents, ...campaignEvents];
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const events = getEventsForMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-secondary/20 rounded-lg" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter(e => e.date === day);
      const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth();

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          className={`h-24 p-2 rounded-lg border transition-colors cursor-pointer ${
            isToday ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-secondary/30"
          }`}
        >
          <div className={`text-sm font-medium ${isToday ? "text-primary" : "text-foreground"}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className={`text-xs px-1.5 py-0.5 rounded truncate text-white ${event.color}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "scheduled":
        return "bg-green-100 text-green-800 border-green-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get upcoming campaigns (sorted by start date)
  const upcomingCampaigns = campaigns
    .filter(c => c.startDate)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 4);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Content Calendar
            </h1>
            <p className="text-muted-foreground">
              Plan and schedule your marketing campaigns with AI-powered suggestions
            </p>
          </div>
          <Link href="/dashboard/create-campaign">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Campaign
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(prev => prev > 0 ? prev - 1 : 11)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="font-display text-xl">
                    {months[currentMonth]} {currentYear}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentMonth(prev => prev < 11 ? prev + 1 : 0)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    Holiday
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Campaign
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                  {renderCalendarDays()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="space-y-6">
            {/* AI Suggestions */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Suggestions
                </CardTitle>
                <CardDescription>
                  Smart campaign recommendations based on Singapore events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-background rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Engagement Insight</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Posts about CNY perform 45% better. Consider increasing frequency this week.
                    </p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Optimal Timing</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Best posting time: 7-9 PM SGT for maximum reach.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  Upcoming Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingCampaigns.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingCampaigns.map((campaign) => (
                      <motion.div
                        key={campaign.id}
                        whileHover={{ x: 4 }}
                        className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-foreground">{campaign.name}</h4>
                          </div>
                          <Badge variant="outline" className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {campaign.campaignGoal || 'No description'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-primary">
                            {formatDate(campaign.startDate)}
                            {campaign.endDate && campaign.endDate !== campaign.startDate && 
                              ` - ${formatDate(campaign.endDate)}`}
                          </span>
                          {campaign.theme && (
                            <div className="flex gap-1">
                              {campaign.theme.colorPalettes[campaign.theme.selectedPaletteIndex]?.colors.slice(0, 3).map((color, i) => (
                                <div 
                                  key={i}
                                  className="w-3 h-3 rounded-full border border-white shadow-sm"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground mb-4">No campaigns scheduled yet</p>
                    <Link href="/dashboard/create-campaign">
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Campaign
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
