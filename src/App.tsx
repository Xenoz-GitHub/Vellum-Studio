import { useEffect } from 'react';
import { useAppStore } from './state/useAppStore';
import { TopNav } from './components/layout/TopNav';
import { AuthGuard } from './components/auth/AuthGuard';
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

  // Public routes that don't require authentication
  const isPublicRoute = route.page === 'landing' || route.page === 'share';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {!isPublicRoute && <TopNav />}
      
      {route.page === 'landing' && <LandingPage />}
      {route.page === 'share' && <ShareViewPage token={route.token} />}
      
      {/* Protected Routes - Require Authentication */}
      {route.page === 'dashboard' && (
        <AuthGuard>
          <TopNav />
          <DashboardPage />
        </AuthGuard>
      )}
      {route.page === 'templates' && (
        <AuthGuard>
          <TopNav />
          <TemplatesPage />
        </AuthGuard>
      )}
      {route.page === 'create' && (
        <AuthGuard>
          <TopNav />
          <GeneratorStudioPage />
        </AuthGuard>
      )}
      {route.page === 'editor' && (
        <AuthGuard>
          <TopNav />
          <EditorPage presentationId={route.id} />
        </AuthGuard>
      )}
      {route.page === 'profile' && (
        <AuthGuard>
          <TopNav />
          <ProfilePage />
        </AuthGuard>
      )}
      {route.page === 'admin' && (
        <AuthGuard>
          <TopNav />
          <AdminPage />
        </AuthGuard>
      )}
    </div>
  );
}
