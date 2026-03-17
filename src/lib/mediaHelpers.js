/**
 * Media URL helpers — shared across all portfolio components.
 * Handles YouTube URL parsing, thumbnail generation, and Supabase URL normalization.
 */

/** Normalize a URL that may arrive as a JSON array, non-string, or have whitespace */
export function cleanUrl(url) {
    if (!url) return '';
    if (Array.isArray(url)) return url[0] || '';
    if (typeof url !== 'string') return String(url);
    let cleaned = url.trim();
    if (cleaned.startsWith('[')) {
        try {
            const parsed = JSON.parse(cleaned);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        } catch {
            cleaned = cleaned.replace(/^\["?|"?\]$/g, '');
        }
    }
    return cleaned;
}

/** Check if a URL is from a supported embed platform */
export function isEmbedUrl(url) {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
}

/** Extract a YouTube video ID from various URL formats */
export function getYouTubeId(url) {
    if (!url) return null;
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch) return shortMatch[1];
    const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (longMatch) return longMatch[1];
    const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch) return embedMatch[1];
    return null;
}

/** Get the highest-quality YouTube thumbnail for a video */
export function getYouTubeThumbnail(url) {
    const id = getYouTubeId(url);
    if (!id) return null;
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

/** Build a YouTube embed URL with optional autoplay */
export function getYouTubeEmbedUrl(url, autoplay = false) {
    const id = getYouTubeId(url);
    if (!id) return url;
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1${autoplay ? '&autoplay=1&mute=1' : ''}`;
}

/** Normalize DB category values to match code keys (e.g. "Video Editing" → "video_editing") */
export function normalizeCategory(cat) {
    if (!cat) return '';
    return cat.toLowerCase().replace(/[\s/]+/g, '_');
}

/** Gradient palette for cards without media */
export const cardGradients = [
    'linear-gradient(135deg, #6c3fc5 0%, #1a237e 60%, #0d1b4b 100%)',
    'linear-gradient(135deg, #1a3a2e 0%, #0d4b2e 60%, #052618 100%)',
    'linear-gradient(135deg, #4b1a1a 0%, #7e1a1a 60%, #a00000 100%)',
    'linear-gradient(135deg, #1a1a4b 0%, #1a3a7e 60%, #0d2b5e 100%)',
];
