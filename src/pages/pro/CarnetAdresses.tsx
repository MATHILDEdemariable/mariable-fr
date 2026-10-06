import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, Mail, Phone, MapPin } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MariableCatalogList, type CatalogVendor } from '@/components/vendors/MariableCatalogDialog';
import ProQuickActions from '@/components/pro/ProQuickActions';

export interface AddressBookContact {
  id: string;
  company_name: string;
  contact_name: string | null;
  category: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  website: string | null;
  notes: string | null;
  prestataire_id: string | null;
  source: string;
}

const emptyContactForm = { company_name: '', contact_name: '', category: '', email: '', phone: '', city: '', notes: '' };

// Table créée récemment : types générés pas encore à jour
const addressBookTable = () => (supabase as any).from('pro_address_book');

export const saveCatalogVendorToAddressBook = async (vendor: CatalogVendor): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { error } = await addressBookTable().insert({
    owner_id: user.id,
    company_name: vendor.nom,
    category: vendor.categorie ?? 'Autre',
    email: vendor.email,
    phone: vendor.telephone,
    city: vendor.ville,
    website: vendor.site_web,
    prestataire_id: vendor.id,
    source: 'mariable',
  });
  if (error) {
    console.error('❌ CarnetAdresses: enregistrement catalogue impossible', error);
    return false;
  }
  return true;
};

const CarnetAdresses: React.FC = () => {
  const { t } = useTranslation('pro');
  const { toast } = useToast();
  const [contacts, setContacts] = useState<AddressBookContact[]>([]);
  const [contactForm, setContactForm] = useState(emptyContactForm);
  const [isSaving, setIsSaving] = useState(false);

  const loadContacts = async () => {
    const { data, error } = await addressBookTable()
      .select('id, company_name, contact_name, category, email, phone, city, website, notes, prestataire_id, source')
      .order('company_name');
    if (error) {
      console.error('❌ CarnetAdresses: chargement impossible', error);
      return;
    }
    setContacts(data ?? []);
  };

  useEffect(() => { loadContacts(); }, []);

  const handleAddContact = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!contactForm.company_name.trim()) return;
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié');
      const { error } = await addressBookTable().insert({
        owner_id: user.id,
        company_name: contactForm.company_name.trim(),
        contact_name: contactForm.contact_name.trim() || null,
        category: contactForm.category.trim() || 'Autre',
        email: contactForm.email.trim() || null,
        phone: contactForm.phone.trim() || null,
        city: contactForm.city.trim() || null,
        notes: contactForm.notes.trim() || null,
      });
      if (error) throw error;
      setContactForm(emptyContactForm);
      toast({ title: t('addressBook.added') });
      loadContacts();
    } catch (error) {
      console.error('❌ CarnetAdresses: ajout impossible', error);
      toast({ title: t('addressBook.error'), variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!window.confirm(t('addressBook.deleteConfirm'))) return;
    const { error } = await addressBookTable().delete().eq('id', contactId);
    if (error) {
      toast({ title: t('addressBook.error'), variant: 'destructive' });
      return;
    }
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
    toast({ title: t('addressBook.deleted') });
  };

  const handleSaveFromCatalog = async (vendor: CatalogVendor) => {
    const ok = await saveCatalogVendorToAddressBook(vendor);
    toast(ok ? { title: t('addressBook.saved') } : { title: t('addressBook.error'), variant: 'destructive' });
    if (ok) loadContacts();
    return ok;
  };

  const field = (key: keyof typeof emptyContactForm, type = 'text') => (
    <Input
      type={type}
      placeholder={t(`addressBook.${key === 'company_name' ? 'company' : key === 'contact_name' ? 'contact' : key}`)}
      value={contactForm[key]}
      onChange={(e) => setContactForm({ ...contactForm, [key]: e.target.value })}
      className="rounded-none"
      required={key === 'company_name'}
    />
  );

  return (
    <DashboardLayout variant="pro">
      <Helmet>
        <title>{t('addressBook.title')} | Mariable Pro</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="space-y-3">
          <h1 className="font-serif text-3xl text-foreground">{t('addressBook.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('addressBook.subtitle')}</p>
          <ProQuickActions showAddressBook={false} />
        </header>

        <Tabs defaultValue="mine">
          <TabsList className="rounded-none">
            <TabsTrigger value="mine" className="rounded-none">{t('addressBook.tabMine')} ({contacts.length})</TabsTrigger>
            <TabsTrigger value="catalog" className="rounded-none">{t('addressBook.tabCatalog')}</TabsTrigger>
          </TabsList>

          <TabsContent value="mine" className="space-y-4 mt-4">
            <form onSubmit={handleAddContact} className="grid gap-2 sm:grid-cols-3 bg-editorial-beige border border-border p-4">
              {field('company_name')}
              {field('category')}
              {field('contact_name')}
              {field('email', 'email')}
              {field('phone', 'tel')}
              {field('city')}
              <div className="sm:col-span-2">{field('notes')}</div>
              <Button type="submit" disabled={isSaving} className="rounded-none min-h-[44px]">
                <Plus className="h-4 w-4 mr-1" />{t('addressBook.add')}
              </Button>
            </form>

            {contacts.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">{t('addressBook.empty')}</p>
            ) : (
              <ul className="divide-y divide-border border border-border bg-background">
                {contacts.map((c) => (
                  <li key={c.id} className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0 space-y-1">
                      <p className="font-medium">
                        {c.company_name}
                        <span className="ml-2 text-xs px-2 py-0.5 bg-wedding-olive/10 text-wedding-olive">{c.category}</span>
                        {c.source === 'mariable' && <span className="ml-1 text-xs text-muted-foreground">· Mariable</span>}
                      </p>
                      {c.contact_name && <p className="text-sm text-muted-foreground">{c.contact_name}</p>}
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-1 hover:underline"><Mail className="h-3 w-3" />{c.email}</a>}
                        {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-1 hover:underline"><Phone className="h-3 w-3" />{c.phone}</a>}
                        {c.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.city}</span>}
                      </div>
                      {c.notes && <p className="text-xs italic text-muted-foreground">{c.notes}</p>}
                    </div>
                    <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={() => handleDeleteContact(c.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="catalog" className="mt-4">
            <MariableCatalogList actionLabel={t('addressBook.saveFromCatalog')} onPick={handleSaveFromCatalog} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CarnetAdresses;
