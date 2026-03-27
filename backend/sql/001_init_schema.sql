-- AP ITI Governance System - Initial PostgreSQL Schema
-- Safe to run multiple times where possible (IF NOT EXISTS).

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- Enums
-- =========================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'dto', 'principal', 'faculty', 'student');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'faculty_status') THEN
        CREATE TYPE faculty_status AS ENUM ('active', 'inactive');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'half_day');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_method') THEN
        CREATE TYPE attendance_method AS ENUM ('face', 'manual', 'biometric');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'session_status') THEN
        CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sentiment_label') THEN
        CREATE TYPE sentiment_label AS ENUM ('positive', 'negative', 'neutral');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
        CREATE TYPE alert_type AS ENUM ('late_arrival', 'frequent_absence', 'low_engagement', 'negative_feedback', 'duration_mismatch');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_severity') THEN
        CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_status') THEN
        CREATE TYPE alert_status AS ENUM ('new', 'acknowledged', 'resolved');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type') THEN
        CREATE TYPE question_type AS ENUM ('mcq', 'short_answer', 'long_answer', 'true_false');
    END IF;
END $$;

-- =========================
-- Core Masters
-- =========================
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(120) NOT NULL,
    name_te VARCHAR(120),
    state_code VARCHAR(10) NOT NULL DEFAULT 'AP',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS institutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    iti_code VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_te VARCHAR(255),
    district_id UUID NOT NULL REFERENCES districts(id),
    principal_name VARCHAR(180),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geo_radius_m INTEGER NOT NULL DEFAULT 200,
    total_faculty INTEGER NOT NULL DEFAULT 0,
    total_students INTEGER NOT NULL DEFAULT 0,
    attendance_rate NUMERIC(5,2),
    engagement_score NUMERIC(5,2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cts_trade_code VARCHAR(80) UNIQUE,
    name_en VARCHAR(180) NOT NULL,
    name_te VARCHAR(180),
    nimi_reference VARCHAR(120),
    duration_months INTEGER,
    nscqf_level VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS institute_trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    shift VARCHAR(30),
    seats INTEGER NOT NULL DEFAULT 0,
    UNIQUE(institute_id, trade_id, academic_year, shift)
);

-- =========================
-- Identity and Access
-- =========================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(120) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,
    full_name_en VARCHAR(160) NOT NULL,
    full_name_te VARCHAR(160),
    role user_role NOT NULL,
    district_id UUID REFERENCES districts(id),
    institute_id UUID REFERENCES institutes(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp_hash TEXT NOT NULL,
    purpose VARCHAR(40) NOT NULL DEFAULT 'login',
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- People
-- =========================
CREATE TABLE IF NOT EXISTS faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    institute_id UUID NOT NULL REFERENCES institutes(id),
    trade_id UUID REFERENCES trades(id),
    employee_code VARCHAR(100) UNIQUE,
    phone VARCHAR(30),
    email VARCHAR(255),
    join_date DATE,
    status faculty_status NOT NULL DEFAULT 'active',
    face_enrolled BOOLEAN NOT NULL DEFAULT FALSE,
    attendance_rate NUMERIC(5,2),
    engagement_score NUMERIC(5,2),
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    institute_id UUID NOT NULL REFERENCES institutes(id),
    trade_id UUID REFERENCES trades(id),
    admission_no VARCHAR(100) UNIQUE,
    batch_year VARCHAR(20),
    phone VARCHAR(30),
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Attendance and Face/Geo
-- =========================
CREATE TABLE IF NOT EXISTS face_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    embedding BYTEA NOT NULL,
    model_version VARCHAR(80) NOT NULL,
    quality_score NUMERIC(5,2),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID NOT NULL REFERENCES faculty(id),
    institute_id UUID NOT NULL REFERENCES institutes(id),
    attendance_date DATE NOT NULL,
    check_in TIMESTAMPTZ,
    check_out TIMESTAMPTZ,
    status attendance_status NOT NULL,
    method attendance_method NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geo_distance_m NUMERIC(10,2),
    face_match_score NUMERIC(6,4),
    remarks TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(faculty_id, attendance_date)
);

