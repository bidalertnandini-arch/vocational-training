# AP ITI Faculty Monitoring System - POC Implementation Plan

## Project Overview
**Objective:** AI-enabled faculty monitoring solution for Andhra Pradesh ITIs.
**Focus:** Guntur District (POC).
**Goal:** Address persistent challenges in faculty discipline, punctuality, and classroom delivery quality.

## POC Scope & Success Criteria
- **Location:** Guntur District (8 Government ITIs).
- **Duration:** 12 Weeks.
- **Key Metrics:**
  - Attendance Integrity (Face + Geo-tagging).
  - Classroom Engagement Scores (Computer Vision).
  - Anomaly Detection Rate (Disciplinary breaches).

## System Architecture

### 1. Attendance & Access Control
- **Current Status:** ✅ Implemented.
- **Features:**
  - `Attendance.tsx`: Web-based Facial Recognition.
  - Geo-fencing: Captures Lat/Long and verifies against Institute coordinates.
  - Tamper-proof logs: Stored in `attendanceRecords`.

### 2. Classroom Quality Monitoring (AI)
- **Current Status:** 🚧 Simulated (Mock Data).
- **Next Steps:**
  - Implement `ClassroomAI.ts` service layout.
  - Simulate "Video Feed" processing pipeline.
  - Generate "Engagement Scores" based on session duration and student attention proxy.

### 3. Reporting & Dashboards
- **Current Status:** ✅ Implemented.
- **Features:**
  - **Principal Dashboard:** Shows faculty presence, live feedback, and anomalies.
  - **DTO Dashboard:** District-level aggregation (Guntur District focus).
  - **Attendance Log:** Real-time stream of check-ins.

### 4. HR & Payroll Integration
- **Current Status:** ❌ Pending.
- **Requirement:** "Automated time and attendance tracking integrated with HR/payroll".
- **Action:** Create `PayrollService.ts` to transform attendance data into payroll-ready formats (CSV/JSON exports).

## Technical Stack
- **Frontend:** React (Vite) + Tailwind CSS + shadcn/ui.
- **Biometrics:** `react-webcam` + FaceAPI (simulated for web).
- **Deployment:** Ready for State/NIC server deployment (Static Build).

## Data Privacy & Governance
- All faculty/student data is anonymized in current mock datasets.
- Architecture supports on-premise deployment to meet strict privacy constraints.

---
*Created on 2026-01-10*
