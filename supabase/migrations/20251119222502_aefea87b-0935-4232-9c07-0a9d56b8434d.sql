-- Table pour stocker les métriques de performance dans le temps
CREATE TABLE IF NOT EXISTS performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  user_agent text,
  device_type text,
  created_at timestamptz DEFAULT now()
);

-- Index pour les queries d'analyse
CREATE INDEX IF NOT EXISTS idx_perf_metrics_page_metric 
  ON performance_metrics(page_path, metric_name, created_at DESC);

-- RLS Policy (admin uniquement)
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage performance metrics" ON performance_metrics;
CREATE POLICY "Admins can manage performance metrics"
  ON performance_metrics
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());