import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Search, Mail, Eye, EyeOff, Trash2, Download } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface VendorMessage {
  id: string;
  user_id: string;
  vendor_id: string;
  vendor_name: string;
  message: string;
  user_email: string | null;
  read_at: string | null;
  created_at: string;
}

const VendorMessagesAdmin = () => {
  const [messages, setMessages] = useState<VendorMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [filteredMessages, setFilteredMessages] = useState<VendorMessage[]>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("vendor_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erreur lors du chargement des messages");
        console.error("❌ fetchMessages error:", error);
        return;
      }

      if (data) {
        setMessages(data as VendorMessage[]);
        setFilteredMessages(data as VendorMessage[]);
      }
    } catch (err) {
      console.error("❌ fetchMessages exception:", err);
      toast.error("Erreur lors du chargement");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  useEffect(() => {
    let filtered = messages;

    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(m =>
        m.vendor_name?.toLowerCase().includes(term) ||
        m.user_email?.toLowerCase().includes(term) ||
        m.message?.toLowerCase().includes(term)
      );
    }

    if (statusFilter === "unread") {
      filtered = filtered.filter(m => !m.read_at);
    } else if (statusFilter === "read") {
      filtered = filtered.filter(m => !!m.read_at);
    }

    setFilteredMessages(filtered);
  }, [debouncedSearchTerm, messages, statusFilter]);

  const handleToggleRead = async (id: string, currentlyRead: boolean) => {
    try {
      const { error } = await supabase
        .from("vendor_messages")
        .update({ read_at: currentlyRead ? null : new Date().toISOString() })
        .eq("id", id);

      if (error) { toast.error("Erreur lors de la mise à jour"); return; }

      setMessages(prev =>
        prev.map(m => m.id === id ? { ...m, read_at: currentlyRead ? null : new Date().toISOString() } : m)
      );
      toast.success(currentlyRead ? "Marqué comme non lu" : "Marqué comme lu");
    } catch (err) {
      console.error("❌ handleToggleRead error:", err);
      toast.error("Une erreur est survenue");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      const { error } = await supabase.from("vendor_messages").delete().eq("id", id);
      if (error) { toast.error("Erreur lors de la suppression"); return; }
      toast.success("Message supprimé");
      fetchMessages();
    } catch (err) {
      console.error("❌ handleDelete error:", err);
      toast.error("Une erreur est survenue");
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copié");
  };

  const handleExportCSV = () => {
    const headers = ["Date", "Email utilisateur", "Prestataire", "Message", "Statut"];
    const rows = filteredMessages.map(m => [
      new Date(m.created_at).toLocaleDateString("fr-FR"),
      m.user_email || "Non renseigné",
      m.vendor_name,
      `"${m.message.replace(/"/g, '""')}"`,
      m.read_at ? "Lu" : "Non lu",
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `messages-prestataires-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const unreadCount = messages.filter(m => !m.read_at).length;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-wedding-black">Messages utilisateurs</h2>
            <p className="text-gray-600">
              Messages envoyés via les fiches prestataires
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">{unreadCount} non lu{unreadCount > 1 ? "s" : ""}</Badge>
              )}
            </p>
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
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
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="unread">Non lus</SelectItem>
              <SelectItem value="read">Lus</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-10"><p>Chargement...</p></div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Email utilisateur</TableHead>
                <TableHead>Prestataire</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((msg) => (
                <TableRow key={msg.id} className={!msg.read_at ? "bg-blue-50/50" : ""}>
                  <TableCell>{new Date(msg.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{msg.user_email || "Non renseigné"}</span>
                      {msg.user_email && (
                        <Button size="sm" variant="ghost" onClick={() => handleCopyEmail(msg.user_email!)}>
                          <Mail className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{msg.vendor_name}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="text-left p-0 h-auto">
                          <div className="max-w-xs truncate text-sm">{msg.message}</div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Message complet</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div><p className="font-semibold">Email :</p><p>{msg.user_email || "Non renseigné"}</p></div>
                          <div><p className="font-semibold">Prestataire :</p><p>{msg.vendor_name}</p></div>
                          <div><p className="font-semibold">Date :</p><p>{new Date(msg.created_at).toLocaleString("fr-FR")}</p></div>
                          <div><p className="font-semibold">Message :</p><p className="whitespace-pre-wrap">{msg.message}</p></div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Badge variant={msg.read_at ? "default" : "destructive"}>
                      {msg.read_at ? "Lu" : "Non lu"}
                    </Badge>
                  </TableCell>
                  <TableCell className="space-x-2 flex justify-end">
                    <Button size="sm" variant="outline" onClick={() => handleToggleRead(msg.id, !!msg.read_at)}>
                      {msg.read_at ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(msg.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredMessages.length === 0 && !isLoading && (
            <div className="text-center py-8 text-gray-500">Aucun message trouvé</div>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorMessagesAdmin;
