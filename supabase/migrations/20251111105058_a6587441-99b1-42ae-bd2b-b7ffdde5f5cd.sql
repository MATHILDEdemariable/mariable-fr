-- Add guest_address column to wedding_rsvp_responses table
ALTER TABLE wedding_rsvp_responses 
ADD COLUMN guest_address TEXT;