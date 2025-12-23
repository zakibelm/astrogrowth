import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NewCampaign from "./pages/NewCampaign";
import CampaignDetails from "./pages/CampaignDetails";
import LeadsList from "./pages/LeadsList";
import LeadDetails from "./pages/LeadDetails";
import ContentApproval from "./pages/ContentApproval";
import Campaigns from "./pages/Campaigns";
import Contents from "./pages/Contents";
import Profile from "./pages/Profile";
import AppLayout from "./components/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"}>
        <AppLayout><Dashboard /></AppLayout>
      </Route>
      <Route path={"/campaigns/new"}>
        <AppLayout><NewCampaign /></AppLayout>
      </Route>
      <Route path={"/campaigns/:id"}>
        <AppLayout><CampaignDetails /></AppLayout>
      </Route>
      <Route path={"/campaigns/:campaignId/leads"}>
        <AppLayout><LeadsList /></AppLayout>
      </Route>
      <Route path={"/lead/:id"}>
        <AppLayout><LeadDetails /></AppLayout>
      </Route>
      <Route path={"/content/:id"}>
        <AppLayout><ContentApproval /></AppLayout>
      </Route>
      <Route path={"/campaigns"}>
        <AppLayout><Campaigns /></AppLayout>
      </Route>
      <Route path={"/contents"}>
        <AppLayout><Contents /></AppLayout>
      </Route>
      <Route path={"/profile"}>
        <AppLayout><Profile /></AppLayout>
      </Route>
      <Route path={"/404"} component={NotFound} />
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
