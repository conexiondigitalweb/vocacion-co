-- ============================================================
-- vocacion.co — SQL Setup para Supabase SQL Editor
-- Ejecutar completo de una sola vez
-- ============================================================

-- Tabla principal de resultados
CREATE TABLE IF NOT EXISTS test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_code TEXT UNIQUE NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  answers JSONB NOT NULL,
  scores JSONB NOT NULL,
  top_type TEXT NOT NULL,
  top_careers TEXT[] NOT NULL,
  region TEXT,
  modalidad_pref TEXT,
  situacion_economica TEXT,
  modo_exploracion TEXT DEFAULT 'AMBAS',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_anon" ON test_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "read_by_share_code" ON test_results
  FOR SELECT USING (true);

-- Tabla de analytics (fase 2)
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL,
  region TEXT,
  top_career TEXT,
  modo_exploracion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_anon_analytics" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_test_results_share_code
  ON test_results (share_code);

CREATE INDEX IF NOT EXISTS idx_test_results_created_at
  ON test_results (created_at DESC);
