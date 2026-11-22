import { useAppStore } from '../state/useAppStore';

/**
 * Scrolls to a section on the public landing page from anywhere in the app.
 * If the user is not on the landing page, navigates there first.
 */
export function goToPublicSection(id: string) {
  const { route, navigate } = useAppStore.getState();

  if (route.page !== 'landing') {
    navigate({ page: 'landing' });
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 160);
    return;
  }

  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
