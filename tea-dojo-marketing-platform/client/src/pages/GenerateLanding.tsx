import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  Sparkles, 
  Calendar, 
  Image, 
  ArrowRight,
  Layers,
  FileText
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GenerateLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">D</span>
              </div>
              <span className="font-display font-semibold text-lg">Content Studio</span>
            </a>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI Powered
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            What would you like to create?
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose between creating a single social media post or launching a full marketing campaign
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Create Social Media Post Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/create-post">
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Image className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold mb-3">
                    Create Social Media Post
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Quickly generate a single post for any platform. Perfect for one-off content, announcements, or testing ideas.
                  </p>
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Choose one format (TikTok, Instagram, etc.)
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      AI-generated captions and hashtags
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Quick and simple workflow
                    </li>
                  </ul>
                  <Button className="w-full group-hover:bg-primary/90">
                    Create Post
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Create Campaign Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/create-campaign">
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold mb-3">
                    Create Campaign
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Plan and generate a complete marketing campaign with multiple posts, themes, and scheduled content.
                  </p>
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Select campaign date range on calendar
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Generate cohesive theme & color palette
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Multiple formats (TikTok, Instagram, etc.)
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      Save as draft and continue later
                    </li>
                  </ul>
                  <Button className="w-full group-hover:bg-primary/90">
                    Create Campaign
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">Or manage your existing content</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/campaigns">
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                View Campaigns
              </Button>
            </Link>
            <Link href="/posts">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                View All Posts
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
