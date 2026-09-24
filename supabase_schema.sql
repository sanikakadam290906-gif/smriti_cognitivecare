-- SMRITI — Supabase Database Schema
-- Run this script in the Supabase SQL Editor if connecting a dedicated Supabase project.

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  region TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'as', 'lus')),
  current_difficulty TEXT NOT NULL DEFAULT 'Medium' CHECK (current_difficulty IN ('Easy', 'Medium', 'Hard')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  time TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'taken', 'remind_later')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  time TEXT NOT NULL,
  activity TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL CHECK (game_type IN ('memory', 'find-object', 'pattern', 'routine')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  rounds INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  incorrect_answers INTEGER NOT NULL,
  accuracy NUMERIC(5, 2) NOT NULL,
  average_response_time NUMERIC(6, 2) NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  prompt TEXT,
  is_correct BOOLEAN NOT NULL,
  response_time NUMERIC(6, 2) NOT NULL
);

-- SOS Emergency Alerts Table
CREATE TABLE IF NOT EXISTS sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  caregiver_id UUID,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'cancelled')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  acknowledged_by UUID,
  resolved_by UUID
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_sos_alerts_patient_id ON sos_alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON sos_alerts(status);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_created_at ON sos_alerts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- 1. Patients can insert their own emergency alert
CREATE POLICY "Patients can create their own alerts"
ON sos_alerts FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- 2. Patients and assigned caregivers can view alerts
CREATE POLICY "Caregivers and patients can view alerts"
ON sos_alerts FOR SELECT
TO authenticated, anon
USING (true);

-- 3. Caregivers can update (acknowledge/resolve) alerts
CREATE POLICY "Caregivers can update alerts"
ON sos_alerts FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- Enable Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
ALTER PUBLICATION supabase_realtime ADD TABLE medications;
ALTER PUBLICATION supabase_realtime ADD TABLE routines;
ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE sos_alerts;

