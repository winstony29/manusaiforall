/**
 * Drinknovate Marketing Platform - Landing Page
 * Design: Warm Tech Naturalism
 * - Warm cream backgrounds with forest green primary
 * - Terracotta and gold accents
 * - Fraunces display font, Source Sans 3 body
 * - Organic shapes and gentle animations
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Calendar, 
  BarChart3, 
  Palette, 
  Wand2, 
  Video, 
  Mail, 
  Share2,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Users,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">D</span>
            </div>
            <span className="font-display font-semibold text-xl text-foreground">Drinknovate</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#calendar" className="text-muted-foreground hover:text-foreground transition-colors">Calendar</a>
            <a href="#analytics" className="text-muted-foreground hover:text-foreground transition-colors">Analytics</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          <Link href="/generate">
            <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.96_0.02_75)] to-background" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-[oklch(0.75_0.08_75)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Marketing Platform
            </Badge>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              Create Stunning Content
              <span className="block text-gradient">in One Click</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Generate captivating social media posts, schedule campaigns, and track performance—all powered by AI that understands your brand.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  Start Creating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary/30 hover:bg-primary/5">
                Watch Demo
              </Button>
            </div>
          </motion.div>
          
          {/* Hero Image */}
          <motion.div 
            className="mt-16 relative"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-[oklch(0.60_0.12_45)]/20 to-[oklch(0.75_0.08_75)]/20 rounded-3xl blur-2xl" />
              <img 
                src="/images/hero-tea-ai.jpg" 
                alt="AI-powered bubble tea marketing" 
                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[16/9]"
              />
            </div>
          </motion.div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor" className="text-background"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { value: "50%", label: "Time Saved", icon: Clock },
              { value: "3x", label: "Engagement Boost", icon: TrendingUp },
              { value: "10+", label: "Platforms Supported", icon: Share2 },
              { value: "24/7", label: "AI Availability", icon: Zap }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center"
                variants={fadeInUp}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-secondary/30">
        <div className="container">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-[oklch(0.60_0.12_45)]/10 text-[oklch(0.50_0.12_45)] border-0">
              Powerful Features
            </Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need to
              <span className="text-gradient"> Dominate Social Media</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              From AI-powered content creation to smart scheduling and analytics, our platform has everything your marketing team needs.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Wand2,
                title: "AI Copywriting",
                description: "Generate persuasive, on-brand copy for Instagram, TikTok, and Facebook with one click. Customize tone and refine with natural language prompts.",
                image: "/images/content-generation.jpg"
              },
              {
                icon: Video,
                title: "Visual & Video Generation",
                description: "Create stunning images, short videos, and even merchandise designs. AI adapts to platform specifications automatically.",
                image: null
              },
              {
                icon: MessageSquare,
                title: "Video Script Generation",
                description: "Generate platform-specific scripts for TikTok and Reels, complete with scene descriptions, dialogue, and trending audio suggestions.",
                image: null
              },
              {
                icon: Calendar,
                title: "Smart Content Calendar",
                description: "AI-suggested campaign timelines that adapt based on performance. Dynamic scheduling adjusts when engagement drops.",
                image: "/images/calendar-planning.jpg"
              },
              {
                icon: BarChart3,
                title: "Performance Analytics",
                description: "Track engagement, reach, and conversions in real-time. Get data-driven recommendations for your content strategy.",
                image: "/images/analytics-dashboard.jpg"
              },
              {
                icon: Palette,
                title: "Brand Customization",
                description: "Define your brand voice, upload assets, and set visual guidelines. All generated content stays consistently on-brand.",
                image: "/images/brand-customization.jpg"
              },
              {
                icon: Mail,
                title: "Email Marketing",
                description: "Generate newsletters, promotional emails, and customer retention campaigns that drive engagement and sales.",
                image: null
              },
              {
                icon: Share2,
                title: "One-Click Posting",
                description: "Seamlessly post to TikTok, Instagram, and Facebook with a single click. Integrated API connections for instant publishing.",
                image: null
              },
              {
                icon: Users,
                title: "Event Ideas Generator",
                description: "Get AI suggestions for workshops, tasting sessions, and pop-up collaborations that bring your brand to life.",
                image: null
              }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group overflow-hidden">
                  {feature.image && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={feature.image} 
                        alt={feature.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader className={feature.image ? "pt-4" : ""}>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-display text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Thematic Workflow Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-[oklch(0.75_0.08_75)]/20 text-[oklch(0.55_0.08_75)] border-0">
                New Feature
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Thematic Campaign Workflow
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Don't generate everything at once. Preview your campaign theme first, iterate until it's perfect, then generate content across all formats.
              </p>
              
              <div className="space-y-6">
                {[
                  { step: "1", title: "Theme Preview", desc: "AI generates a high-level concept with sample visual and slogan" },
                  { step: "2", title: "Iterate & Refine", desc: "Provide feedback and adjust until the theme is perfect" },
                  { step: "3", title: "Multi-Format Generation", desc: "Generate content for all platforms based on approved theme" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-lg text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-[oklch(0.60_0.12_45)]/10 rounded-3xl blur-xl" />
              <div className="relative bg-card rounded-2xl shadow-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="space-y-4">
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-2">Campaign Theme Preview</div>
                    <div className="font-display text-xl font-semibold text-foreground mb-2">"Golden Fortune CNY"</div>
                    <p className="text-sm text-muted-foreground">A festive celebration featuring gold and red accents, prosperity themes, and limited-edition drinks.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">Regenerate</Button>
                    <Button size="sm" className="flex-1 bg-primary">Approve & Generate</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section id="calendar" className="py-20 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[oklch(0.60_0.12_45)]/10 rounded-full blur-3xl" />
        
        <div className="container relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-white/10 text-white border-0">
              <Calendar className="w-3 h-3 mr-1" />
              Smart Calendar
            </Badge>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Never Miss a Marketing Moment
            </h2>
            <p className="text-lg text-primary-foreground/80">
              AI-powered calendar with Singapore-specific events, suggested campaigns, and dynamic scheduling that adapts to your performance.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { month: "Feb", event: "Chinese New Year", campaign: "Huat with Tea Dojo" },
              { month: "Aug", event: "National Day", campaign: "Our Singapore, Our Tea" },
              { month: "Nov", event: "Deepavali", campaign: "Festival of Lights & Delights" },
              { month: "Dec", event: "Christmas", campaign: "A Jolly Tea-mas" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors"
              >
                <div className="text-sm text-primary-foreground/60 mb-1">{item.month}</div>
                <div className="font-display font-semibold text-lg mb-2">{item.event}</div>
                <div className="text-sm text-[oklch(0.75_0.08_75)]">{item.campaign}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-primary-foreground/70 mb-4">
              Plus: AI dynamically adjusts posting frequency based on engagement analytics
            </p>
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
              View Full Calendar
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <img 
                src="/images/analytics-dashboard.jpg" 
                alt="Analytics Dashboard"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-0">
                <BarChart3 className="w-3 h-3 mr-1" />
                Analytics
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Data-Driven Decisions Made Easy
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Track every metric that matters. Our dashboard provides real-time insights into engagement, reach, and conversions across all platforms.
              </p>
              
              <div className="space-y-4">
                {[
                  "Real-time engagement tracking",
                  "Cross-platform performance comparison",
                  "Trend analysis and forecasting",
                  "AI-powered content recommendations",
                  "Automated monthly reports"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-secondary/50 to-background">
        <div className="container">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Transform Your Marketing?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join Drinknovate in revolutionizing how beverage brands connect with their audience. Start creating AI-powered content today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generate">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  Get Started Free
                  <Sparkles className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary/30 hover:bg-primary/5">
                Schedule a Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-primary-foreground">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center">
                  <span className="text-foreground font-display font-bold text-lg">D</span>
                </div>
                <span className="font-display font-semibold text-xl">Drinknovate</span>
              </div>
              <p className="text-primary-foreground/70 text-sm">
                AI-powered marketing platform designed for innovative beverage brands.
              </p>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-display font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
            <p>&copy; 2026 Drinknovate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
