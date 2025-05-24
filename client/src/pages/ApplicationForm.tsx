import { useState, useEffect } from "react";
import { UserLayout } from "@/components/UserLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { AlertCircle, Calendar as CalendarIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Typen für die Bewerbung
interface Application {
  id: number;
  title: string;
  fullName: string;
  email: string;
  birthDate: Date | null;
  coverLetter: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
}

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    email: "",
    birthDate: null as Date | null,
    coverLetter: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeApplication, setActiveApplication] = useState<Application | null>(null);
  const { toast } = useToast();

  // Prüfe beim Laden, ob es eine gespeicherte Bewerbung gibt
  useEffect(() => {
    const storedApp = localStorage.getItem('userApplication');
    if (storedApp) {
      try {
        const app = JSON.parse(storedApp);
        // Datum-Strings in Date-Objekte umwandeln
        app.birthDate = app.birthDate ? new Date(app.birthDate) : null;
        app.submittedAt = new Date(app.submittedAt);
        setActiveApplication(app);
      } catch (e) {
        console.error("Fehler beim Laden der gespeicherten Bewerbung", e);
        localStorage.removeItem('userApplication');
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, birthDate: date || null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuliere API-Anfrage
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Username aus dem localStorage holen
      const storedUser = localStorage.getItem('currentUser');
      let username = "Benutzer";
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          username = user.username;
        } catch (e) {
          console.error("Fehler beim Lesen des Benutzernamens", e);
        }
      }
      
      // Neue Bewerbung erstellen
      const newApplication: Application = {
        id: Math.floor(Math.random() * 10000),
        ...formData,
        status: "pending",
        submittedAt: new Date()
      };
      
      // Bewerbung im localStorage speichern
      localStorage.setItem('userApplication', JSON.stringify(newApplication));
      setActiveApplication(newApplication);
      
      toast({
        title: "Bewerbung eingereicht",
        description: "Ihre Bewerbung wurde erfolgreich übermittelt. Wir werden Ihre Unterlagen sorgfältig prüfen.",
      });
    }, 1500);
  };

  const handleCancelApplication = () => {
    if (confirm("Sind Sie sicher, dass Sie Ihre Bewerbung stornieren möchten? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      localStorage.removeItem('userApplication');
      setActiveApplication(null);
      setIsSuccess(false);
      
      toast({
        title: "Bewerbung storniert",
        description: "Ihre Bewerbung wurde erfolgreich storniert.",
      });
    }
  };

  // Wenn der Benutzer bereits eine aktive Bewerbung hat
  if (activeApplication) {
    return (
      <UserLayout>
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Status Ihrer Bewerbung</AlertTitle>
          <AlertDescription>
            Ihre Bewerbung vom {format(activeApplication.submittedAt, 'dd.MM.yyyy')} ist aktuell im Status: 
            <span className={cn(
              "font-medium ml-1",
              activeApplication.status === "pending" && "text-yellow-600",
              activeApplication.status === "approved" && "text-green-600",
              activeApplication.status === "rejected" && "text-red-600"
            )}>
              {activeApplication.status === "pending" && "In Bearbeitung"}
              {activeApplication.status === "approved" && "Angenommen"}
              {activeApplication.status === "rejected" && "Abgelehnt"}
            </span>
          </AlertDescription>
        </Alert>

        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Ihre aktive Bewerbung</CardTitle>
            <CardDescription>
              Details Ihrer eingereichten Bewerbung
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Betreff</h3>
              <p>{activeApplication.title}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Name</h3>
              <p>{activeApplication.fullName}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">E-Mail</h3>
              <p>{activeApplication.email}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Geburtsdatum</h3>
              <p>{activeApplication.birthDate ? format(activeApplication.birthDate, 'dd.MM.yyyy') : 'Nicht angegeben'}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Anschreiben</h3>
              <p className="whitespace-pre-line">{activeApplication.coverLetter}</p>
            </div>
            <div className="pt-4">
              <Button 
                onClick={handleCancelApplication}
                variant="destructive"
                className="w-full"
              >
                Bewerbung stornieren
              </Button>
            </div>
          </CardContent>
        </Card>
      </UserLayout>
    );
  }

  if (isSuccess) {
    return (
      <UserLayout>
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-green-600 mb-4">Bewerbung eingereicht!</h2>
              <p className="text-gray-700 mb-8">
                Vielen Dank für Ihre Bewerbung. Wir werden Ihre Unterlagen sorgfältig prüfen und uns in Kürze bei Ihnen melden.
              </p>
              <div className="border-t border-gray-200 pt-6">
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-primary hover:bg-primary-dark"
                >
                  Zurück zur Übersicht
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Bewerbungsformular</CardTitle>
          <CardDescription className="text-center">
            Bitte füllen Sie alle Felder aus, um Ihre Bewerbung einzureichen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Vollständiger Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Max Mustermann"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">Geburtsdatum</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.birthDate ? (
                      format(formData.birthDate, "PPP", { locale: de })
                    ) : (
                      <span>Geburtsdatum auswählen</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.birthDate || undefined}
                    onSelect={handleDateChange}
                    initialFocus
                    locale={de}
                    disabled={(date) => date > new Date()}
                    fromYear={1900}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Betreff</Label>
              <Input
                id="title"
                name="title"
                placeholder="Betreff Ihrer Bewerbung"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Anschreiben</Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                placeholder="Bitte beschreiben Sie, warum Sie sich für diese Position interessieren..."
                value={formData.coverLetter}
                onChange={handleChange}
                className="min-h-[150px]"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full futuristic-btn text-white border-[#00669c] bg-gradient-to-r from-[#081018] to-[#0c1a2e] hover:from-[#0c1a2e] hover:to-[#1a3048] relative overflow-hidden group"
              disabled={isSubmitting}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.2)] to-transparent w-[200%] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
              <span className="relative z-10">
                {isSubmitting ? "Wird eingereicht..." : "Bewerbung einreichen"}
              </span>
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm text-gray-500 text-center">
          Ihre Daten werden gemäß unserer <a href="https://palkirzwei.de/datenschutz" target="_blank" rel="noopener noreferrer" className="text-[#00d2ff] hover:text-[#c4f6ff] border-b border-[#00669c] pb-px hover:border-[#00d2ff] transition-colors">Datenschutzerklärung</a> verarbeitet
        </CardFooter>
      </Card>
    </UserLayout>
  );
}
