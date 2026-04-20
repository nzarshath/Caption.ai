import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import CaptionGenerator from "./pages/CaptionGenerator";
import Architecture from "./pages/Architecture";
import DocumentVerify from "./pages/DocumentVerify";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import EmbedVerify from "./pages/EmbedVerify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isEmbed = location.pathname === "/embed";

  return (
    <>
      {!isEmbed && <Navbar />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/caption" element={<CaptionGenerator />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/verify" element={<DocumentVerify />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/embed" element={<EmbedVerify />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
