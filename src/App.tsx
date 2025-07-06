import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import NotFound from "./pages/NotFound";
import { PortfolioEditorPage } from '@/pages/PortfolioEditor'

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClient>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/editor/:portfolioId" element={<PortfolioEditorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClient>
  )
}

export default App
