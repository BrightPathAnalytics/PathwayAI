import { ThemeProvider } from './theme-provider';
import { Sidebar } from './sidebar-new/sidebar';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';

export function Layout() {
  const { signOut } = useAuthenticator();

  return (
    <ThemeProvider defaultTheme="light">
      <SidebarProvider>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            <div className="flex h-full flex-col">
              <header className="border-b p-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Pathway AI</h1>
                <button 
                  onClick={signOut} 
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                >
                  Sign out
                </button>
              </header>
              <div className="flex-1 overflow-auto">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
} 