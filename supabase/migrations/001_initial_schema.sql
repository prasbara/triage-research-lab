-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES & AUTHENTICATION
-- =============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  participant_code text unique,
  role text not null default 'participant' check (role in ('admin', 'researcher', 'expert', 'participant', 'observer')),
  department text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- RESEARCH PROJECTS
-- =============================================
create table public.research_projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  title_id text, -- Indonesian title
  description text,
  hospital_identifier text,
  research_phase text default 'setup' check (research_phase in ('setup', 'pilot', 'main', 'completed', 'archived')),
  protocol_version text default '1.0',
  timezone text default 'Asia/Jakarta',
  language text default 'id',
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- SOP & TAXONOMY CONFIGURATION
-- =============================================
create table public.sop_versions (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.research_projects(id) on delete cascade,
  version text not null,
  name text not null,
  description text,
  is_active boolean default true,
  is_locked boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table public.complaint_categories (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.research_projects(id) on delete cascade,
  sop_version_id uuid references public.sop_versions(id),
  code text not null,
  name text not null,
  name_id text, -- Indonesian name
  subcategories jsonb default '[]',
  description text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table public.priority_levels (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.research_projects(id) on delete cascade,
  code text not null,
  name text not null,
  name_id text,
  level integer not null,
  is_high_priority boolean default false,
  requires_escalation boolean default false,
  response_time_hours integer,
  description text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table public.hospital_units (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.research_projects(id) on delete cascade,
  code text not null,
  name text not null,
  name_id text,
  unit_type text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- =============================================
-- COMPLAINT CASES
-- =============================================
create table public.complaint_cases (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.research_projects(id) on delete cascade,
  case_id text not null,
  complaint_text text not null,
  complaint_source_type text check (complaint_source_type in ('written', 'verbal', 'online', 'phone', 'other')),
  case_complexity text check (case_complexity in ('simple', 'moderate', 'complex')),
  complaint_length integer generated always as (char_length(complaint_text)) stored,
  source_type text default 'synthetic' check (source_type in ('real_deidentified', 'synthetic')),
  validation_status text default 'pending' check (validation_status in ('pending', 'in_review', 'validated', 'rejected', 'archived')),
  sop_version_id uuid references public.sop_versions(id),
  is_archived boolean default false,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(project_id, case_id)
);

-- =============================================
-- EXPERT ASSESSMENTS & GOLD STANDARD
-- =============================================
create table public.expert_assessments (
  id uuid default uuid_generate_v4() primary key,
  case_id uuid references public.complaint_cases(id) on delete cascade,
  expert_id uuid references public.profiles(id),
  assessment_round integer default 1,
  category text,
  subcategory text,
  priority text,
  target_unit text,
  escalation_required boolean default false,
  reasoning text,
  sop_reference text,
  confidence_level text check (confidence_level in ('low', 'medium', 'high')),
  is_submitted boolean default false,
  submitted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(case_id, expert_id, assessment_round)
);

create table public.gold_standards (
  id uuid default uuid_generate_v4() primary key,
  case_id uuid references public.complaint_cases(id) on delete cascade unique,
  category text not null,
  subcategory text,
  priority text not null,
  target_unit text not null,
  escalation_required boolean default false,
  high_priority_flag boolean default false,
  agreement_status text check (agreement_status in ('agreed', 'adjudicated')),
  expert1_id uuid references public.profiles(id),
  expert2_id uuid references public.profiles(id),
  adjudicator_id uuid references public.profiles(id),
  adjudication_notes text,
  kappa_value numeric(5,4),
  is_locked boolean default false,
  version integer default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.gold_standard_amendments (
  id uuid default uuid_generate_v4() primary key,
  gold_standard_id uuid references public.gold_standards(id),
  previous_values jsonb,
  new_values jsonb,
  amendment_reason text,
  amended_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- =============================================
-- EXPERIMENT SESSIONS
-- =============================================
create table public.experiment_sessions (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.research_projects(id) on delete cascade,
  session_code text unique not null,
  name text not null,
  description text,
  phase text default 'setup' check (phase in ('setup', 'pilot', 'main', 'completed', 'archived')),
  protocol_version text,
  sop_version_id uuid references public.sop_versions(id),
  random_seed bigint,
  number_of_cases integer,
  ai_provider text check (ai_provider in ('nvidia', 'gemini')),
  ai_model text,
  ai_temperature numeric(3,2) default 0.1,
  ai_max_tokens integer default 1024,
  prompt_version text default '1.0',
  is_locked boolean default false,
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.session_participants (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.experiment_sessions(id) on delete cascade,
  participant_id uuid references public.profiles(id),
  group_assignment text,
  is_active boolean default true,
  joined_at timestamptz default now(),
  unique(session_id, participant_id)
);

-- =============================================
-- EXPERIMENT ASSIGNMENTS (RANDOMIZATION)
-- =============================================
create table public.experiment_assignments (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.experiment_sessions(id) on delete cascade,
  participant_id uuid references public.profiles(id),
  case_id uuid references public.complaint_cases(id),
  task_order integer not null,
  method text not null check (method in ('manual', 'ai_assisted')),
  condition_block integer default 1,
  is_completed boolean default false,
  created_at timestamptz default now(),
  unique(session_id, participant_id, case_id, method)
);

-- =============================================
-- TRIAGE TASKS (OBSERVATIONS)
-- =============================================
create table public.triage_tasks (
  id uuid default uuid_generate_v4() primary key,
  assignment_id uuid references public.experiment_assignments(id),
  session_id uuid references public.experiment_sessions(id),
  participant_id uuid references public.profiles(id),
  case_id uuid references public.complaint_cases(id),
  task_order integer not null,
  method text not null check (method in ('manual', 'ai_assisted')),
  
  -- Timing
  task_started_at timestamptz,
  ai_requested_at timestamptz,
  ai_responded_at timestamptz,
  task_submitted_at timestamptz,
  duration_seconds numeric(10,3),
  ai_wait_seconds numeric(10,3),
  
  -- Status
  completion_status text default 'pending' check (completion_status in (
    'pending', 'in_progress', 'completed', 'interrupted', 'duplicate', 'invalid'
  )),
  interruption_reason text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- AI INFERENCES
-- =============================================
create table public.ai_inferences (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.triage_tasks(id),
  session_id uuid references public.experiment_sessions(id),
  case_id uuid references public.complaint_cases(id),
  
  -- Provider info
  provider text not null check (provider in ('nvidia', 'gemini')),
  model text not null,
  model_identifier text,
  prompt_version text,
  prompt_hash text,
  temperature numeric(3,2),
  max_tokens integer,
  
  -- Timing
  request_timestamp timestamptz,
  response_timestamp timestamptz,
  latency_ms integer,
  
  -- Token usage
  prompt_tokens integer,
  completion_tokens integer,
  total_tokens integer,
  
  -- Response
  raw_response text,
  parsed_response jsonb,
  validation_status text check (validation_status in ('valid', 'invalid', 'error', 'timeout')),
  error_message text,
  
  -- Parsed fields
  ai_category text,
  ai_subcategory text,
  ai_priority text,
  ai_target_unit text,
  ai_escalation_required boolean,
  ai_reasoning text,
  ai_sop_reference text,
  ai_requires_human_review boolean,
  
  created_at timestamptz default now()
);

-- =============================================
-- TRIAGE DECISIONS
-- =============================================
create table public.triage_decisions (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.triage_tasks(id) unique,
  inference_id uuid references public.ai_inferences(id),
  
  -- Final human decision
  final_category text not null,
  final_subcategory text,
  final_priority text not null,
  final_target_unit text not null,
  final_escalation_required boolean default false,
  reasoning text,
  
  -- AI recommendation tracking
  ai_recommendation_accepted boolean,
  any_field_revised boolean default false,
  
  -- Gold standard comparison (computed later)
  gs_category_match boolean,
  gs_priority_match boolean,
  gs_unit_match boolean,
  gs_escalation_match boolean,
  
  created_at timestamptz default now()
);

create table public.decision_revisions (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.triage_tasks(id),
  decision_id uuid references public.triage_decisions(id),
  field_name text not null,
  ai_value text,
  final_value text,
  revision_reason text,
  revised_at timestamptz default now()
);

-- =============================================
-- WORKLOAD ASSESSMENT (NASA-TLX)
-- =============================================
create table public.workload_responses (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.experiment_sessions(id),
  participant_id uuid references public.profiles(id),
  method text check (method in ('manual', 'ai_assisted')),
  assessment_level text check (assessment_level in ('task', 'block')) default 'block',
  task_id uuid references public.triage_tasks(id),
  
  -- Raw NASA-TLX (0-100 scale)
  mental_demand integer check (mental_demand between 0 and 100),
  physical_demand integer check (physical_demand between 0 and 100),
  temporal_demand integer check (temporal_demand between 0 and 100),
  performance integer check (performance between 0 and 100),
  effort integer check (effort between 0 and 100),
  frustration integer check (frustration between 0 and 100),
  
  -- Scoring
  raw_tlx_score numeric(6,2),
  is_weighted boolean default false,
  pairwise_weights jsonb,
  weighted_tlx_score numeric(6,2),
  
  is_finalized boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- STATISTICAL ANALYSES (IMPORTED RESULTS)
-- =============================================
create table public.statistical_analyses (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.experiment_sessions(id),
  analysis_type text not null,
  analysis_method text,
  software_version text,
  dataset_hash text,
  results jsonb,
  r_script_version text,
  import_notes text,
  verified_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- =============================================
-- AUDIT LOGS
-- =============================================
create table public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  action text not null,
  resource_type text,
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now()
);

-- =============================================
-- INDEXES
-- =============================================
create index idx_complaint_cases_project on public.complaint_cases(project_id);
create index idx_complaint_cases_status on public.complaint_cases(validation_status);
create index idx_expert_assessments_case on public.expert_assessments(case_id);
create index idx_experiment_assignments_session on public.experiment_assignments(session_id);
create index idx_experiment_assignments_participant on public.experiment_assignments(participant_id);
create index idx_triage_tasks_session on public.triage_tasks(session_id);
create index idx_triage_tasks_participant on public.triage_tasks(participant_id);
create index idx_triage_tasks_method on public.triage_tasks(method);
create index idx_ai_inferences_task on public.ai_inferences(task_id);
create index idx_ai_inferences_provider on public.ai_inferences(provider);
create index idx_triage_decisions_task on public.triage_decisions(task_id);
create index idx_workload_session on public.workload_responses(session_id);
create index idx_audit_logs_user on public.audit_logs(user_id);
create index idx_audit_logs_created on public.audit_logs(created_at desc);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.profiles enable row level security;
alter table public.research_projects enable row level security;
alter table public.complaint_cases enable row level security;
alter table public.expert_assessments enable row level security;
alter table public.gold_standards enable row level security;
alter table public.experiment_sessions enable row level security;
alter table public.triage_tasks enable row level security;
alter table public.ai_inferences enable row level security;
alter table public.triage_decisions enable row level security;
alter table public.audit_logs enable row level security;

-- Basic RLS: users can read their own profile
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Admins/researchers can see all profiles
create policy "Staff can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'researcher'))
  );

-- Complaint cases: participants can only read validated cases
create policy "Participants read validated cases" on public.complaint_cases
  for select using (
    validation_status = 'validated' or
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'researcher', 'expert'))
  );
create policy "Researchers manage cases" on public.complaint_cases
  for all using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'researcher'))
  );

-- Expert assessments: experts can only see their own (not others') while pending
create policy "Expert owns assessment" on public.expert_assessments
  for all using (expert_id = auth.uid());

-- Gold standards: not visible to participants  
create policy "Gold standard read policy" on public.gold_standards
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'researcher', 'expert'))
  );

-- Triage tasks: participants see only their own
create policy "Participant owns tasks" on public.triage_tasks
  for all using (
    participant_id = auth.uid() or
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'researcher'))
  );

-- AI inferences: not directly accessible to participants
create policy "AI inference access" on public.ai_inferences
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'researcher'))
  );

-- Audit logs: admin only
create policy "Admin reads audit logs" on public.audit_logs
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
create policy "System writes audit logs" on public.audit_logs
  for insert with check (true);

-- =============================================
-- TRIGGERS: auto-update updated_at
-- =============================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger complaint_cases_updated_at before update on public.complaint_cases
  for each row execute function public.handle_updated_at();
create trigger expert_assessments_updated_at before update on public.expert_assessments
  for each row execute function public.handle_updated_at();
create trigger gold_standards_updated_at before update on public.gold_standards
  for each row execute function public.handle_updated_at();
create trigger experiment_sessions_updated_at before update on public.experiment_sessions
  for each row execute function public.handle_updated_at();
create trigger triage_tasks_updated_at before update on public.triage_tasks
  for each row execute function public.handle_updated_at();
create trigger workload_responses_updated_at before update on public.workload_responses
  for each row execute function public.handle_updated_at();

-- =============================================
-- TRIGGER: Create profile on user signup
-- =============================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'participant')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
