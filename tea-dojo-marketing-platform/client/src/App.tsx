import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ContentGeneration from "./pages/ContentGeneration";
import CalendarPage from "./pages/CalendarPage";
import Campaigns from "./pages/Campaigns";
import GenerateLanding from "./pages/GenerateLanding";
import CreatePost from "./pages/CreatePost";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignsList from "./pages/CampaignsList";
import PostsList from "./pages/PostsList";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/dashboard/calendar"} component={CalendarPage} />
      
      {/* Content Studio Flow */}
      <Route path={"/dashboard/generate"} component={GenerateLanding} />
      <Route path={"/dashboard/create-post"} component={CreatePost} />
      <Route path={"/dashboard/create-campaign"} component={CreateCampaign} />
      <Route path={"/dashboard/campaigns"} component={CampaignsList} />
      <Route path={"/dashboard/campaigns/:id"} component={CampaignsList} />
      <Route path={"/dashboard/posts"} component={PostsList} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
