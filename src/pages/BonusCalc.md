## Bonus Calculation Formula

### 1. Basic Profit Calculation

```
Gross Profit = Project Budget - Operational Cost - Freelance Cost
Net Profit = Gross Profit - Total Bonus
```

### 2. Tier-Based Bonus Percentage System

Each project type has budget tiers with specific bonus percentage ranges:

#### Produksi (Production)

- **P0 Micro** (< 15 juta): 20% - 35%
- **P1 Small** (15-50 juta): 25% - 40%
- **P2 Medium** (50-100 juta): 25% - 45%
- **P3 Large** (100-200 juta): 30% - 50%
- **P4 Extra Large** (> 200 juta): 35% - 50%

#### Dokumentasi (Documentation)

- **D0 Micro** (< 10 juta): 20% - 35%
- **D1 Small** (10-30 juta): 25% - 40%
- **D2 Medium** (30-60 juta): 25% - 45%
- **D3 Large** (60-120 juta): 30% - 50%
- **D4 Extra Large** (> 120 juta): 35% - 50%

#### Motion

- **M0 Micro** (< 5 juta): 15% - 30%
- **M1 Small** (5-15 juta): 20% - 35%
- **M2 Medium** (15-30 juta): 25% - 40%
- **M3 Large** (> 30 juta): 30% - 45%

#### Design

- **G0 Micro** (< 3 juta): 15% - 30%
- **G1 Small** (3-10 juta): 20% - 35%
- **G2 Medium** (10-20 juta): 25% - 40%
- **G3 Large** (> 20 juta): 30% - 45%

### 3. Weight-Based Minimum Bonus System

The system ensures fair compensation through **Weight 8 Minimums** per tier:

| Project Type    | Tier  | Weight 8 Minimum |
| --------------- | ----- | ---------------- |
| **Produksi**    | P0    | Rp 500,000       |
|                 | P1-P2 | Rp 1,000,000     |
|                 | P3-P4 | Rp 1,250,000     |
| **Dokumentasi** | D0    | Rp 400,000       |
|                 | D1-D2 | Rp 700,000       |
|                 | D3-D4 | Rp 1,000,000     |
| **Motion**      | M0-M1 | Rp 125,000       |
|                 | M2-M3 | Rp 200,000       |
| **Design**      | G0-G1 | Rp 100,000       |
|                 | G2-G3 | Rp 150,000       |

#### Bonus Calculation Steps:

1. **Calculate initial bonus pool**: `Gross Profit × Bonus Percentage`
2. **Distribute by weight**: `Crew Bonus = (Job Weight / Total Weight) × Bonus Pool`
3. **Check Weight 8 minimum**: If any Class 8 job gets less than minimum, increase percentage
4. **Apply maximum cap**: Bonus percentage cannot exceed 50%
5. **Round to nearest 500**: Final bonus rounded to Rp 500

#### Example Calculation (Produksi P1):

```
Project Budget: Rp 30,000,000
Operational: Rp 5,000,000
Freelance: Rp 3,000,000
Gross Profit: Rp 22,000,000
Total Weight: 50

Initial Percentage: 30%
Initial Bonus Pool: Rp 6,600,000

Crew DOP (Weight 8):
- Initial: (8/50) × 6,600,000 = Rp 1,056,000
- Weight 8 Min (P1): Rp 1,000,000
- ✓ Above minimum, OK!

Final Total Bonus: Rp 6,600,000
Net Profit: Rp 15,400,000
```

### 4. Overtime Calculation Formula

**Universal formula across all project types:**

```
Bonus Dasar = Crew's job bonus (from calculation above)
Bonus per Jam = Bonus Dasar / 48
Overtime Bonus = Bonus per Jam × Jam Lembur
```

**Note**: 48 = 8 jam/hari × 6 hari kerja

#### Overtime Options:

1. **Libur + Bonus**:

   - Every 8 hours = 1 day off
   - Remaining hours paid in cash
   - Example: 10 jam → 1 libur + (2 × bonus per jam)

2. **Uang Penuh** (Full Cash):
   - No days off
   - All hours paid in cash
   - Example: 10 jam → (10 × bonus per jam)

#### Example Overtime Calculation:

```
Job: DOP
Bonus Dasar: Rp 3,000,000
Jam Lembur: 10 jam
Opsi: Libur + Bonus

Calculation:
- Bonus per Jam = 3,000,000 / 48 = Rp 62,500
- Libur Pengganti = 10 / 8 = 1 hari
- Sisa Jam = 10 - 8 = 2 jam
- Bonus Uang = 62,500 × 2 = Rp 125,000

Result:
- Libur: 1 hari
- Bonus: Rp 125,000
```

### 5. Rounding Rules

- All final bonuses rounded to nearest **Rp 500**
- Net profit includes remainder from rounding
- Example: Rp 1,234,567 → Rp 1,234,500 (sisa Rp 67 masuk net profit)

## System Architecture

### Frontend

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components (Dark theme by default)
- **Routing**: Wouter
- **State Management**: TanStack Query
- **UI Components**: Radix UI primitives with enhanced search and scroll functionalities for dropdowns.
- **Theme**: Professional dark theme with Discord-like aesthetics.

### Backend

- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Style**: REST API with JSON responses
- **Middleware**: Express for JSON parsing and CORS.

### Data Storage

