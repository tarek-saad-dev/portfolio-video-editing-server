# API Response Format

## Project Response Shape

All project endpoints return data in the following normalized format:

```json
{
  "id": "string",
  "title": "string",
  "category": "string",
  "year": "string",
  "duration": "string",
  "tools": ["string"],
  "description": "string",
  "youtubeUrl": "string",
  "thumbnail": "string | null"
}
```

## Field Details

- **id**: MongoDB `_id` converted to string
- **title**: Project title (required)
- **category**: One of: "Short Film", "Documentary", "Commercial", "Corporate", "Reel", "Music Video"
- **year**: Year as string (e.g., "2024")
- **duration**: Duration in "mm:ss" format (e.g., "3:30")
- **tools**: Array of tool names (always an array, default: [])
- **description**: Project description
- **youtubeUrl**: Full YouTube URL (normalized format: `https://www.youtube.com/watch?v=VIDEO_ID`)
- **thumbnail**: Thumbnail URL or null
  - If `thumbnailUrl` is manually provided in DB, uses that
  - Otherwise, auto-generated from YouTube if `youtubeUrl` exists
  - Otherwise, null

## Example Response

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Neon Nights",
  "category": "Short Film",
  "year": "2024",
  "duration": "3:00",
  "tools": ["Adobe Premiere Pro", "After Effects", "DaVinci Resolve"],
  "description": "A visually stunning short film...",
  "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
}
```

## YouTube URL Formats Supported

The API accepts YouTube URLs in various formats:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- Just the video ID: `VIDEO_ID`

All formats are normalized to: `https://www.youtube.com/watch?v=VIDEO_ID`

## Endpoints

All endpoints return the normalized format:

- `GET /api/projects` - List all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/category/:category` - Get projects by category
- `GET /api/projects/tool/:tool` - Get projects by tool
- `GET /api/projects/search?q=query` - Search projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Error Handling

All errors are sanitized to prevent exposing sensitive information (connection strings, etc.).

Error response format:
```json
{
  "message": "Error description"
}
```

## Legacy Field Support

The API handles legacy fields gracefully:
- `duration` (string "mm:ss") → converted to `durationSec` internally
- `year` (string) → converted to number internally
- Old `thumbnailUrl` → mapped to `thumbnail` in response

