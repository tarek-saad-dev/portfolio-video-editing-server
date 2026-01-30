/**
 * YouTube Helper Utilities
 * 
 * Functions to extract YouTube video IDs and generate thumbnail URLs
 * Supports various YouTube URL formats
 */

/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - YouTube URL or video ID
 * @returns {string|null} - YouTube video ID or null if invalid
 */
function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // If it's already just an ID (11 characters, alphanumeric, hyphens, underscores)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim();
  }

  // YouTube URL patterns
  const patterns = [
    // Standard formats
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Shorts format
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    // With additional parameters
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Generate YouTube thumbnail URL from video ID
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality: 'default', 'medium', 'high', 'standard', 'maxres'
 * @returns {string|null} - Thumbnail URL or null if invalid ID
 */
function getYouTubeThumbnail(videoId, quality = 'high') {
  if (!videoId) {
    return null;
  }

  const id = extractYouTubeId(videoId);
  if (!id) {
    return null;
  }

  // YouTube thumbnail URL format
  // Quality options: default, medium, high, standard, maxres
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    standard: 'sddefault',
    maxres: 'maxresdefault'
  };

  const qualityParam = qualityMap[quality] || qualityMap.high;
  return `https://img.youtube.com/vi/${id}/${qualityParam}.jpg`;
}

/**
 * Normalize YouTube URL to standard format
 * @param {string} url - YouTube URL or ID
 * @returns {string|null} - Standard YouTube URL or null if invalid
 */
function normalizeYouTubeUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Check if a string is a valid YouTube URL or ID
 * @param {string} url - String to check
 * @returns {boolean} - True if valid YouTube URL/ID
 */
function isValidYouTubeUrl(url) {
  return extractYouTubeId(url) !== null;
}

module.exports = {
  extractYouTubeId,
  getYouTubeThumbnail,
  normalizeYouTubeUrl,
  isValidYouTubeUrl
};

