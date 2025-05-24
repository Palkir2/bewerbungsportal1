import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { UserModal } from "@/components/UserModal";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Typdefinitionen für die lokale Speicherung
interface User {
  id: number;
  username: string;
  email: string | null;
  role: string;
  status: string;
}

interface InsertUser {
  username: string;
  password: string;
  email?: string | null;
  role?: string;
  status?: string;
}

// Neue Anwendungsschnittstelle entsprechend dem Benutzerformular
interface Application {
  id: number;
  title: string;
  fullName: string;
  email: string;
  birthDate: string | null; // ISO-Datumstring
  coverLetter: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string; // ISO-Datumstring
  userId?: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [selectedApplication, setSelectedApplication] = useState<Application | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const { toast } = useToast();

  // Beispiel-Benutzer und -Bewerbungen laden
  useEffect(() => {
    // Beispiel-Benutzer für die Demo
    setUsers([
      { id: 1, username: "Admin", email: "admin@example.com", role: "admin", status: "active" },
      { id: 2, username: "MaxMustermann", email: "max@example.com", role: "user", status: "active" },
      { id: 3, username: "EvaSchmidt", email: "eva@example.com", role: "user", status: "active" }
    ]);

    // Beispiel-Bewerbungen für die Demo
    setApplications([
      { 
        id: 1, 
        userId: 2,
        fullName: "Max Mustermann",
        email: "max@example.com",
        title: "Bewerbung als Software-Entwickler",
        birthDate: "1990-05-15",
        coverLetter: "Sehr geehrte Damen und Herren,\n\nIch bewerbe mich für die ausgeschriebene Position als Software-Entwickler. Mit meiner 5-jährigen Erfahrung in der Webentwicklung bin ich überzeugt, einen wertvollen Beitrag zu Ihrem Team leisten zu können.\n\nMit freundlichen Grüßen,\nMax Mustermann", 
        status: "pending", 
        submittedAt: new Date().toISOString() 
      },
      { 
        id: 2, 
        userId: 3,
        fullName: "Eva Schmidt",
        email: "eva@example.com",
        title: "Bewerbung als UX Designer",
        birthDate: "1992-08-23",
        coverLetter: "Sehr geehrte Damen und Herren,\n\nMit großem Interesse bewerbe ich mich auf die Position als UX Designer in Ihrem Unternehmen. Durch meine 3-jährige Erfahrung in der Gestaltung benutzerfreundlicher Oberflächen kann ich Ihr Team optimal unterstützen.\n\nMit freundlichen Grüßen,\nEva Schmidt", 
        status: "approved", 
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 Tage zurück
      }
    ]);
    
    // Prüfe, ob es bereits gespeicherte Anwendungen im localStorage gibt
    const storedApp = localStorage.getItem('userApplication');
    if (storedApp) {
      try {
        const app = JSON.parse(storedApp);
        // Prüfen, ob die Anwendung bereits in unserer Liste ist
        if (!applications.some(a => a.id === app.id)) {
          setApplications(prev => [...prev, app]);
        }
      } catch (e) {
        console.error("Fehler beim Laden der gespeicherten Bewerbung", e);
      }
    }
  }, []);

  const handleOpenAddUserModal = () => {
    setSelectedUser(undefined);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUserModal = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleOpenDeleteModal = (user: User) => {
    // Prüfen, ob es sich um den Admin-Account handelt
    if (user.username === "Admin") {
      toast({
        title: "Operation nicht erlaubt",
        description: "Der Admin-Account kann nicht gelöscht werden.",
        variant: "destructive"
      });
      return;
    }
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsApplicationModalOpen(true);
  };

  const handleUpdateApplicationStatus = (applicationId: number, newStatus: "pending" | "approved" | "rejected") => {
    // Aktualisiere den Status der Bewerbung
    const updatedApplications = applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);
    
    // Falls es sich um die Bewerbung handelt, die im localStorage gespeichert ist, aktualisiere auch diese
    const storedApp = localStorage.getItem('userApplication');
    if (storedApp) {
      try {
        const app = JSON.parse(storedApp);
        if (app.id === applicationId) {
          app.status = newStatus;
          localStorage.setItem('userApplication', JSON.stringify(app));
        }
      } catch (e) {
        console.error("Fehler beim Aktualisieren der gespeicherten Bewerbung", e);
      }
    }
    
    toast({
      title: "Status aktualisiert",
      description: `Der Status der Bewerbung wurde auf "${
        newStatus === "pending" ? "In Bearbeitung" : 
        newStatus === "approved" ? "Angenommen" : 
        "Abgelehnt"
      }" gesetzt.`
    });
  };
  
  const handleDeleteApplication = (applicationId: number) => {
    // Lösche die Bewerbung aus der Liste
    setApplications(applications.filter(app => app.id !== applicationId));
    
    // Falls es sich um die Bewerbung handelt, die im localStorage gespeichert ist, lösche auch diese
    const storedApp = localStorage.getItem('userApplication');
    if (storedApp) {
      try {
        const app = JSON.parse(storedApp);
        if (app.id === applicationId) {
          localStorage.removeItem('userApplication');
        }
      } catch (e) {
        console.error("Fehler beim Löschen der gespeicherten Bewerbung", e);
      }
    }
    
    toast({
      title: "Bewerbung gelöscht",
      description: "Die Bewerbung wurde erfolgreich gelöscht."
    });
  };

