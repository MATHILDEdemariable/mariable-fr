
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  User,
  LogOut,
  Phone,
  MessageSquare,
  CheckCircle,
  Mail,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import SEO from '@/components/SEO';

type VendorStatus = Database['public']['Enums']['vendor_status'];

interface Vendor {
  id: string;
  name: string;
  category: string;
  status: VendorStatus;
  location: string;
  lastContact?: Date;
}

const sampleVendors: Vendor[] = [
  {
    id: '1',
    name: 'Château des Fleurs',
    category: 'Lieu de réception',
    status: 'à contacter',
    location: 'Bordeaux',
  },
  {
    id: '2',
    name: 'Traiteur Délices',
    category: 'Traiteur',
    status: 'contactés',
    location: 'Paris',
    lastContact: new Date('2023-04-15'),
  },
  {
    id: '3',
    name: 'Photo Souvenirs',
    category: 'Photographe',
    status: 'en attente',
    location: 'Lyon',
    lastContact: new Date('2023-04-10'),
  },
  {
    id: '4',
    name: 'DJ Animation',
    category: 'DJ',
    status: 'réponse reçue',
    location: 'Nantes',
    lastContact: new Date('2023-04-05'),
  },
  {
    id: '5',
    name: 'Fleuriste Passion',
    category: 'Fleuriste',
    status: 'à valider',
    location: 'Toulouse',
    lastContact: new Date('2023-04-01'),
  },
];

const statusColorMap: Record<VendorStatus, string> = {
  'à contacter': 'bg-gray-100 text-gray-800',
  'contactés': 'bg-blue-100 text-blue-800',
  'en attente': 'bg-orange-100 text-orange-800',
  'réponse reçue': 'bg-green-100 text-green-800',
  'à valider': 'bg-purple-100 text-purple-800',
};

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [vendors, setVendors] = useState<Vendor[]>(sampleVendors);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(sampleVendors);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else {
        setUser(session.user);
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (session && event === 'SIGNED_IN') {
        setUser(session.user);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  
  useEffect(() => {
    let filtered = [...vendors];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vendor => vendor.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(vendor => vendor.category === categoryFilter);
    }
    
    setFilteredVendors(filtered);
  }, [statusFilter, categoryFilter, vendors]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    }
  };
  
  const updateVendorStatus = (id: string, newStatus: VendorStatus) => {
    const updatedVendors = vendors.map(vendor => {
      if (vendor.id === id) {
        return { ...vendor, status: newStatus, lastContact: newStatus === 'contactés' ? new Date() : vendor.lastContact };
      }
      return vendor;
    });
    
    setVendors(updatedVendors);
    toast({
      title: "Statut mis à jour",
      description: `Le statut du prestataire a été mis à jour`,
    });
  };
  
  // Get unique categories for filter
  const categories = [...new Set(vendors.map(vendor => vendor.category))];
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-wedding-cream/10">
      <SEO
        title="Dashboard | Mariable"
        description="Gérez vos prestataires de mariage et suivez l'avancement de vos démarches."
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif">Dashboard</h1>
            <p className="text-muted-foreground">
              Bienvenue {user?.user_metadata?.first_name || user?.email}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Déconnexion
          </Button>
        </div>
        
        <Tabs defaultValue="prestataires" className="space-y-6">
          <TabsList className="bg-wedding-cream/20">
            <TabsTrigger value="prestataires" className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white">
              Prestataires
            </TabsTrigger>
            <TabsTrigger value="profil" className="data-[state=active]:bg-wedding-olive data-[state=active]:text-white">
              Mon profil
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="prestataires" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Mes prestataires</CardTitle>
                <CardDescription>
                  Gérez vos prestataires de mariage et suivez l'avancement de vos démarches
                </CardDescription>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="w-full sm:w-1/2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="à contacter">À contacter</SelectItem>
                        <SelectItem value="contactés">Contactés</SelectItem>
                        <SelectItem value="en attente">En attente</SelectItem>
                        <SelectItem value="réponse reçue">Réponse reçue</SelectItem>
                        <SelectItem value="à valider">À valider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full sm:w-1/2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrer par catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="divide-y">
                  {filteredVendors.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-muted-foreground">Aucun prestataire trouvé avec ces critères</p>
                    </div>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <div key={vendor.id} className="py-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{vendor.name}</h3>
                              <Badge className={statusColorMap[vendor.status]}>
                                {vendor.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <span>{vendor.category}</span>
                              <span>•</span>
                              <span>{vendor.location}</span>
                              {vendor.lastContact && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Clock size={14} />
                                    <span>
                                      {vendor.lastContact.toLocaleDateString()}
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Select 
                              defaultValue={vendor.status} 
                              onValueChange={(value) => updateVendorStatus(vendor.id, value as VendorStatus)}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Changer le statut" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="à contacter">À contacter</SelectItem>
                                <SelectItem value="contactés">Contactés</SelectItem>
                                <SelectItem value="en attente">En attente</SelectItem>
                                <SelectItem value="réponse reçue">Réponse reçue</SelectItem>
                                <SelectItem value="à valider">À valider</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <div className="flex gap-2">
                              <Button size="icon" variant="outline">
                                <Phone size={16} />
                              </Button>
                              <Button size="icon" variant="outline">
                                <Mail size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Progression globale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Lieu", "Traiteur", "Photo & Vidéo", "Décoration", "Animation"].map((category) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {category === "Lieu" || category === "Photo & Vidéo" ? "Validé" : "En cours"}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-wedding-olive rounded-full" 
                          style={{ 
                            width: category === "Lieu" || category === "Photo & Vidéo" ? "100%" : 
                                   category === "Traiteur" ? "75%" : 
                                   category === "Animation" ? "50%" : "25%" 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Mon profil</CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Email</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Nom</h3>
                  <p className="text-muted-foreground">
                    {user?.user_metadata?.first_name || ""} {user?.user_metadata?.last_name || ""}
                  </p>
                </div>
                <Button className="bg-wedding-olive hover:bg-wedding-olive/90 mt-4">
                  Mettre à jour mon profil
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Paramètres du mariage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Date du mariage</h3>
                    <p className="text-muted-foreground">Non définie</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Lieu</h3>
                    <p className="text-muted-foreground">Non défini</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Budget estimé</h3>
                    <p className="text-muted-foreground">Non défini</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Nombre d'invités</h3>
                    <p className="text-muted-foreground">Non défini</p>
                  </div>
                </div>
                <Button className="bg-wedding-olive hover:bg-wedding-olive/90 mt-4">
                  Compléter les informations
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserDashboard;
