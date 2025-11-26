-- Ajouter la colonne rsvp_status à la table wedding_guest_list
ALTER TABLE wedding_guest_list 
ADD COLUMN rsvp_status TEXT DEFAULT 'pending' 
CHECK (rsvp_status IN ('pending', 'confirmed', 'declined'));

COMMENT ON COLUMN wedding_guest_list.rsvp_status IS 'Statut de confirmation: pending (en attente), confirmed (confirmé), declined (absent)';
