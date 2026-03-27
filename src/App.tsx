import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Faculty from "./pages/Faculty";
import Institutes from "./pages/Institutes";
import InstituteDetails from "./pages/InstituteDetails";
import Sessions from "./pages/Sessions";
import Feedback from "./pages/Feedback";
import Alerts from "./pages/Alerts";
import Attendance from "./pages/Attendance";
import FeedbackForm from "./pages/FeedbackForm";
import ComingSoon from "./pages/ComingSoon";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/student-feedback" element={<FeedbackForm />} />

              {/* Protected Dashboard Routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/faculty" element={<Faculty />} />
                <Route path="/institutes" element={<Institutes />} />
                <Route path="/institutes/:id" element={<InstituteDetails />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/feedback/submit" element={<FeedbackForm showHeader={false} />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />

              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
