# MongoDB Schema: Projects Collection

## 1. JSON Schema Validator

```javascript
// MongoDB JSON Schema Validator for "projects" collection
db.createCollection("projects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "category", "year", "durationSec", "description", "thumbnailUrl", "tools", "createdAt", "updatedAt"],
      properties: {
        _id: {
          bsonType: "objectId",
          description: "MongoDB ObjectId - automatically generated"
        },
        title: {
          bsonType: "string",
          minLength: 1,
          maxLength: 200,
          description: "Project title - required"
        },
        category: {
          bsonType: "string",
          enum: ["Short Film", "Documentary", "Commercial", "Corporate", "Reel", "Music Video"],
          description: "Project category - required, must be one of the predefined values"
        },
        year: {
          bsonType: "int",
          minimum: 1900,
          maximum: 2100,
          description: "Year of project - required, must be between 1900 and 2100"
        },
        durationSec: {
          bsonType: "int",
          minimum: 0,
          description: "Duration in seconds - required, must be >= 0"
        },
        description: {
          bsonType: "string",
          minLength: 1,
          maxLength: 5000,
          description: "Project description - required"
        },
        thumbnailUrl: {
          bsonType: "string",
          minLength: 1,
          pattern: "^(https?://|/).*",
          description: "Thumbnail URL or path - required, must be a valid URL or path"
        },
        tools: {
          bsonType: "array",
          items: {
            bsonType: "string",
            minLength: 1
          },
          description: "Array of tool names - required, default empty array"
        },
        isFeatured: {
          bsonType: "bool",
          description: "Whether project is featured - optional, default true"
        },
        sortOrder: {
          bsonType: "int",
          description: "Sort order for display - optional, default 0"
        },
        createdAt: {
          bsonType: "date",
          description: "Creation timestamp - required"
        },
        updatedAt: {
          bsonType: "date",
          description: "Last update timestamp - required"
        }
      }
    }
  }
});
```

## 2. Index Creation Commands

```javascript
// Performance indexes for "projects" collection

// 1. Category and year index (for filtering by category and sorting by year)
db.projects.createIndex(
  { category: 1, year: -1 },
  { name: "idx_category_year" }
);

// 2. Featured projects index (for homepage/featured section)
db.projects.createIndex(
  { isFeatured: 1, sortOrder: 1, year: -1 },
  { name: "idx_featured_sort" }
);

// 3. Tools array index (for filtering by tools)
db.projects.createIndex(
  { tools: 1 },
  { name: "idx_tools" }
);

// 4. Text search index (for searching in title and description)
db.projects.createIndex(
  { title: "text", description: "text" },
  { name: "idx_text_search", default_language: "english" }
);

// Optional: Single field indexes for common queries
db.projects.createIndex({ year: -1 }, { name: "idx_year" });
db.projects.createIndex({ category: 1 }, { name: "idx_category" });
```

## 3. Example Documents

