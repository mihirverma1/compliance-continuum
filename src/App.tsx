
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DbInitializer from "@/components/DbInitializer";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CompliancePage from "./pages/CompliancePage";
import RiskManagement from "./pages/RiskManagement";
import PoliciesPage from "./pages/PoliciesPage";
import AssetsPage from "./pages/AssetsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DbInitializer>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/compliance/*" element={<ProtectedRoute><CompliancePage /></ProtectedRoute>} />
              <Route path="/risk/*" element={<ProtectedRoute><RiskManagement /></ProtectedRoute>} />
              <Route path="/policies/*" element={<ProtectedRoute><PoliciesPage /></ProtectedRoute>} />
              <Route path="/assets" element={<ProtectedRoute><AssetsPage /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </DbInitializer>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
