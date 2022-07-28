import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
    const date = url.searchParams.get('date') || null;
    return { body: { date }};
};