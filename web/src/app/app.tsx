import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { AuthPage } from '@/components/auth-page';
import { DashboardLayout, OverviewPage, DealsPage, AIAssistantPage } from '@/features/dashboard';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/app/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="deals" element={<DealsPage />} />
        <Route path="ai-assistant" element={<AIAssistantPage />} />
      </Route>
      <Route
        path="/page-2"
        element={
          <div><Link to="/">Click here to go back to root page.</Link></div>
        }
      />
    </Routes>
  );
}

export default App;