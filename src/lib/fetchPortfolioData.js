import { createSupabaseServerClient } from './supabase/server';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';

const _fetchPortfolioData = async () => {
    try {
        const supabase = createSupabaseServerClient();

        const [websitesRes, creativesRes] = await Promise.all([
            supabase.from('website').select('*').order('id', { ascending: true }),
            supabase.from('creatives').select('*').order('id', { ascending: true }),
        ]);

        if (websitesRes.error) {
            console.error('[fetchPortfolioData] Website fetch error:', websitesRes.error.message);
        }
        if (creativesRes.error) {
            console.error('[fetchPortfolioData] Creatives fetch error:', creativesRes.error.message);
        }

        return {
            websites: websitesRes.data ?? [],
            creatives: creativesRes.data ?? [],
        };
    } catch (error) {
        console.error('[fetchPortfolioData] Unexpected error:', error.message);
        return { websites: [], creatives: [] };
    }
};

/**
 * Fetches portfolio data from Supabase.
 * - `unstable_cache`: Next.js Data Cache (persists data across requests centrally).
 * - `cache`: React Request Memoization (prevents duplicate fetches in a single render tree).
 */
export const fetchPortfolioData = cache(
    unstable_cache(_fetchPortfolioData, ['portfolio-data'], {
        revalidate: 3600, // Revalidate every hour
        tags: ['portfolio-data'],
    })
);
