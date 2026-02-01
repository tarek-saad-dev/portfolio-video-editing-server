# Date Field Migration Guide

## Overview

This migration converts the `date` field in all projects from String format (e.g., "03/30/2025") to proper Date objects for correct sorting.

## Why This Migration?

- **Before**: Projects were sorted inconsistently because `date` was stored as strings
- **After**: Projects are sorted correctly by date (newest → oldest) using MongoDB's native Date sorting

## Changes Made

### 1. Schema Update (`models/projectModel.js`)
```javascript
date: {
  type: Date,
  required: [true, 'Project date is required']
}
```

### 2. Sorting Logic (All Endpoints)
```javascript
.sort({ date: -1, createdAt: -1 })
```
- Primary sort: `date` (newest → oldest)
- Tie-breaker: `createdAt` (if two projects have same date)

### 3. Response Format
The API now returns:
```json
{
  "id": "...",
  "title": "...",
  "date": "2025-03-30T00:00:00.000Z",  // ISO Date format
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-20T14:45:00.000Z"
}
```

## Running the Migration

### Step 1: Backup Your Database
```bash
# MongoDB backup command
mongodump --uri="your_mongodb_uri" --out=./backup
```

### Step 2: Run Migration Script
```bash
node scripts/migrateDateField.js
```

### Step 3: Verify Results
The script will show:
- ✅ Number of projects updated
- ⏭️ Number of projects skipped (already correct)
- ❌ Any errors encountered

### Step 4: Restart Server
```bash
npm start
```

## What the Migration Does

1. **Finds all projects** in the database
2. **For each project**:
   - If `date` is missing → uses `createdAt` or current date
   - If `date` is a string (MM/DD/YYYY) → converts to Date object
   - If `date` is already a Date → skips
3. **Updates the database** with converted values
4. **Verifies** all dates are now Date objects

## Supported Date Formats

The migration script handles:
- `MM/DD/YYYY` (e.g., "03/30/2025")
- ISO format (e.g., "2025-03-30")
- Any standard JavaScript Date-parseable format

## Rollback (If Needed)

If you need to rollback:
```bash
# Restore from backup
mongorestore --uri="your_mongodb_uri" ./backup
```

## Testing After Migration

1. **Test API endpoint**:
```bash
curl http://localhost:5000/api/projects
```

2. **Verify sorting**: Projects should be ordered newest → oldest by `date`

3. **Check response**: Each project should have `date` as ISO string

## Troubleshooting

### Issue: Migration fails with "date is required" error
**Solution**: Some projects might be missing the `date` field. The migration script will use `createdAt` as fallback.

### Issue: Dates are not sorting correctly
**Solution**: 
1. Check that migration completed successfully
2. Verify all dates are Date objects in MongoDB
3. Restart the server to reload the schema

### Issue: Frontend shows wrong date format
**Solution**: The API returns ISO format. Parse it in frontend:
```javascript
new Date(project.date).toLocaleDateString()
```

## Notes

- ⚠️ **Always backup before running migrations**
- ✅ The migration is **idempotent** (safe to run multiple times)
- 🔄 Projects without `date` will use `createdAt` as fallback
- 📊 The script provides detailed logs for each project processed
