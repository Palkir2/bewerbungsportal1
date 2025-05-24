import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import ApplicationForm from "@/pages/ApplicationForm";
import { useState, useEffect } from "react";

function Router() {
  // Vereinfachte Authentifizierungslogik für Demonstrationszwecke
  const [user, setUser] = useState<{role: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Prüfen, ob ein Benutzer im localStorage gespeichert ist
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Funktion zum Ausloggen
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    window.location.href = '/';
  };

  // Logout-Funktion global verfügbar machen
  (window as any).logout = handleLogout;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      {!user ? (
        <Route path="*" component={Login} />
      ) : (
        <>
          {user.role === "admin" ? (
            <Route path="/" component={AdminDashboard} />
          ) : (
            <Route path="/" component={ApplicationForm} />
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Router />
    </TooltipProvider>
  );
}

export default App;