  const handleSaveUser = (userData: InsertUser & { id?: number }) => {
    if (userData.id) {
      // Benutzer aktualisieren
      const updatedUsers = users.map(u => 
        u.id === userData.id ? { ...u, ...userData } as User : u
      );
      setUsers(updatedUsers);
      toast({
        title: "Erfolg",
        description: "Benutzer wurde erfolgreich aktualisiert",
      });
    } else {
      // Neuen Benutzer erstellen
      const newUser: User = {
        id: Math.max(0, ...users.map(u => u.id)) + 1,
        username: userData.username,
        email: userData.email || null,
        role: userData.role || "user",
        status: userData.status || "active"
      };
      setUsers([...users, newUser]);
      toast({
        title: "Erfolg",
        description: "Benutzer wurde erfolgreich erstellt",
      });
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      // Prüfen, ob es sich um den Admin-Account handelt (als zusätzliche Sicherheit)
      if (selectedUser.username === "Admin") {
        toast({
          title: "Operation nicht erlaubt",
          description: "Der Admin-Account kann nicht gelöscht werden.",
          variant: "destructive"
        });
        setIsDeleteModalOpen(false);
        return;
      }
      
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      toast({
        title: "Erfolg",
        description: "Benutzer wurde erfolgreich gelöscht",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Aktiv</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inaktiv</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">In Bearbeitung</Badge>;
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Angenommen</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Abgelehnt</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
    }
  };

  // Format-Funktion für Datum
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd.MM.yyyy", { locale: de });
  };

  return (
    <AdminLayout>
      {/* Gemeinsames Panel für Navigation und Inhalt */}
      <div className="futuristic-panel w-full relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,210,255,0.5)] to-transparent"></div>
        
        <div className="flex flex-col lg:flex-row">
          {/* Linke Navigationsleiste - komplett neu gestaltet */}
          <div className="lg:w-64 border-r border-[#00669c]/30 bg-[#060c14]">
            <div className="p-3">
              <div className="mt-4 mb-16 text-center pt-6">
                <div className="text-[#00d2ff] font-bold text-base tracking-wider">KONTROLLPANEL</div>
              </div>
              <div className="flex flex-col space-y-6">
                <div 
                  onClick={() => setActiveTab("users")}
                  className={`cursor-pointer p-4 text-base font-bold text-center transition-all duration-300 hover:shadow-[0_0_6px_rgba(0,150,255,0.2)] ${
                    activeTab === "users" 
                      ? "bg-[#0c1a2e] text-[#00d2ff] border-[#00d2ff] border" 
                      : "text-[#89c4d9] border border-transparent hover:border-[#00669c]/50"
                  }`}
                >
                  Benutzerverwaltung
                </div>
                <div
                  onClick={() => setActiveTab("applications")}
                  className={`cursor-pointer p-4 text-base font-bold text-center transition-all duration-300 hover:shadow-[0_0_6px_rgba(0,150,255,0.2)] ${
                    activeTab === "applications" 
                      ? "bg-[#0c1a2e] text-[#00d2ff] border-[#00d2ff] border" 
                      : "text-[#89c4d9] border border-transparent hover:border-[#00669c]/50"
                  }`}
                >
                  Aktuelle Bewerbungen
                </div>
              </div>
            </div>
          </div>
          
          {/* Hauptinhalt */}
          <div className="flex-1 p-4">
            {activeTab === "users" ? (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-[#00d2ff] text-center">BENUTZERLISTE</h2>
                  <Button 
                    onClick={handleOpenAddUserModal} 
                    className="futuristic-btn text-white"
                  >
                    Benutzer hinzufügen
                  </Button>
                </div>
                
                <div className="overflow-hidden">
                  <table className="space-table w-full">
                    <thead>
                      <tr>
                        <th className="w-1/5 text-left px-4">Benutzername</th>
                        <th className="w-1/5 text-left px-4">E-Mail</th>
                        <th className="w-1/5 text-left px-4">Rolle</th>
                        <th className="w-1/5 text-left px-4">Status</th>
                        <th className="w-1/5 text-right px-4">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users && users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-4">{user.username}</td>
                            <td className="px-4">{user.email}</td>
                            <td className="px-4">
                              {user.role === "admin" ? "Administrator" : "Benutzer"}
                            </td>
                            <td className="px-4">
                              {getStatusBadge(user.status)}
                            </td>
                            <td className="px-4 text-right">
                              <div className="flex flex-col items-end space-y-2">
                                <Button 
                                  variant="ghost" 
                                  className="text-[#00d2ff] hover:text-[#c4f6ff] w-24 text-center" 
                                  onClick={() => handleOpenEditUserModal(user)}
                                >
                                  Bearbeiten
                                </Button>
                                {user.username !== "Admin" && (
                                  <Button 
                                    variant="ghost" 
                                    className="text-red-400 hover:text-red-300 w-24 text-center" 
                                    onClick={() => handleOpenDeleteModal(user)}
                                  >
                                    Löschen
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center">Keine Benutzer gefunden</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6 flex justify-center">
                  <h2 className="text-xl font-bold text-[#00d2ff] text-center">BEWERBUNGSLISTE</h2>
                </div>
                
                <div className="overflow-hidden">
                  <table className="space-table w-full">
                    <thead>
                      <tr>
                        <th className="w-1/5 text-left px-4">Bewerber</th>
                        <th className="w-1/5 text-left px-4">Betreff</th>
                        <th className="w-1/5 text-left px-4">Eingereicht am</th>
                        <th className="w-1/5 text-left px-4">Status</th>
                        <th className="w-1/5 text-right px-4">Aktionen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications && applications.length > 0 ? (
                        applications.map((application) => (
                          <tr key={application.id}>
                            <td className="px-4">
                              {application.fullName}
                            </td>
                            <td className="px-4 max-w-xs truncate">
                              {application.title}
                            </td>
                            <td className="px-4">
                              {formatDate(application.submittedAt)}
                            </td>
                            <td className="px-4">
                              <Select
                                defaultValue={application.status}
                                onValueChange={(value: "pending" | "approved" | "rejected") => 
                                  handleUpdateApplicationStatus(application.id, value)
                                }
                              >
                                <SelectTrigger className="w-[140px] bg-[#081018] border-[#00669c] text-[#c4f6ff]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#081018] border-[#00669c] text-[#c4f6ff]">
                                  <SelectItem value="pending" className="focus:bg-[#0c1a2e] focus:text-[#00d2ff]">In Bearbeitung</SelectItem>
                                  <SelectItem value="approved" className="focus:bg-[#0c1a2e] focus:text-[#00d2ff]">Angenommen</SelectItem>
                                  <SelectItem value="rejected" className="focus:bg-[#0c1a2e] focus:text-[#00d2ff]">Abgelehnt</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="px-4 text-right">
                              <div className="flex flex-col items-end space-y-2">
                                <Button 
                                  variant="ghost" 
                                  className="text-[#00d2ff] hover:text-[#c4f6ff] w-24 text-center"
                                  onClick={() => handleViewApplication(application)}
                                >
                                  Ansehen
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  className="text-red-400 hover:text-red-300 w-24 text-center"
                                  onClick={() => handleDeleteApplication(application.id)}
                                >
                                  Löschen
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center">Keine Bewerbungen gefunden</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        user={selectedUser}
      />
      
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
      />
      
      <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
        <DialogContent className="bg-[#081018] border-[#00669c] text-[#c4f6ff] max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#00d2ff]">
              {selectedApplication?.title}
            </DialogTitle>
            <DialogDescription className="text-[#c4f6ff]/70">
              Eingereicht von {selectedApplication?.fullName} am {selectedApplication && formatDate(selectedApplication.submittedAt)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#00d2ff]">Bewerberinformationen</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-[#c4f6ff]/70">Name:</span> {selectedApplication?.fullName}</p>
                <p><span className="text-[#c4f6ff]/70">E-Mail:</span> {selectedApplication?.email}</p>
                <p><span className="text-[#c4f6ff]/70">Geburtsdatum:</span> {selectedApplication?.birthDate ? formatDate(selectedApplication.birthDate) : 'Nicht angegeben'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2 text-[#00d2ff]">Bewerbungsstatus</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#c4f6ff]/70">Status:</span>
                  {selectedApplication && getStatusBadge(selectedApplication.status)}
                </div>
                <Select
                  defaultValue={selectedApplication?.status}
                  onValueChange={(value: "pending" | "approved" | "rejected") => 
                    selectedApplication && handleUpdateApplicationStatus(selectedApplication.id, value)
                  }
                >
                  <SelectTrigger className="w-[140px] bg-[#081018] border-[#00669c] text-[#c4f6ff]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#081018] border-[#00669c] text-[#c4f6ff]">
                    <SelectItem value="pending" className="focus:bg-[#0c1a2e] focus:text-[#00d2ff]">In Bearbeitung</SelectItem>
                    <SelectItem value="approved" className="focus:bg-[#0c1a2e] focus:text-[#00d2ff]">Angenommen</SelectItem>
                    <SelectItem value="rejected" className="focus:bg-[#0c1a2e] focus:text-[#00d2ff]">Abgelehnt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="py-4">
            <h3 className="text-sm font-medium mb-2 text-[#00d2ff]">Anschreiben</h3>
            <div className="mt-2 p-4 border border-[#00669c] rounded-sm bg-[#0c1a2e] text-[#c4f6ff] whitespace-pre-wrap">
              {selectedApplication?.coverLetter}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsApplicationModalOpen(false)}
              className="text-[#00d2ff] hover:text-[#c4f6ff] border border-[#00669c] mr-2"
            >
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}