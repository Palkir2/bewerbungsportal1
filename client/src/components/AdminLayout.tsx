import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col min-h-screen interface-scanline">
      {/* Header im Raumschiff-Cockpit-Stil */}
      <header className="relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.8)] to-transparent"></div>
        
        <div className="futuristic-panel px-4 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="hexagon-shape w-8 h-8 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#00d2ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 0 1 0 18" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#48b1d9]">KAPITÄNS-TERMINAL</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-[#c4f6ff] text-sm px-3 py-1 border border-[#00669c] bg-[#081018] rounded-sm glow-border">
                KAPITÄN: <span className="font-mono text-[#00d2ff]">Admin</span>
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
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#48b1d9] text-sm">
            powered by Sora
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.6)] to-transparent"></div>
      </footer>
      
      {/* Dekorative Elemente für das Raumschiff-Feeling */}
      <div className="fixed top-1/4 left-0 w-2 h-36 bg-gradient-to-b from-transparent via-[#00d2ff]/20 to-transparent"></div>
      <div className="fixed top-2/4 right-0 w-2 h-36 bg-gradient-to-b from-transparent via-[#00d2ff]/20 to-transparent"></div>
      <div className="fixed bottom-1/4 left-0 w-2 h-24 bg-gradient-to-b from-transparent via-[#00d2ff]/20 to-transparent"></div>
    </div>
  );
}