-- =========================
-- Academic Sessions and Timetable
-- =========================
CREATE TABLE IF NOT EXISTS classroom_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID NOT NULL REFERENCES faculty(id),
    institute_id UUID NOT NULL REFERENCES institutes(id),
    trade_id UUID REFERENCES trades(id),
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    student_count INTEGER NOT NULL DEFAULT 0,
    engagement_score NUMERIC(5,2),
    faculty_present BOOLEAN NOT NULL DEFAULT TRUE,
    duration_minutes INTEGER GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (end_time - start_time))::INTEGER / 60
    ) STORED,
    status session_status NOT NULL DEFAULT 'scheduled',
    topic_name VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timetable_weeks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id UUID NOT NULL REFERENCES institutes(id),
    week_start DATE NOT NULL,
    generated_by UUID REFERENCES users(id),
    generation_mode VARCHAR(40) NOT NULL DEFAULT 'ai',
    approval_status VARCHAR(40) NOT NULL DEFAULT 'draft',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(institute_id, week_start)
);

CREATE TABLE IF NOT EXISTS timetable_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timetable_week_id UUID NOT NULL REFERENCES timetable_weeks(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    period_no SMALLINT NOT NULL CHECK (period_no > 0),
    trade_id UUID REFERENCES trades(id),
    faculty_id UUID REFERENCES faculty(id),
    topic_name VARCHAR(255),
    room_no VARCHAR(50),
    starts_at TIME,
    ends_at TIME,
    UNIQUE(timetable_week_id, day_of_week, period_no)
);

CREATE TABLE IF NOT EXISTS syllabus_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_id UUID NOT NULL REFERENCES trades(id) ON DELETE CASCADE,
    module_name VARCHAR(255) NOT NULL,
    topic_name VARCHAR(255) NOT NULL,
    week_no INTEGER,
    learning_objective TEXT,
    source_type VARCHAR(30) NOT NULL DEFAULT 'cts',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS syllabus_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id UUID NOT NULL REFERENCES institutes(id),
    trade_id UUID NOT NULL REFERENCES trades(id),
    topic_id UUID REFERENCES syllabus_topics(id),
    faculty_id UUID REFERENCES faculty(id),
    week_start DATE NOT NULL,
    planned_status VARCHAR(30) NOT NULL DEFAULT 'planned',
    actual_status VARCHAR(30) NOT NULL DEFAULT 'not_started',
    completion_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
    remarks TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(institute_id, trade_id, topic_id, week_start)
);

-- =========================
-- Feedback, NLP, Alerts
-- =========================
CREATE TABLE IF NOT EXISTS student_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    institute_id UUID NOT NULL REFERENCES institutes(id),
    trade_id UUID REFERENCES trades(id),
    faculty_id UUID REFERENCES faculty(id),
    feedback_date DATE NOT NULL DEFAULT CURRENT_DATE,
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
    feedback_text_en TEXT,
    feedback_text_te TEXT,
    sentiment sentiment_label,
    is_anonymous BOOLEAN NOT NULL DEFAULT TRUE,
    source VARCHAR(40) NOT NULL DEFAULT 'portal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feedback_id UUID UNIQUE NOT NULL REFERENCES student_feedback(id) ON DELETE CASCADE,
    sentiment_score NUMERIC(6,3),
    key_issues JSONB NOT NULL DEFAULT '[]'::jsonb,
    toxicity_score NUMERIC(6,3),
    model_version VARCHAR(80),
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS anomaly_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type alert_type NOT NULL,
    severity alert_severity NOT NULL,
    faculty_id UUID REFERENCES faculty(id),
    institute_id UUID NOT NULL REFERENCES institutes(id),
    district_id UUID REFERENCES districts(id),
    title VARCHAR(255),
    description_en TEXT NOT NULL,
    description_te TEXT,
    explanation_en TEXT,
    explanation_te TEXT,
    explainability_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status alert_status NOT NULL DEFAULT 'new',
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ
);

