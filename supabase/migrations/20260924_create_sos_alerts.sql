-- Migration: Create SOS Emergency Alerts Table and Policies
-- Applied for: Smriti Cognitive Care Platform

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

-- Indexes for efficient caregiver dashboard polling and patient queries
CREATE INDEX IF NOT EXISTS idx_sos_alerts_patient_id ON sos_alerts(patient_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON sos_alerts(status);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_created_at ON sos_alerts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;

-- Drop previous policies if re-running
DROP POLICY IF EXISTS "Patients can create their own alerts" ON sos_alerts;
DROP POLICY IF EXISTS "Caregivers and patients can view alerts" ON sos_alerts;
DROP POLICY IF EXISTS "Caregivers can update alerts" ON sos_alerts;

-- 1. Patients can insert their own emergency alert
CREATE POLICY "Patients can create their own alerts"
ON sos_alerts FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- 2. Patients and caregivers can view alerts
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

-- Enable Realtime publication for sos_alerts
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sos_alerts;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    -- Table already added to publication
    NULL;
END $$;
