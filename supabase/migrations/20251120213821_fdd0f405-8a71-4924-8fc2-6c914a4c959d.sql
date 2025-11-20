-- ============================================
-- NETTOYAGE DATABASE : Suppression tables obsolètes
-- ============================================
-- Tables identifiées comme non utilisées dans le code

-- 1. vibe_wedding_conversations (remplacée par ai_wedding_conversations)
DROP TABLE IF EXISTS vibe_wedding_conversations CASCADE;

-- 2. payment_audit (non utilisée, logs Stripe gérés différemment)
DROP TABLE IF EXISTS payment_audit CASCADE;

-- Note: quiz_questions et quiz_scoring SONT utilisés par le quiz de mariage
-- et ne doivent PAS être supprimés