- **Primary Data Source**: Google Sheets for real-time job positions and crew members, with a 30-second cache and auto-refresh. Supports project-type specific sheets.
- **Transactional Database**: PostgreSQL using Drizzle ORM for project calculations, crew assignments, and historical data.
- **Database Provider**: Neon Database (@neondatabase/serverless).
- **Schema Management**: Drizzle Kit.
- **Decimal Support**: NUMERIC(10,2) for bonus percentages.

### Core Features

- **Project Type Separation**: Supports Produksi, Dokumentasi, Design, and Motion projects with distinct rules and data sources.
- **Weighted Job Positions**: Classifies jobs (Class 1-10) with assigned weights for bonus calculation.
- **Calculation Engine**:
  - Formula: `gross profit = project budget - operational - freelance`, `net profit = gross profit - bonus`.
  - Tier-based bonus ranges for different project budgets (e.g., P0 Micro, P4 Extra Large).
  - Unified weight-based minimum bonus system across all project types to ensure fair compensation.
  - **Weight 8 Minimum Base per Tier** (Updated October 30, 2025):
    - **Produksi**: 500k (P0) / 1M (P1-P2) / 1.25M (P3-P4)
    - **Dokumentasi**: 400k (D0) / 700k (D1-D2) / 1M (D3-D4)
    - **Motion**: 125k (M0-M1) / 200k (M2-M3)
    - **Design**: 100k (G0-G1) / 150k (G2-G3)
  - Smart percentage adjustment: Increases bonus proportionally if minimums are not met for high-value jobs (e.g., Class 8), and applies maximum caps when exceeding minimums.
  - Absolute maximum bonus cap at 50%.
  - Rounds results to the nearest 500 IDR.
- **Authentication**: Simple password-based protection for database management.
- **UI Features**: Indonesian Rupiah formatting, searchable and multi-select components, overtime calculator, PDF report generation, responsive design, and toast notifications.
- **Data Management**: Export/Import JSON for project data, and history deduplication to prevent duplicate project entries.

## External Dependencies

### Core Framework Dependencies

- React
- Express.js
- TypeScript

### Database & ORM

- Drizzle ORM
- Neon Database (@neondatabase/serverless)
- PostgreSQL

### UI & Styling

- Tailwind CSS
- Radix UI
- Lucide React (icons)

### Development Tools

- Vite
- ESBuild

## Recent Changes (October 2025)

### Universal Overtime System - Fee from Crew Bonus (October 30, 2025)

- **MAJOR FIX**: Overtime calculation sekarang **UNIVERSAL** untuk semua project types!
- **Root Cause Identified**: Fee untuk overtime = **BONUS CREW** (bukan dari Google Sheets!)
- **Implementation**:
  - Pindahkan perhitungan overtime SETELAH bonus crew dihitung
  - Fee overtime = bonus crew untuk job tersebut
  - Fee per jam = bonus crew / 48
  - Tidak perlu kolom "Fee" di Google Sheets!
- **Formula**: `overtime_bonus = (crew_job_bonus / 48) × jam_lembur`
- **Example**:
  - Crew dapat bonus Rp 3.000.000 untuk job AVL Multi LED
  - Fee per jam = Rp 3.000.000 / 48 = Rp 62.500
  - Lembur 6 jam = Rp 62.500 × 6 = Rp 375.000
- **Benefit**: Overtime sekarang bekerja IDENTIK di Produksi, Dokumentasi, Motion, dan Design!
- **Backward Compatible**: Produksi & Dokumentasi yang sudah jalan tetap bekerja dengan rumus baru

### Motion & Design Complete Rebalance (October 30, 2025)

- **Problem Solved**: Project Motion dan Design mengalami profit minus atau terlalu rendah karena minimum bonus terlalu tinggi
- **Solution**: Menurunkan semua Weight 8 Minimum untuk Motion dan Design dengan **rasio 25%** (dari nilai awal)
- **Rasio Adjustment**: Semua tier Motion dan Design turun 75% untuk meningkatkan profit margin
- **Weight 8 Minimum Baru**:
  - **Motion**: M3=200k, M2=200k, M0-M1=125k (sebelumnya: 800k/800k/500k)
  - **Design**: G2-G3=150k, G0-G1=100k (sebelumnya: 600k/400k)
- **Bonus per Weight**: Motion M2/M3 = Rp 25k/weight, Design G2/G3 = Rp 18.75k/weight
- **Example Case**: Project Wintermar (budget 9.1jt, 116 total weight):
  - **Formula Lama (800k)**: Total Bonus Rp 11.6jt → Net Profit **-Rp 2.5jt** ❌
  - **Formula Baru (200k)**: Total Bonus Rp 2.9jt → Net Profit **+Rp 6.2jt** ✅ (profit naik 30%!)
- **Produksi & Dokumentasi**: Tidak berubah (tetap pakai nilai lama)
- **Benefit**: Project Motion dan Design sekarang highly profitable dengan crew assignment normal

### Export/Import JSON & History Deduplication (October 2025)

- **History Deduplication**: Projects with same name now update existing record instead of creating duplicates
- **Export to JSON**: Added "Export JSON" button in calculation results and history page to download project data as JSON file
- **Import from JSON**: Added "Import JSON" button in home page header to load project data from JSON file
- **Storage Logic**: New `saveProjectCalculation()` method checks for existing project name and updates if found
- **Data Preservation**: Export includes full calculation data with crew assignments and overtime information
- **User Workflow**: Supports project file management while maintaining auto-save history feature
