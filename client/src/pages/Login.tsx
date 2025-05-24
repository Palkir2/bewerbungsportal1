import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin-Anmeldung prüfen
    if (formData.username === "Admin" && formData.password === "123456") {
      const adminUser = { username: formData.username, role: "admin" };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      window.location.href = '/';
      return;
    }
    
    // Standard-Benutzer-Anmeldung
    if (formData.password.length >= 5) {
      const regularUser = { username: formData.username, role: "user" };
      localStorage.setItem('currentUser', JSON.stringify(regularUser));
      window.location.href = '/';
      return;
    }
    
    // Fehlerfall
    toast({
      title: "Anmeldung fehlgeschlagen",
      description: "Ungültiger Benutzername oder Passwort. Bitte versuchen Sie es erneut.",
      variant: "destructive",
    });
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center p-4 interface-scanline">
      {/* Äußere Begrenzung wie im Bild */}
      <div className="relative max-w-3xl w-full p-1 flex flex-col items-center cockpit-border">
        {/* Leuchtender Rahmen oben */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.8)] to-transparent"></div>
        
        {/* Hexagonale Form für die Seitenwände */}
        <div className="absolute top-6 left-0 h-[calc(100%-12px)] w-[2px] bg-gradient-to-b from-transparent via-[rgba(0,210,255,0.4)] to-transparent"></div>
        <div className="absolute top-6 right-0 h-[calc(100%-12px)] w-[2px] bg-gradient-to-b from-transparent via-[rgba(0,210,255,0.4)] to-transparent"></div>
        
        {/* Hauptcontainer in Cockpit-Form */}
        <div className="futuristic-card py-10 px-8 w-full backdrop-blur-sm">
          <div className="futuristic-card-inner">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {/* Futuristisches Logo/Icon */}
                <div className="hexagon-shape w-20 h-20 flex items-center justify-center pulse-element">
                  <div className="text-[#00d2ff] font-bold text-xl">PK-II</div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] to-[#48b1d9] mb-1">RAUMSCHIFF-TERMINAL</h1>
              <div className="h-px bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent my-2"></div>
              <p className="text-[#48b1d9] text-sm">ZUGANGSBESTÄTIGUNG ERFORDERLICH</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="futuristic-panel p-3">
                <Label htmlFor="username" className="block text-sm font-medium text-[#00d2ff] mb-1 ml-1">
                  BESATZUNGSMITGLIED-ID
                </Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#081018] text-[#c4f6ff] border-[#00669c] hover-glow"
                  placeholder="ID eingeben"
                />
              </div>

              <div className="futuristic-panel p-3">
                <Label htmlFor="password" className="block text-sm font-medium text-[#00d2ff] mb-1 ml-1">
                  SICHERHEITSCODE
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#081018] text-[#c4f6ff] border-[#00669c] hover-glow"
                  placeholder="Code eingeben"
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full futuristic-btn pulse-element text-white font-semibold"
                >
                  ZUGANG ANFORDERN
                </Button>
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#00669c] to-transparent"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 text-[#00d2ff] bg-[#081018]">ODER</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  type="button"
                  className="w-full bg-[#081018] text-[#c4f6ff] border border-[#00669c] hover:border-[#00d2ff] hover:bg-[#0c1a2e] transition-all"
                  onClick={() => toast({
                    title: "Google-Anmeldung",
                    description: "Diese Funktion ist derzeit nicht verfügbar.",
                  })}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  MIT GOOGLE ANMELDEN
                </Button>
                
                <Button 
                  type="button"
                  className="w-full bg-[#081018] text-[#c4f6ff] border border-[#00669c] hover:border-[#00d2ff] hover:bg-[#0c1a2e] transition-all"
                  onClick={() => toast({
                    title: "Discord-Anmeldung",
                    description: "Diese Funktion ist derzeit nicht verfügbar.",
                  })}
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                  MIT DISCORD ANMELDEN
                </Button>
              </div>
            </form>
            
            {/* Admin-Informationen wurden entfernt */}
            
            {/* Dekorative Elemente wie im Cockpit-Bild */}
            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="h-1 bg-[#00d2ff]/20 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent animate-[pulse_2s_ease-in-out_infinite]"></div>
              </div>
              <div className="h-1 bg-[#00d2ff]/20 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent animate-[pulse_1.5s_ease-in-out_infinite]"></div>
              </div>
              <div className="h-1 bg-[#00d2ff]/20 relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#00d2ff] to-transparent animate-[pulse_2.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Leuchtender Rahmen unten */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.5)] to-transparent"></div>
        
        {/* Sora Footer */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-[#48b1d9] text-xs">
          powered by Sora
        </div>
      </div>
    </div>
  );
}
