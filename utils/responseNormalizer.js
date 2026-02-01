/**
 * Response Normalizer
 * 
 * Normalizes project data to match frontend API contract
 * Ensures consistent, predictable responses
 */

const { extractYouTubeId, getYouTubeThumbnail, normalizeYouTubeUrl } = require('./youtubeHelper');

/**
 * Convert duration in seconds to "mm:ss" format
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration "mm:ss"
 */
function formatDuration(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
        return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Normalize a single project document to API response format
 * @param {Object} project - Mongoose project document
 * @returns {Object} - Normalized project object
 */
function normalizeProject(project) {
    if (!project) {
        return null;
    }

    // Convert Mongoose document to plain object if needed
    const doc = project.toObject ? project.toObject() : project;

    // Extract YouTube ID and URL
    const youtubeUrl = doc.youtubeUrl || doc.youtubeId || '';
    const youtubeId = extractYouTubeId(youtubeUrl);
    const normalizedYoutubeUrl = youtubeId ? normalizeYouTubeUrl(youtubeId) : '';

    // Determine thumbnail
    // Priority: 1) Manual thumbnailUrl (if provided), 2) YouTube thumbnail (if YouTube URL exists), 3) null
    let thumbnail = null;

    // If manual thumbnailUrl is provided, use it (takes precedence)
    if (doc.thumbnailUrl && doc.thumbnailUrl.trim()) {
        thumbnail = doc.thumbnailUrl.trim();
    }
    // Otherwise, if YouTube URL exists, auto-generate thumbnail from YouTube
    else if (youtubeId) {
        thumbnail = getYouTubeThumbnail(youtubeId, 'high');
    }
    // Legacy support: check for old 'thumbnail' field
    else if (doc.thumbnail && doc.thumbnail.trim()) {
        thumbnail = doc.thumbnail.trim();
    }

    // Normalize year to string
    const year = doc.year !== undefined && doc.year !== null ?
        String(doc.year) :
        '';

    // Normalize duration
    const duration = doc.durationSec !== undefined && doc.durationSec !== null ?
        formatDuration(doc.durationSec) :
        (doc.duration || '0:00');

    // Normalize tools array
    const tools = Array.isArray(doc.tools) ?
        doc.tools.filter(tool => tool && typeof tool === 'string' && tool.trim()) : [];

    // Build normalized response
    return {
        id: doc._id ? String(doc._id) : '',
        title: doc.title || '',
        category: doc.category || '',
        date: doc.date || null,
        year: year,
        duration: duration,
        tools: tools,
        description: doc.description || '',
        youtubeUrl: normalizedYoutubeUrl,
        thumbnail: thumbnail,
        createdAt: doc.createdAt || null,
        updatedAt: doc.updatedAt || null
    };
}

/**
 * Normalize an array of projects
 * @param {Array} projects - Array of project documents
 * @returns {Array} - Array of normalized project objects
 */
function normalizeProjects(projects) {
    if (!Array.isArray(projects)) {
        return [];
    }

    return projects
        .map(project => normalizeProject(project))
        .filter(project => project !== null);
}

module.exports = {
    normalizeProject,
    normalizeProjects,
    formatDuration
};