```javascript
// Example Document 1: "Neon Nights"
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "title": "Neon Nights",
  "category": "Short Film",
  "year": 2024,
  "durationSec": 180,  // 3:00 (3 minutes * 60 seconds)
  "description": "A visually stunning short film exploring the vibrant nightlife of urban landscapes through neon-lit streets and dynamic cinematography.",
  "thumbnailUrl": "https://your-cdn.com/thumbnails/neon-nights.jpg",
  "tools": ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve", "Cinema 4D"],
  "isFeatured": true,
  "sortOrder": 1,
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}

// Example Document 2: "Golden Hour"
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "title": "Golden Hour",
  "category": "Commercial",
  "year": 2024,
  "durationSec": 90,  // 1:30 (1 minute 30 seconds)
  "description": "A commercial project capturing the essence of luxury brands during the golden hour, featuring elegant transitions and color grading.",
  "thumbnailUrl": "https://your-cdn.com/thumbnails/golden-hour.jpg",
  "tools": ["Final Cut Pro", "Color Finale", "Motion"],
  "isFeatured": true,
  "sortOrder": 2,
  "createdAt": ISODate("2024-02-20T14:15:00Z"),
  "updatedAt": ISODate("2024-02-20T14:15:00Z")
}

// Example Document 3: "The Interview"
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "title": "The Interview",
  "category": "Documentary",
  "year": 2023,
  "durationSec": 1200,  // 20:00 (20 minutes * 60 seconds)
  "description": "An in-depth documentary featuring interviews with industry leaders, showcasing authentic storytelling and professional editing techniques.",
  "thumbnailUrl": "https://your-cdn.com/thumbnails/the-interview.jpg",
  "tools": ["Adobe Premiere Pro", "Audition", "Photoshop"],
  "isFeatured": false,
  "sortOrder": 0,
  "createdAt": ISODate("2023-11-10T09:00:00Z"),
  "updatedAt": ISODate("2023-11-10T09:00:00Z")
}

// Example Document 4: "Skyline"
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "title": "Skyline",
  "category": "Reel",
  "year": 2024,
  "durationSec": 60,  // 1:00 (1 minute)
  "description": "A dynamic showreel showcasing architectural videography and time-lapse techniques of urban skylines.",
  "thumbnailUrl": "https://your-cdn.com/thumbnails/skyline.jpg",
  "tools": ["DaVinci Resolve", "LRTimelapse", "After Effects"],
  "isFeatured": true,
  "sortOrder": 3,
  "createdAt": ISODate("2024-03-05T16:45:00Z"),
  "updatedAt": ISODate("2024-03-05T16:45:00Z")
}

// Example Document 5: "Breaking Point"
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "title": "Breaking Point",
  "category": "Short Film",
  "year": 2023,
  "durationSec": 240,  // 4:00 (4 minutes * 60 seconds)
  "description": "A dramatic short film exploring themes of resilience and transformation, featuring intense editing and sound design.",
  "thumbnailUrl": "https://your-cdn.com/thumbnails/breaking-point.jpg",
  "tools": ["Adobe Premiere Pro", "After Effects", "Pro Tools"],
  "isFeatured": true,
  "sortOrder": 4,
  "createdAt": ISODate("2023-09-22T11:20:00Z"),
  "updatedAt": ISODate("2023-09-22T11:20:00Z")
}

// Example Document 6: "Chromatic"
{
  "_id": ObjectId("507f1f77bcf86cd799439016"),
  "title": "Chromatic",
  "category": "Music Video",
  "year": 2024,
  "durationSec": 210,  // 3:30 (3 minutes 30 seconds)
  "description": "A vibrant music video with experimental color grading and rhythmic editing synchronized to the beat.",
  "thumbnailUrl": "https://your-cdn.com/thumbnails/chromatic.jpg",
  "tools": ["Final Cut Pro", "DaVinci Resolve", "After Effects", "Trapcode Suite"],
  "isFeatured": true,
  "sortOrder": 5,
  "createdAt": ISODate("2024-04-12T13:30:00Z"),
  "updatedAt": ISODate("2024-04-12T13:30:00Z")
}
```

## 4. Migration Plan

### Step 1: Backup Current Data
```javascript
// Create backup collection
db.projects.aggregate([{ $out: "projects_backup" }]);
```

### Step 2: Create New Collection with Validator
```javascript
// Run the collection creation command from Section 1
// This will create the new schema-validated collection
```

### Step 3: Migration Script

