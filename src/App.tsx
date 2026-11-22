import { useEffect } from 'react';
import { useAppStore } from './state/useAppStore';
import { TopNav } from './components/layout/TopNav';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { GeneratorStudioPage } from './pages/GeneratorStudioPage';
import { EditorPage } from './pages/EditorPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { ShareViewPage } from './pages/ShareViewPage';

export default function App() {
  const { route, initAuth } = useAppStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      <TopNav />
      {route.page === 'landing' && <LandingPage />}
      {route.page === 'dashboard' && <DashboardPage />}
      {route.page === 'templates' && <TemplatesPage />}
      {route.page === 'create' && <GeneratorStudioPage />}
      {route.page === 'editor' && <EditorPage presentationId={route.id} />}
      {route.page === 'profile' && <ProfilePage />}
      {route.page === 'admin' && <AdminPage />}
      {route.page === 'share' && <ShareViewPage token={route.token} />}
    </div>
  );
}
