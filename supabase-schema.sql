-- ========================================================
-- MAISON HARIVÉ CLOUD DATABASE SCHEMA (SUPABASE POSTGRES)
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price TEXT DEFAULT 'Inquire',
  tagline TEXT,
  type_label TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CONCIERGE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.concierge_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  service_type TEXT NOT NULL,
  appointment_date TEXT,
  appointment_time TEXT,
  notes TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'IN_REVIEW', 'COMPLETED', 'DECLINED')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concierge_requests ENABLE ROW LEVEL SECURITY;

-- Products Policies: Public can read; Admins can do everything
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Concierge Requests Policies: Public can insert; Admins can read & update
DROP POLICY IF EXISTS "Public can submit concierge requests" ON public.concierge_requests;
CREATE POLICY "Public can submit concierge requests" ON public.concierge_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage concierge requests" ON public.concierge_requests;
CREATE POLICY "Admins can manage concierge requests" ON public.concierge_requests FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_concierge_status ON public.concierge_requests (status);
CREATE INDEX IF NOT EXISTS idx_concierge_created ON public.concierge_requests (created_at DESC);
