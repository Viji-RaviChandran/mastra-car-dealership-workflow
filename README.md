# Autonomous Enterprise Dealership Intelligence System

[![Framework: Mastra](https://img.shields.io/badge/Framework-Mastra-8A2BE2.svg)](https://mastra.ai/)
[![Database: SQL Server](https://img.shields.io/badge/Database-SQL_Server-CC292B.svg)](https://www.microsoft.com/sql-server)
[![Language: JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A deterministic, multi-agent AI system built on the **Mastra framework** designed to process natural language queries across complex automotive dealership datasets. The architecture decouples query comprehension, domain-specific metric formulation, schema-aware SQL generation, and contextual response formatting across specialized agents and tools.

---

┌──────────────────────────────────────────────────────────────────────────────┐
│     **TL;DR (30-Second Overview)**                                           |
│  • **What it is:** A Node.js system that answers car dealership questions    │
│    in natural language.                                                      │
│  • **How it works:** It converts human questions into SQL queries            │
│    and fetches real-time data.                                               │
│  • **Tech Stack:** Mastra framework, SQL Server, and OpenRouter LLMs.        │
│  • **Architecture:** 4-step sequential workflow with 3 agents and 3 tools.   |            
└──────────────────────────────────────────────────────────────────────────────┘             

---

## Architecture Overview

The system executes a strictly typed, 4-stage pipeline that guarantees SQL syntax validity, bounds query parameters to authorized schemas, and filters untrusted or destructive input:

                      User Prompt
                          │
                          ▼
            ┌───────────────────────────┐
            │ Step 1: Semantic Analysis │
            │     (guardrailAgent)      │
            └─────────────┬─────────────┘
                          │ (Sanitized & Intent Verified)
                          ▼
            ┌───────────────────────────┐
            │   Step 2: SQL Builder     │
            │       (sqlGenAgent)       │
            └──────┬──────┬──────┬──────┘
                   │      │      │
    ┌──────────────┘      │      └──────────────┐
    ▼                     ▼                     ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────────┐
│  Dealership   │  │    Vehicle    │  │     Regional      │
│ LocationsTool │  │  CatalogTool  │  │  PromotionsTool   │
└───────┬───────┘  └───────┬───────┘  └─────────┬─────────┘
        │                  │                    │
        └────────────┐     │     ┌──────────────┘
                     ▼     ▼     ▼
              [ Extracted Schema Metrics ]
                           │
                           ▼
            ┌───────────────────────────┐
            │ Step 3: DB Execution      │
            │   (Safe Driver Engine)    │
            └─────────────┬─────────────┘
                          │ (Raw Relational Results)
                          ▼
            ┌───────────────────────────┐
            │ Step 4: Response Format   │
            │     (responderAgent)      │
            └─────────────┬─────────────┘
                          │
                          ▼
                Natural Language Answer

---

## Pipeline Workflow Details

### 1. `step1_semanticAnalysisStep` (Guardrail Phase)
* **Agent**: `guardrailAgent`
* **Objective**: Analyzes raw natural language inputs before touching compute-intensive stages.
* **Mechanism**: Verifies semantic relevance to automotive inventory, dealership branches, or financing campaigns. Intercepts and denies prompt-injection attempts, out-of-scope domain requests, or malicious operations.

### 2. `step2_sqlBuilderStep` (Deterministic Metric & Query Formulation)
* **Agent**: `sqlGenAgent`
* **Objective**: Translates validated user intent into executable SQL Server queries.
* **Architecture**: Rather than delegating freeform text-to-SQL generation directly to an LLM, the agent delegates specific query parameters to dedicated schema tools:
  * `DealershipLocationsTool`: Extracts geolocation filters, service capability criteria, and branch names.
  * `VehicleCatalogMasterTool`: Resolves vehicle specs, drivetrain constraints, pricing boundaries, and fuel economy ratings.
  * `RegionalPromotionsTool`: Filters active campaign dates, targeted discount structures, and budget allocations.
* **Dynamic Generation**: Intermediate metric objects are combined to dynamically generate deterministic, syntactically verified SQL commands.

### 3. `step3_dbExecutionStep` (Execution Phase)
* **Objective**: Safe execution of generated queries against Microsoft SQL Server.
* **Mechanism**: Executes parameterized queries, handles database error recovery, and encapsulates raw query result sets into structured JSON payload buffers.

### 4. `step4_responseFormatterStep` (Synthesis Phase)
* **Agent**: `responderAgent`
* **Objective**: Transforms structured tabular datasets into user-friendly business summaries.
* **Mechanism**: Formats currency, comparative specifications, inventory availability, and regional dealership details into concise conversational responses.

---

## Database Schema Reference

The system interfaces with three core relational tables hosted on Microsoft SQL Server:

### 1. `dbo.DealershipLocations`
Stores branch footprints, physical addresses, and operational facility metrics.
* `LocationID` (PK, int): Unique dealership identifier.
* `BranchName` (varchar(100)): Dealership branch naming.
* `StreetAddress` (varchar(150)), `City` (varchar(50)), `StateCode` (char(2)), `PostalCode` (varchar(10)): Geospatial address attributes.
* `Phone` (varchar(20)), `OperatingLicenseNumber` (varchar(30)): Branch metadata.
* `ShowroomSqFt` (int), `ServiceBaysCount` (int): Capacity indicators.
* `OpeningYear` (int): Branch historical tenure.

### 2. `dbo.VehicleCatalogMaster`
Tracks inventory specifications, engineering metrics, and standard pricing.
* `CatalogID` (PK, int): Unique vehicle listing ID.
* `Make` (varchar(50)), `Model` (varchar(50)), `ModelYear` (int): Vehicle identification.
* `VehicleBodyType` (varchar(30)), `Drivetrain` (char(3)), `FuelType` (varchar(20)): Powertrain and chassis layout.
* `EngineDisplacementLiters` (decimal(3,1)): Engine displacement size.
* `StandardMSRP` (decimal(10,2)): Base manufacturer retail price.
* `NHTSASafetyRating` (int): Standardized collision test ratings (1–5).
* `EPACombinedMPG` (int): Fuel efficiency rating.

### 3. `dbo.RegionalPromotions`
Maintains promotional marketing campaigns, active financial incentives, and eligibility.
* `CampaignID` (PK, int): Unique promotional entry ID.
* `CampaignName` (varchar(100)): Marketing title.
* `TargetAudienceTier` (varchar(30)), `PromotionalChannel` (varchar(40)): Segmentation rules.
* `DiscountType` (varchar(20)), `DiscountValue` (decimal(8,2)): Incentive structure.
* `MinPurchaseRequirement` (decimal(10,2)), `AllocatedBudget` (decimal(12,2)): Financial constraints.
* `CampaignStartDate` (date), `CampaignEndDate` (date): Validity intervals.

---

## Directory Layout

```text
src/mastra/
├── agents/
│   ├── guardrailAgent/               # Semantic inspection and prompt safety
│   ├── sqlGenAgent/                  # Tool-delegating SQL generation agent
│   └── responderAgent/               # Contextual response synthesizer
├── tools/
│   ├── DealershipLocationsTool/      # Schemas, controllers, and metric extractors
│   ├── RegionalPromotionsTool/       # Promotion & incentive mapping services
│   └── VehicleCatalogMasterTool/     # Vehicle catalog query controllers
├── workflow/
│   └── dealershipworkflow/
│       ├── schema/                   # Step contract input/output definitions
│       ├── steps/                    # 4-stage sequential execution steps
│       └── workflow/                 # Mastra workflow definition
├── db.js                             # SQL Server connection pooling and driver
├── model.js                          # LLM provider configurations
└── index.js                          # Mastra instance entrypoint

---

## Quickstart

```bash
# 1. Clone repository
git clone [https://github.com/Viji-RaviChandran/mastra-car-dealership-workflow.git](https://github.com/Viji-RaviChandran/mastra-car-dealership-workflow.git)
cd mastra-car-dealership-workflow

# 2. Install dependencies
npm install

# 3. Add your environment credentials in .env (DB connection + LLM API key)

# 4. Start the Mastra playground
npm run dev