-- =========================
-- Question Bank and AI Generation
-- =========================
CREATE TABLE IF NOT EXISTS question_banks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id UUID NOT NULL REFERENCES institutes(id),
    trade_id UUID REFERENCES trades(id),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    source_name VARCHAR(255),
    file_path TEXT,
    parsed_payload JSONB,
    version_no INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS generated_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trade_id UUID REFERENCES trades(id),
    topic_id UUID REFERENCES syllabus_topics(id),
    generated_by UUID REFERENCES users(id),
    q_type question_type NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'medium',
    language_code VARCHAR(10) NOT NULL DEFAULT 'en',
    question_text TEXT NOT NULL,
    options JSONB,
    answer_key TEXT,
    rationale TEXT,
    model_name VARCHAR(120),
    model_version VARCHAR(80),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Reports and Audits
-- =========================
CREATE TABLE IF NOT EXISTS report_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requested_by UUID REFERENCES users(id),
    report_type VARCHAR(60) NOT NULL,
    filters JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'queued',
    file_path TEXT,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES users(id),
    action VARCHAR(120) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id UUID,
    before_json JSONB,
    after_json JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Indexes
-- =========================
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_district ON users(district_id);
CREATE INDEX IF NOT EXISTS idx_users_institute ON users(institute_id);

CREATE INDEX IF NOT EXISTS idx_institutes_district ON institutes(district_id);
CREATE INDEX IF NOT EXISTS idx_institute_trades_institute ON institute_trades(institute_id);
CREATE INDEX IF NOT EXISTS idx_institute_trades_trade ON institute_trades(trade_id);

CREATE INDEX IF NOT EXISTS idx_faculty_institute ON faculty(institute_id);
CREATE INDEX IF NOT EXISTS idx_faculty_trade ON faculty(trade_id);
CREATE INDEX IF NOT EXISTS idx_students_institute ON students(institute_id);
CREATE INDEX IF NOT EXISTS idx_students_trade ON students(trade_id);

CREATE INDEX IF NOT EXISTS idx_attendance_faculty_date ON attendance_records(faculty_id, attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_institute_date ON attendance_records(institute_id, attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_faculty_date ON classroom_sessions(faculty_id, session_date DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_institute_date ON classroom_sessions(institute_id, session_date DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_institute_date ON student_feedback(institute_id, feedback_date DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_faculty_date ON student_feedback(faculty_id, feedback_date DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_status_detected ON anomaly_alerts(status, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_institute_detected ON anomaly_alerts(institute_id, detected_at DESC);

CREATE INDEX IF NOT EXISTS idx_timetable_week ON timetable_weeks(institute_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_syllabus_progress_week ON syllabus_progress(institute_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_report_jobs_status ON report_jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor_time ON api_audit_logs(actor_user_id, created_at DESC);

-- =========================
-- updated_at trigger helper
-- =========================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_districts_updated_at ON districts;
CREATE TRIGGER trg_districts_updated_at BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_institutes_updated_at ON institutes;
CREATE TRIGGER trg_institutes_updated_at BEFORE UPDATE ON institutes FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_trades_updated_at ON trades;
CREATE TRIGGER trg_trades_updated_at BEFORE UPDATE ON trades FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_faculty_updated_at ON faculty;
CREATE TRIGGER trg_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_students_updated_at ON students;
CREATE TRIGGER trg_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_attendance_updated_at ON attendance_records;
CREATE TRIGGER trg_attendance_updated_at BEFORE UPDATE ON attendance_records FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_sessions_updated_at ON classroom_sessions;
CREATE TRIGGER trg_sessions_updated_at BEFORE UPDATE ON classroom_sessions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
