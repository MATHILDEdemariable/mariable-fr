
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
        { url: '/', lastmod: '2026-02-16', priority: 1.0, changefreq: 'daily' },
        { url: '/selection', lastmod: '2026-02-16', priority: 1.0, changefreq: 'daily' },
        { url: '/vibewedding', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        { url: '/services/prestataires', lastmod: '2026-02-16', priority: 1.0, changefreq: 'weekly' },
        { url: '/services/budget', lastmod: '2026-02-16', priority: 0.9, changefreq: 'monthly' },
        { url: '/prix', lastmod: '2026-02-16', priority: 0.9, changefreq: 'monthly' },
        { url: '/comparatif', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/checklist-mariage', lastmod: '2026-02-16', priority: 0.9, changefreq: 'monthly' },
        { url: '/retroplanning', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/detail-coordination-jourm', lastmod: '2026-02-16', priority: 0.9, changefreq: 'monthly' },
        { url: '/conseilsmariage', lastmod: '2026-02-16', priority: 0.9, changefreq: 'weekly' },
        { url: '/fonctionnalites', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        { url: '/professionnelsmariable', lastmod: '2026-02-16', priority: 0.9, changefreq: 'weekly' },
        { url: '/partenariat', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        // Pages guides
        { url: '/guide-jour-j', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        { url: '/guide-debutant', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        { url: '/guidecoordinationjour-j', lastmod: '2026-02-16', priority: 0.6, changefreq: 'monthly' },
        { url: '/ceremonie-laique', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        { url: '/mariage-civil', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        { url: '/ceremonie-catholique', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        { url: '/content-creator-mariage', lastmod: '2026-02-16', priority: 0.6, changefreq: 'monthly' },
        
        // Pages régionales
        { url: '/mariage-provence', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-paris', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-auvergne-rhone-alpes', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-nouvelle-aquitaine', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-bretagne', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-normandie', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-occitanie', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-pays-de-la-loire', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-centre-val-de-loire', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-hauts-de-france', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-bourgogne-franche-comte', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-grand-est', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        { url: '/mariage-corse', lastmod: '2026-02-16', priority: 0.8, changefreq: 'monthly' },
        // Pages about & outils
        { url: '/about/histoire', lastmod: '2026-02-16', priority: 0.8, changefreq: 'yearly' },
        { url: '/about/charte', lastmod: '2026-02-16', priority: 0.8, changefreq: 'yearly' },
        { url: '/about/approche', lastmod: '2026-02-16', priority: 0.8, changefreq: 'yearly' },
        { url: '/about/temoignages', lastmod: '2026-02-16', priority: 0.8, changefreq: 'yearly' },
        { url: '/contact', lastmod: '2026-02-16', priority: 0.8, changefreq: 'yearly' },
        { url: '/planning-personnalise', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        { url: '/coordinateurs-mariage', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        
        { url: '/coordination-jour-j', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        { url: '/outils-planning-mariage', lastmod: '2026-02-16', priority: 0.7, changefreq: 'monthly' },
        { url: '/to-do-list-mariage', lastmod: '2026-02-16', priority: 0.6, changefreq: 'monthly' },
        { url: '/liste-preparatif-mariage', lastmod: '2026-02-16', priority: 0.6, changefreq: 'monthly' },
        
        { url: '/landing-generale', lastmod: '2026-02-16', priority: 0.6, changefreq: 'monthly' },
        { url: '/installer-app', lastmod: '2026-02-16', priority: 0.5, changefreq: 'yearly' },
        { url: '/cgv', lastmod: '2026-02-16', priority: 0.5, changefreq: 'yearly' },
        { url: '/cgv-couples', lastmod: '2026-02-16', priority: 0.4, changefreq: 'yearly' },
        { url: '/contact/faq', lastmod: '2026-02-16', priority: 0.5, changefreq: 'yearly' },
        { url: '/sitemap', lastmod: '2026-02-16', priority: 0.4, changefreq: 'monthly' },
    ];

    useEffect(() => {
        // Generate fallback sitemap if database errors occur
        if (prestataireError || blogError) {
            console.warn('Error fetching data for sitemap, generating fallback sitemap');
            const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
    <url>
      <loc>${BASE_URL}${page.url}</loc>
      <lastmod>${page.lastmod || format(new Date(), 'yyyy-MM-dd')}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>`).join('')}
</urlset>`;
            setSitemapContent(fallbackSitemap);
            return;
        }

        if (prestataires && blogPosts) {
            const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
    <url>
      <loc>${BASE_URL}${page.url}</loc>
      <lastmod>${page.lastmod || format(new Date(), 'yyyy-MM-dd')}</lastmod>
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
      <loc>${BASE_URL}/conseilsmariage/${post.slug}</loc>
      <lastmod>${format(new Date(post.updated_at), 'yyyy-MM-dd')}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`).join('')}
</urlset>`;
            setSitemapContent(sitemap);
        }
    }, [prestataires, blogPosts, prestataireError, blogError]);
    
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
