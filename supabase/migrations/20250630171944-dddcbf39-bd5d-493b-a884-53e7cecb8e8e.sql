
-- Créer des politiques RLS pour l'accès public aux données de coordination

-- Politique pour wedding_coordination : permettre l'accès public en lecture seule
CREATE POLICY "Public read access to wedding coordination"
ON public.wedding_coordination FOR SELECT
TO anon, authenticated
USING (true);

-- Politique pour coordination_planning : permettre l'accès public en lecture seule
CREATE POLICY "Public read access to coordination planning"
ON public.coordination_planning FOR SELECT
TO anon, authenticated
USING (true);

-- Politique pour coordination_team : permettre l'accès public en lecture seule
CREATE POLICY "Public read access to coordination team"
ON public.coordination_team FOR SELECT  
TO anon, authenticated
USING (true);

-- Politique pour coordination_documents : permettre l'accès public en lecture seule (métadonnées seulement)
CREATE POLICY "Public read access to coordination documents metadata"
ON public.coordination_documents FOR SELECT
TO anon, authenticated
USING (true);
