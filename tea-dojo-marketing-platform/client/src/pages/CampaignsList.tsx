import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Sparkles, 
  ArrowLeft,
  Plus,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

export default function CampaignsList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Load campaigns from localStorage
    const drafts = JSON.parse(localStorage.getItem('campaignDrafts') || '[]');
    setCampaigns(drafts);
  }, []);

  const deleteCampaign = (id: string) => {
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    localStorage.setItem('campaignDrafts', JSON.stringify(updated));
    toast.success('Campaign deleted');
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.campaignGoal?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
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
              <span className="font-display font-semibold text-lg">Campaigns</span>
            </div>
          </div>
          <Link href="/dashboard/create-campaign">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Campaign
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('draft')}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('completed')}>Completed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Campaigns Grid */}
          {filteredCampaigns.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'No campaigns match your filters'
                    : 'Create your first campaign to get started'}
                </p>
                <Link href="/dashboard/create-campaign">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Campaign
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign, index) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Color Bar */}
                      {campaign.theme?.colorPalettes && (
                        <div className="flex gap-1 mb-4 h-2 rounded-full overflow-hidden">
                          {campaign.theme.colorPalettes[campaign.theme.selectedPaletteIndex || 0]?.colors.slice(0, 4).map((color, i) => (
                            <div key={i} className="flex-1" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {campaign.campaignGoal || 'No description'}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="w-4 h-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Edit className="w-4 h-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2 text-destructive"
                              onClick={() => deleteCampaign(campaign.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                        <Link href={`/campaigns/${campaign.id}`}>
                          <Button variant="outline" size="sm">
                            Open
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
