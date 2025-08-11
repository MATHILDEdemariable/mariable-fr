
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const BASE_URL = 'https://www.mariable.fr'; // URL de production pour le SEO

const fetchPrestataires = async () => {
    const { data, error } = await supabase
        .from('prestataires_rows')
        .select('slug, updated_at')
        .eq('visible', true);

    if (error) {
        console.error('Error fetching prestataires for sitemap:', error);
        throw new Error(error.message);
    }
    return data || [];
};

const fetchBlogPosts = async () => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('status', 'published');

    if (error) {
        console.error('Error fetching blog posts for sitemap:', error);
        throw new Error(error.message);
    }
    return data || [];
};

const SitemapPage = () => {
    const { data: prestataires, isLoading: prestataireLoading, isError: prestataireError } = useQuery({
        queryKey: ['sitemap_prestataires'],
        queryFn: fetchPrestataires,
    });

    const { data: blogPosts, isLoading: blogLoading, isError: blogError } = useQuery({
        queryKey: ['sitemap_blog'],
        queryFn: fetchBlogPosts,
    });

    const [sitemapContent, setSitemapContent] = useState('');

    const staticPages = [
        { url: '/', priority: 1.0, changefreq: 'daily' },
        { url: '/selection', priority: 1.0, changefreq: 'daily' },
        { url: '/services/prestataires', priority: 1.0, changefreq: 'weekly' },
        { url: '/services/budget', priority: 0.9, changefreq: 'monthly' },
        { url: '/checklist-mariage', priority: 0.9, changefreq: 'monthly' },
        { url: '/detail-coordination-jourm', priority: 0.9, changefreq: 'monthly' },
        { url: '/blog', priority: 0.9, changefreq: 'weekly' },
        { url: '/mariage-provence', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-paris', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-auvergne-rhone-alpes', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-nouvelle-aquitaine', priority: 0.8, changefreq: 'monthly' },
        { url: '/about/histoire', priority: 0.8, changefreq: 'yearly' },
        { url: '/about/charte', priority: 0.8, changefreq: 'yearly' },
        { url: '/about/approche', priority: 0.8, changefreq: 'yearly' },
        { url: '/about/temoignages', priority: 0.8, changefreq: 'yearly' },
        { url: '/contact', priority: 0.8, changefreq: 'yearly' },
        { url: '/professionnels', priority: 0.8, changefreq: 'monthly' },
        { url: '/planning-personnalise', priority: 0.7, changefreq: 'monthly' },
        { url: '/assistant-v2', priority: 0.7, changefreq: 'monthly' },
        { url: '/coordinateurs-mariage', priority: 0.7, changefreq: 'monthly' },
        { url: '/mentions-legales', priority: 0.5, changefreq: 'yearly' },
        { url: '/cgv', priority: 0.5, changefreq: 'yearly' },
        { url: '/contact/faq', priority: 0.5, changefreq: 'yearly' },
    ];

    useEffect(() => {
        if (prestataires && blogPosts) {
            const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
    <url>
      <loc>${BASE_URL}${page.url}</loc>
      <lastmod>${format(new Date(), 'yyyy-MM-dd')}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`).join('')}
  ${prestataires.map(prestataire => `
    <url>
      <loc>${BASE_URL}/prestataire/${prestataire.slug}</loc>
      <lastmod>${format(new Date(prestataire.updated_at), 'yyyy-MM-dd')}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.6</priority>
    </url>`).join('')}
  ${blogPosts.map(post => `
    <url>
      <loc>${BASE_URL}/blog/${post.slug}</loc>
      <lastmod>${format(new Date(post.updated_at), 'yyyy-MM-dd')}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`).join('')}
</urlset>`;
            setSitemapContent(sitemap);
        }
    }, [prestataires, blogPosts]);
    
    if (prestataireLoading || blogLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (prestataireError || blogError) {
        return <div>Error generating sitemap. Check console for details.</div>;
    }

    return (
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {sitemapContent}
        </pre>
    );
};

export default SitemapPage;
