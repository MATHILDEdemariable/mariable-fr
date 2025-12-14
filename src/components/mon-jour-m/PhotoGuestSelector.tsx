import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, Users, Search, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Guest {
  id: string;
  guest_first_name: string;
  guest_last_name: string;
  guest_type: string;
}

interface PhotoGuestSelectorProps {
  selectedGuestIds: string[];
  customNames: string[];
  onGuestsChange: (guestIds: string[], customNames: string[]) => void;
}

const PhotoGuestSelector: React.FC<PhotoGuestSelectorProps> = ({
  selectedGuestIds,
  customNames,
  onGuestsChange
}) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomName, setNewCustomName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wedding_guest_list')
        .select('id, guest_first_name, guest_last_name, guest_type')
        .eq('user_id', user.id)
        .order('guest_last_name', { ascending: true });

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Erreur chargement invités:', error);
    }
  };

  const filteredGuests = guests.filter(guest => {
    const fullName = `${guest.guest_first_name} ${guest.guest_last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const toggleGuest = (guestId: string) => {
    const newSelected = selectedGuestIds.includes(guestId)
      ? selectedGuestIds.filter(id => id !== guestId)
      : [...selectedGuestIds, guestId];
    onGuestsChange(newSelected, customNames);
  };

  const addCustomName = () => {
    if (newCustomName.trim() && !customNames.includes(newCustomName.trim())) {
      onGuestsChange(selectedGuestIds, [...customNames, newCustomName.trim()]);
      setNewCustomName('');
    }
  };

  const removeCustomName = (name: string) => {
    onGuestsChange(selectedGuestIds, customNames.filter(n => n !== name));
  };

  const removeGuest = (guestId: string) => {
    onGuestsChange(selectedGuestIds.filter(id => id !== guestId), customNames);
  };

  const getGuestName = (guestId: string) => {
    const guest = guests.find(g => g.id === guestId);
    return guest ? `${guest.guest_first_name} ${guest.guest_last_name}` : '';
  };

  const totalSelected = selectedGuestIds.length + customNames.length;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {/* Badges des personnes sélectionnées */}
      {selectedGuestIds.map(guestId => (
        <Badge key={guestId} variant="secondary" className="text-xs pr-1 gap-1">
          {getGuestName(guestId)}
          <button
            onClick={() => removeGuest(guestId)}
            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Badges des noms personnalisés */}
      {customNames.map(name => (
        <Badge key={name} variant="outline" className="text-xs pr-1 gap-1 bg-blue-50">
          {name}
          <button
            onClick={() => removeCustomName(name)}
            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {/* Bouton d'ajout */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground">
            <Plus className="h-3 w-3 mr-1" />
            {totalSelected === 0 ? 'Ajouter personnes' : 'Ajouter'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              Sélectionner des personnes
            </div>

            {/* Recherche dans la liste d'invités */}
            {guests.length > 0 && (
              <>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un invité..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9"
                  />
                </div>

                <ScrollArea className="h-40 border rounded-md p-2">
                  {filteredGuests.length > 0 ? (
                    <div className="space-y-1">
                      {filteredGuests.map(guest => (
                        <div
                          key={guest.id}
                          className="flex items-center gap-2 p-1.5 hover:bg-muted rounded cursor-pointer"
                          onClick={() => toggleGuest(guest.id)}
                        >
                          <Checkbox
                            checked={selectedGuestIds.includes(guest.id)}
                            onCheckedChange={() => toggleGuest(guest.id)}
                          />
                          <span className="text-sm flex-1">
                            {guest.guest_first_name} {guest.guest_last_name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {guest.guest_type === 'child' ? 'Enfant' : 'Adulte'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {searchTerm ? 'Aucun résultat' : 'Aucun invité dans la liste'}
                    </p>
                  )}
                </ScrollArea>
              </>
            )}

            {/* Ajout manuel */}
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                <UserPlus className="h-4 w-4" />
                Ajouter manuellement
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Nom de la personne..."
                  value={newCustomName}
                  onChange={(e) => setNewCustomName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomName()}
                  className="h-8 text-sm"
                />
                <Button size="sm" onClick={addCustomName} className="h-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PhotoGuestSelector;
