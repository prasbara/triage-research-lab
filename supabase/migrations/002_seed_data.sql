-- =============================================
-- SEED DATA: Initial taxonomy for demonstration
-- =============================================

-- Insert a default research project
insert into public.research_projects (id, name, title_id, description, hospital_identifier, research_phase, protocol_version, timezone, language, is_active)
values (
  'a0000000-0000-0000-0000-000000000001',
  'TRIAGE Research Lab',
  'Lab Riset Triase Keluhan Pasien',
  'Penelitian eksperimental tentang efektivitas AI dalam triase keluhan rumah sakit',
  'RSU-DEMO-001',
  'setup',
  '1.0',
  'Asia/Jakarta',
  'id',
  true
);

-- Insert default SOP version
insert into public.sop_versions (id, project_id, version, name, description, is_active, is_locked)
values (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  '1.0',
  'SOP Triase Keluhan v1.0',
  'Standar Operasional Prosedur untuk triase keluhan pasien rumah sakit',
  true,
  false
);

-- Insert complaint categories
insert into public.complaint_categories (project_id, sop_version_id, code, name, name_id, subcategories, is_active, sort_order)
values
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'PELAYANAN', 'Service Quality', 'Kualitas Pelayanan',
   '[{"code":"LAMBAT","name":"Slow Service","name_id":"Pelayanan Lambat"},{"code":"SIKAP","name":"Staff Attitude","name_id":"Sikap Petugas"},{"code":"INFO","name":"Information","name_id":"Informasi"}]',
   true, 1),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'FASILITAS', 'Facilities', 'Fasilitas',
   '[{"code":"KEBERSIHAN","name":"Cleanliness","name_id":"Kebersihan"},{"code":"PERALATAN","name":"Equipment","name_id":"Peralatan"},{"code":"RUANGAN","name":"Room","name_id":"Ruangan"}]',
   true, 2),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'ADMINISTRASI', 'Administration', 'Administrasi',
   '[{"code":"ANTRIAN","name":"Queue","name_id":"Antrian"},{"code":"TAGIHAN","name":"Billing","name_id":"Tagihan"},{"code":"REKAM_MEDIS","name":"Medical Records","name_id":"Rekam Medis"}]',
   true, 3),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'MEDIS', 'Medical Care', 'Perawatan Medis',
   '[{"code":"DIAGNOSIS","name":"Diagnosis","name_id":"Diagnosis"},{"code":"PENGOBATAN","name":"Treatment","name_id":"Pengobatan"},{"code":"KOMUNIKASI_DOKTER","name":"Doctor Communication","name_id":"Komunikasi Dokter"}]',
   true, 4),
  ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
   'LAINNYA', 'Other', 'Lainnya',
   '[{"code":"UMUM","name":"General","name_id":"Umum"}]',
   true, 5);

-- Insert priority levels
insert into public.priority_levels (project_id, code, name, name_id, level, is_high_priority, requires_escalation, response_time_hours, description, is_active, sort_order)
values
  ('a0000000-0000-0000-0000-000000000001', 'P1', 'Critical', 'Kritis', 1, true, true, 4, 'Keluhan kritis yang memerlukan tindakan segera', true, 1),
  ('a0000000-0000-0000-0000-000000000001', 'P2', 'High', 'Tinggi', 2, true, false, 24, 'Keluhan prioritas tinggi', true, 2),
  ('a0000000-0000-0000-0000-000000000001', 'P3', 'Medium', 'Sedang', 3, false, false, 72, 'Keluhan prioritas sedang', true, 3),
  ('a0000000-0000-0000-0000-000000000001', 'P4', 'Low', 'Rendah', 4, false, false, 168, 'Keluhan prioritas rendah', true, 4);

-- Insert hospital units
insert into public.hospital_units (project_id, code, name, name_id, unit_type, is_active, sort_order)
values
  ('a0000000-0000-0000-0000-000000000001', 'IGD', 'Emergency Department', 'Instalasi Gawat Darurat', 'clinical', true, 1),
  ('a0000000-0000-0000-0000-000000000001', 'RAWAT_INAP', 'Inpatient Ward', 'Rawat Inap', 'clinical', true, 2),
  ('a0000000-0000-0000-0000-000000000001', 'RAWAT_JALAN', 'Outpatient Clinic', 'Rawat Jalan', 'clinical', true, 3),
  ('a0000000-0000-0000-0000-000000000001', 'FARMASI', 'Pharmacy', 'Farmasi', 'support', true, 4),
  ('a0000000-0000-0000-0000-000000000001', 'LAB', 'Laboratory', 'Laboratorium', 'support', true, 5),
  ('a0000000-0000-0000-0000-000000000001', 'RADIOLOGI', 'Radiology', 'Radiologi', 'support', true, 6),
  ('a0000000-0000-0000-0000-000000000001', 'ADMIN', 'Administration', 'Administrasi', 'administrative', true, 7),
  ('a0000000-0000-0000-0000-000000000001', 'HUMAS', 'Public Relations', 'Hubungan Masyarakat', 'administrative', true, 8),
  ('a0000000-0000-0000-0000-000000000001', 'DIREKSI', 'Director Office', 'Direksi', 'management', true, 9);