```javascript
// Migration script: Convert old schema to new schema
// Run this in MongoDB shell or as a Node.js script

const oldProjects = db.projects_old.find({}).toArray();

oldProjects.forEach(oldProject => {
  // Convert duration from "mm:ss" to seconds
  function durationToSeconds(durationString) {
    if (!durationString || typeof durationString !== 'string') {
      return 0;
    }
    const parts = durationString.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      return (minutes * 60) + seconds;
    }
    return 0;
  }

  // Convert year from string to number
  function yearToNumber(yearString) {
    if (typeof yearString === 'number') {
      return yearString;
    }
    const year = parseInt(yearString, 10);
    return (year >= 1900 && year <= 2100) ? year : new Date().getFullYear();
  }

  // Map thumbnail (could be import path) to thumbnailUrl
  function getThumbnailUrl(thumbnail) {
    // If it's already a URL, use it
    if (thumbnail && (thumbnail.startsWith('http://') || thumbnail.startsWith('https://') || thumbnail.startsWith('/'))) {
      return thumbnail;
    }
    // If it's a local import, convert to URL path
    // Adjust this logic based on your actual thumbnail storage
    return `/thumbnails/${thumbnail}`;
  }

  const newProject = {
    title: oldProject.title || 'Untitled Project',
    category: oldProject.category || 'Short Film', // Default category
    year: yearToNumber(oldProject.year || oldProject.date),
    durationSec: durationToSeconds(oldProject.duration),
    description: oldProject.description || '',
    thumbnailUrl: getThumbnailUrl(oldProject.thumbnail || oldProject.imgPath),
    tools: oldProject.tools || [],
    isFeatured: oldProject.isFeatured !== undefined ? oldProject.isFeatured : true,
    sortOrder: oldProject.sortOrder || 0,
    createdAt: oldProject.createdAt || new Date(),
    updatedAt: new Date()
  };

  // Insert into new collection
  db.projects.insertOne(newProject);
});
```

### Step 4: Field Mapping Reference

| Old Field | New Field | Conversion Logic |
|-----------|-----------|------------------|
| `year` (string) | `year` (number) | Parse string to integer, validate range 1900-2100 |
| `duration` (string "mm:ss") | `durationSec` (number) | Parse "mm:ss" → (minutes × 60) + seconds |
| `thumbnail` (import path) | `thumbnailUrl` (string) | Convert local import to URL path or keep if already URL |
| `tools[]` | `tools[]` | Keep as-is (already array of strings) |
| `title` | `title` | Keep as-is |
| `description` | `description` | Keep as-is |
| `category` | `category` | Keep as-is, validate against enum |
| N/A | `isFeatured` | Default to `true` if not present |
| N/A | `sortOrder` | Default to `0` if not present |
| `createdAt` (if exists) | `createdAt` | Keep existing or set to current date |
| N/A | `updatedAt` | Set to current date |

### Step 5: Validation & Testing

```javascript
// Test queries after migration

// 1. Verify all documents pass validation
db.projects.find({}).forEach(doc => {
  try {
    db.projects.validate(doc);
  } catch (e) {
    print(`Validation failed for ${doc._id}: ${e.message}`);
  }
});

// 2. Count documents
db.projects.countDocuments({});

// 3. Test indexes
db.projects.find({ category: "Short Film", year: { $gte: 2023 } }).explain("executionStats");
db.projects.find({ isFeatured: true }).sort({ sortOrder: 1, year: -1 }).explain("executionStats");
db.projects.find({ tools: "Adobe Premiere Pro" }).explain("executionStats");
db.projects.find({ $text: { $search: "neon" } }).explain("executionStats");
```

### Step 6: Update Application Code

After migration, update:
- **Model** (`models/projectModel.js`): Update Mongoose schema to match new structure
- **Controller** (`controllers/projectController.js`): Update queries to use new field names
- **Frontend**: Update API calls to use `durationSec` instead of `duration`, `thumbnailUrl` instead of `thumbnail`

### Step 7: Rollback Plan (if needed)

```javascript
// If migration fails, restore from backup
db.projects.drop();
db.projects_backup.aggregate([{ $out: "projects" }]);
```

---

## Notes

- **Duration Conversion**: The migration script includes a helper function to convert "mm:ss" format to seconds. Example: "3:30" → 210 seconds.

- **Year Validation**: The script validates year values to ensure they're within the 1900-2100 range.

- **Thumbnail URLs**: Adjust the `getThumbnailUrl` function based on your actual thumbnail storage strategy (CDN, local storage, etc.).

- **Category Enum**: Ensure all existing categories map to one of the allowed values: "Short Film", "Documentary", "Commercial", "Corporate", "Reel", "Music Video".

- **Index Performance**: The suggested indexes optimize common query patterns:
  - Filtering by category and year
  - Displaying featured projects
  - Searching by tools
  - Full-text search on title and description

