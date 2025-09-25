import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Search, Mail, Check, Trash2, ExternalLink } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface VendorContactRequest {
  id: string;
  email: string;
  wedding_date_text: string;
  message: string;
  vendor_id: string;
  vendor_name?: string;
  status: 'pending' | 'processed';
  created_at: string;
  updated_at: string;
}

const VendorContactsAdmin = () => {
  const [contacts, setContacts] = useState<VendorContactRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [filteredContacts, setFilteredContacts] = useState<VendorContactRequest[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("vendor_contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        toast.error("Erreur lors du chargement des demandes de contact");
        console.error("Erreur chargement:", error);
        return;
      }
      
      if (data) {
        setContacts(data as VendorContactRequest[]);
        setFilteredContacts(data as VendorContactRequest[]);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des demandes:", err);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    let filtered = contacts;

    // Filtre par recherche
    if (debouncedSearchTerm) {
      filtered = filtered.filter(contact => 
        contact.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        contact.vendor_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    setFilteredContacts(filtered);
  }, [debouncedSearchTerm, contacts, statusFilter]);

  const handleMarkAsProcessed = async (id: string) => {
    try {
      const { error } = await supabase
        .from("vendor_contact_requests")
        .update({ status: 'processed' })
        .eq("id", id);
        
      if (error) {
        toast.error("Erreur lors de la mise à jour");
        return;
      }
      
      toast.success("Demande marquée comme traitée");
      fetchContacts();
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Une erreur est survenue");
    }
  };

  const handleMarkAsPending = async (id: string) => {
    try {
      const { error } = await supabase
        .from("vendor_contact_requests")
        .update({ status: 'pending' })
        .eq("id", id);
        
      if (error) {
        toast.error("Erreur lors de la mise à jour");
        return;
      }
      
      toast.success("Demande marquée comme en attente");
      fetchContacts();
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Une erreur est survenue");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
      try {
        const { error } = await supabase
          .from("vendor_contact_requests")
          .delete()
          .eq("id", id);
          
        if (error) {
          toast.error("Erreur lors de la suppression");
          return;
        }
        
        toast.success("Demande supprimée avec succès");
        fetchContacts();
      } catch (err) {
        console.error("Erreur:", err);
        toast.error("Une erreur est survenue");
      }
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copié dans le presse-papier");
  };

  const pendingCount = contacts.filter(c => c.status === 'pending').length;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-wedding-black">Demandes de contact</h2>
            <p className="text-gray-600">
              Gérer les demandes de contact des prestataires
              {pendingCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingCount} en attente
                </Badge>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Rechercher par email, prestataire ou message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="processed">Traitées</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-10">
          <p>Chargement des demandes...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Prestataire</TableHead>
                <TableHead>Date mariage</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-gray-50">
                  <TableCell>
                    {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{contact.email}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyEmail(contact.email)}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{contact.vendor_name || "Non spécifié"}</span>
                      {contact.vendor_id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(`/prestataire/${contact.vendor_id}`, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{contact.wedding_date_text}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={contact.message}>
                      {contact.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={contact.status === 'pending' ? 'destructive' : 'default'}>
                      {contact.status === 'pending' ? 'En attente' : 'Traitée'}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2 flex justify-end">
                    {contact.status === 'pending' ? (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsProcessed(contact.id)}
                        className="flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        Traiter
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsPending(contact.id)}
                      >
                        Remettre en attente
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredContacts.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              Aucune demande de contact trouvée
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorContactsAdmin;