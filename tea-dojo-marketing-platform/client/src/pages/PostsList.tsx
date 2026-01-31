import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft,
  Plus,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  Image,
  Video,
  Calendar
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Post {
  id: string;
  platform: string;
  format: string;
  contentType: 'image' | 'video';
  caption: string;
  hashtags: string[];
  campaignId?: string;
  campaignName?: string;
  createdAt: string;
  status: 'draft' | 'scheduled' | 'published';
}

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'individual' | 'campaign'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    if (savedPosts.length === 0) {
      const demoPosts: Post[] = [
        {
          id: '1',
          platform: 'instagram',
          format: 'square',
          contentType: 'image',
          caption: 'Start your day with our refreshing bubble tea!',
          hashtags: ['#bubbletea', '#morning', '#singapore'],
          createdAt: new Date().toISOString(),
          status: 'draft'
        },
        {
          id: '2',
          platform: 'tiktok',
          format: 'video',
          contentType: 'video',
          caption: 'Watch how we make our signature brown sugar boba!',
          hashtags: ['#boba', '#tiktok', '#fyp'],
          campaignId: '123',
          campaignName: 'Summer Campaign',
          createdAt: new Date().toISOString(),
          status: 'scheduled'
        }
      ];
      setPosts(demoPosts);
      localStorage.setItem('posts', JSON.stringify(demoPosts));
    } else {
      setPosts(savedPosts);
    }
  }, []);

  const deletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem('posts', JSON.stringify(updated));
    toast.success('Post deleted');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.caption.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
    const matchesView = viewMode === 'all' || 
                       (viewMode === 'individual' && !post.campaignId) ||
                       (viewMode === 'campaign' && post.campaignId);
    return matchesSearch && matchesPlatform && matchesView;
  });

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'tiktok': return 'bg-black text-white';
      case 'instagram': return 'bg-gradient-to-br from-purple-500 to-pink-500 text-white';
      case 'facebook': return 'bg-blue-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'published': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/generate">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">D</span>
              </div>
              <span className="font-display font-semibold text-lg">All Posts</span>
            </div>
          </div>
          <Link href="/create-post">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="individual">Individual Posts</TabsTrigger>
              <TabsTrigger value="campaign">Campaign Posts</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  {platformFilter === 'all' ? 'All Platforms' : platformFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setPlatformFilter('all')}>All Platforms</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPlatformFilter('instagram')}>Instagram</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPlatformFilter('tiktok')}>TikTok</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPlatformFilter('facebook')}>Facebook</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-6">Create your first post to get started</p>
                <Link href="/create-post">
                  <Button className="gap-2"><Plus className="w-4 h-4" />Create Post</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getPlatformColor(post.platform)}`}>
                            {post.contentType === 'video' ? <Video className="w-4 h-4" /> : <Image className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{post.platform}</p>
                            <p className="text-xs text-muted-foreground capitalize">{post.format}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2"><Eye className="w-4 h-4" />View</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2"><Edit className="w-4 h-4" />Edit</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive" onClick={() => deletePost(post.id)}><Trash2 className="w-4 h-4" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{post.caption}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.hashtags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                      {post.campaignName && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 p-2 bg-secondary/50 rounded">
                          <Calendar className="w-3 h-3" />
                          <span>Part of: {post.campaignName}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(post.status)}`}>{post.status}</span>
                        <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
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
