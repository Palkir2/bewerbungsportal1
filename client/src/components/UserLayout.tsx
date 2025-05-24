import { Button } from "@/components/ui/button";

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  // Benutzername aus dem localStorage lesen
  const username = (() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        return user.username;
      } catch (e) {
        return "Benutzer";
      }
    }
    return "Benutzer";
  })();

  return (
    <div className="flex flex-col min-h-screen interface-scanline">
      {/* Header in Raumschiff-Cockpit-Stil */}
      <header className="relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.8)] to-transparent"></div>
        
        <div className="futuristic-panel px-4 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 relative pulse-element">
                {/* Schiff-Logo mit futuristischem Effekt */}
                <div className="absolute inset-0 rounded-full glow-border overflow-hidden">
                  <div className="w-full h-full relative">
                    <img 
                      src="https://palkirzwei.de/wp-content/uploads/2024/05/cropped-PKZ_Logo_PNG_B_1280.png" 
                      alt="Raumschiff Logo" 
                      className="w-full h-full object-cover brightness-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-bl from-[#081018]/0 via-[#00d2ff]/5 to-[#081018]/0"></div>
                  </div>
                </div>
              </div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#48b1d9]">RAUMSCHIFF-TERMINAL</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-[#c4f6ff] text-sm px-3 py-1 border border-[#00669c] bg-[#081018] rounded-sm glow-border">
                BESATZUNGSMITGLIED: <span className="font-mono text-[#00d2ff]">{username}</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#00d2ff] hover:text-[#c4f6ff] hover:bg-[#081018] font-medium futuristic-btn"
                onClick={handleLogout}
              >
                ABMELDEN
              </Button>
            </div>
          </div>
        </div>
        
        {/* Dekorative blaue Linie unter dem Header */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent"></div>
      </header>
      
      {/* Hauptinhalt im Raumschiff-Design */}
      <main className="flex-1 relative z-10">
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="futuristic-card p-6">
            <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.5)] to-transparent"></div>
            {children}
            <div className="absolute bottom-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.3)] to-transparent"></div>
          </div>
        </div>
      </main>
      
      {/* Footer mit Raumschiff-Stil */}
      <footer className="relative">
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#00d2ff]/30 to-transparent"></div>
        <div className="futuristic-panel py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-[#48b1d9] text-sm">
              powered by Sora
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.6)] to-transparent"></div>
      </footer>
      
      {/* Dekorative Elemente für das Raumschiff-Feeling */}
      <div className="fixed top-1/4 left-0 w-2 h-24 bg-gradient-to-b from-transparent via-[#00d2ff]/20 to-transparent"></div>
      <div className="fixed top-1/3 right-0 w-2 h-24 bg-gradient-to-b from-transparent via-[#00d2ff]/20 to-transparent"></div>
    </div>
  );
}
