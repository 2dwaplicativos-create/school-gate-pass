import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import QueuePage from "@/pages/QueuePage";
import StudentsPage from "@/pages/StudentsPage";
import GuardiansPage from "@/pages/GuardiansPage";
import PeriodsPage from "@/pages/PeriodsPage";
import RFIDReadersPage from "@/pages/RFIDReadersPage";
import LogsPage from "@/pages/LogsPage";
import SchoolSettingsPage from "@/pages/SchoolSettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fila" element={<QueuePage />} />
            <Route path="/alunos" element={<StudentsPage />} />
            <Route path="/responsaveis" element={<GuardiansPage />} />
            <Route path="/periodos" element={<PeriodsPage />} />
            <Route path="/leitores" element={<RFIDReadersPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/configuracoes" element={<SchoolSettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
