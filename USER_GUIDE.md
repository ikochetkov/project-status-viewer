# Mobiz Project Status Viewer - End User Guide

## Overview

The **Mobiz Project Status Viewer** is a comprehensive dashboard for monitoring and managing project health, progress, and key metrics in real-time. It provides a centralized view of all projects with their current status, effort tracking, and detailed project information.

---

## Key Features

### 1. **Project Overview Table**
The main dashboard displays all active projects in a professional table format with key information at a glance:

- **Project Number & Name** - Unique identifier and project title
- **Project Manager** - Who is responsible for the project
- **Timeline** - Start and end dates
- **Overall Health Status** - Color-coded health indicator
- **Key Metrics** - Cost, Scope, Schedule, Resources status
- **Completion %** - Visual progress indicator
- **Effort Utilization** - Shows if effort is on track or over-allocated

---

## Understanding Health Indicators

Color-coded status indicators help you quickly assess project health:

| Color | Status | Meaning |
|-------|--------|---------|
| 🟢 **Green** | On Track | Project is progressing as planned |
| 🟡 **Yellow** | At Risk | Minor issues that need attention |
| 🔴 **Red** | Off Track | Major issues requiring intervention |
| 🔵 **Blue** | Informational | Additional status information |

---

## Main Dashboard Columns

### Project Column
- **Project ID** - Unique project identifier
- **Project Name** - Full project title
- **Company** - Associated organization
- **Project Manager** - Name and avatar of PM
- **Dates** - Project start and end dates
- **Status Report Action** - Create or link status reports

### Status Date
The date when the project status was last updated

### Health Metrics (Cost, Scope, Schedule, Resources)
Individual status indicators for each project dimension

### Percent Complete
- **Display** - Circular progress indicator with percentage
- **Meaning** - Overall completion progress of the project

### Effort Utilized
- **Display** - Circular progress indicator with percentage
- **Meaning** - Ratio of actual effort used vs. allocated effort
- **Over 100%** - Shown in red, indicates over-allocation

---

## Expanding Project Details

Click on any project row to expand and view detailed information organized in tabs:

### 📋 **Details Tab**

#### Executive Summary
High-level overview of the project status and key accomplishments

#### Achievements (Last Week)
Recent wins and completed milestones

#### Key Planned Activities (Next Week)
Upcoming work and planned deliverables

#### Comments
Additional notes or context about the project

#### Effort Tracking Card
Detailed effort metrics:
- **Planned Effort (SOW)** - Original scope of work hours
- **Allocated Effort** - Total hours assigned to team members
- **Actual Effort** - Hours already recorded and approved
- **Remaining Effort** - Hours still available (may show negative if over-allocated)
- **Unapproved Effort** - Hours submitted but pending approval
- **Planned End Date** - Target completion date with delay indicator
- **Effort Utilized %** - Progress toward effort budget
- **Time Elapsed %** - Calendar time consumed vs. planned

### 📅 **Milestones Tab**

View all project milestones with the ability to filter by active items:

- **Toggle "Only Active"** - Show/hide completed milestones
- **Number** - Milestone identifier (clickable link to details)
- **Short Description** - Milestone title
- **State** - Current milestone status
- **Due Date** - Target completion date
- **Planned End** - Actual planned completion
- **Percent Complete** - Progress visual
- **Comments** - Additional notes

### ⚠️ **Issues Tab**

Track all open and closed issues:

- **Toggle "Only Active"** - Show active issues only
- **Number** - Issue ID (linked)
- **Short Description** - Issue title
- **Impact** - Severity level
- **Priority** - Urgency level
- **State** - Current issue status
- **Assigned To** - Owner of the issue
- **Created** - Issue creation date
- **Due Date** - Target resolution date

### 🚨 **Risks Tab**

Manage identified project risks:

- **Toggle "Only Active"** - Show active risks only
- **Number** - Risk ID (linked)
- **Short Description** - Risk description
- **Risk Type** - Category of risk
- **Impact** - Potential impact level
- **Mitigation Plan** - Planned response strategy
- **Risk State** - Current status
- **Assigned To** - Risk owner
- **Created** - Risk identification date
- **Due Date** - Mitigation target date

### 📊 **Status History Tab**

View historical snapshots of project health:

- **Number** - Status report identifier (linked)
- **Date** - When the status was recorded
- **Overall Health** - Historical health status
- **Schedule, Cost, Resources** - Individual dimension status over time
- **Percent Complete** - Historical completion %
- **Effort Utilized** - Historical effort metrics

---

## Common Tasks

### Check Project Health at a Glance
1. Review the main dashboard table
2. Look for red/yellow indicators in the status columns
3. Click projects with concerning statuses for details

### Monitor Effort Spending
1. Expand a project and go to **Details** tab
2. Review the **Effort Tracking** card
3. Check if "Effort Utilized %" is near or over 100%
4. Look for negative values in **Remaining Effort**

### Identify At-Risk Milestones
1. Click **Milestones** tab
2. Filter "Only Active" to focus on upcoming work
3. Look for dates approaching today
4. Check percent complete on each milestone

### Track Issues and Risks
1. Navigate to **Issues** or **Risks** tabs
2. Use "Only Active" filter to focus on current items
3. Click issue/risk IDs to view full details
4. Review assigned owners and due dates

### Create a Status Report
1. If project shows **"NO STATUS REPORT"** in the Status Report column:
   - Click the **"+ Create Status Report"** icon
   - Click **"Go to Status Reports page"** button
   - Follow the status report creation wizard
   - Select **"Mobiz (MSP)"** domain when prompted

### View Historical Trends
1. Expand project details
2. Click **Status History** tab
3. Review trends over time for all metrics
4. Identify patterns (improving, declining, stable)

---

## Tips & Best Practices

✅ **Do's**
- Review health indicators weekly
- Monitor effort utilization to prevent over-allocation
- Keep milestones up-to-date
- Document issues and risks promptly
- Update status reports regularly

❌ **Don'ts**
- Ignore red or yellow health indicators
- Let effort utilization exceed 120%
- Allow unresolved critical issues to remain inactive
- Skip status report updates
- Ignore risks without mitigation plans

---

## Data Interpretation Guide

### Understanding Effort Metrics

**Effort Utilized = (Actual Effort / Allocated Effort) × 100%**

- **0-80%** - On track, effort within budget ✅
- **80-100%** - Getting close to budget ⚠️
- **100-120%** - Over-allocated, may need intervention 🔴
- **120%+** - Significantly over budget, requires action 🚨

### Understanding Time Elapsed

**Time Elapsed = (Actual Duration / Planned Duration) × 100%**

- **0-70%** - Early stage of project
- **70-100%** - On schedule
- **100%+** - Delayed or approaching deadline

### Understanding Completion %

- **0-33%** - Initiation phase
- **33-66%** - Execution phase
- **66-100%** - Closing phase
- **100%** - Complete

---

## Support & More Information

For additional help or detailed information:
- Contact your Project Management Office (PMO)
- Reference the project status records
- Review historical status reports
- Consult with your project manager

---

**Version:** 1.0  
**Last Updated:** January 2026  
**Component:** Mobiz Project Status Viewer v0.0.1
