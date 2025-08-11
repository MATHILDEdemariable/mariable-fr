import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Calendar, Users, FileText } from 'lucide-react';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/ui/breadcrumbs';

const SitemapHTML: React.FC = () => {
  const mainPages = [
    { title: 'Accueil', href: '/', description: 'Page d\'accueil de Mariable' },
    { title: 'Prestataires', href: '/selection', description: 'Trouvez les meilleurs prestataires de mariage' },
    { title: 'Blog', href: '/blog', description: 'Conseils et inspiration mariage' },
    { title: 'Coordinateurs', href: '/coordinateurs-mariage', description: 'Wedding planners professionnels' },
    { title: 'Témoignages', href: '/jeunes-maries', description: 'Avis et retours de couples mariés' },
    { title: 'Contact', href: '/contact', description: 'Nous contacter pour vos questions' }
  ];

  const toolsPages = [
    { title: 'Checklist Mariage', href: '/checklist-mariage', description: 'Planning personnalisé de A à Z' },
    { title: 'Calculateur Budget', href: '/budget', description: 'Estimez le coût de votre mariage' },
    { title: 'Planning Jour J', href: '/coordination-jour-j', description: 'Organisez votre journée parfaite' },
    { title: 'Assistant Virtuel', href: '/test-assistant-virtuel', description: 'IA pour planifier votre mariage' }
  ];

  const regionalPages = [
    { title: 'Mariage en Provence', href: '/mariage-provence', description: 'Prestataires et lieux en Provence' },
    { title: 'Mariage à Paris', href: '/mariage-paris', description: 'Prestataires et lieux à Paris' },
    { title: 'Mariage Auvergne-Rhône-Alpes', href: '/mariage-auvergne-rhone-alpes', description: 'Prestataires en région Auvergne-Rhône-Alpes' },
    { title: 'Mariage Nouvelle-Aquitaine', href: '/mariage-nouvelle-aquitaine', description: 'Prestataires en Nouvelle-Aquitaine' }
  ];

  const aboutPages = [
    { title: 'Notre Histoire', href: '/about/histoire', description: 'L\'histoire de Mariable' },
    { title: 'Notre Approche', href: '/about/approche', description: 'Notre philosophie du mariage' },
    { title: 'Notre Charte', href: '/about/charte', description: 'Nos valeurs et engagements' },
    { title: 'Témoignages', href: '/about/temoignages', description: 'Ce que disent nos utilisateurs' }
  ];

  const legalPages = [
    { title: 'Mentions Légales', href: '/mentions-legales', description: 'Informations légales' },
    { title: 'CGV', href: '/cgv', description: 'Conditions générales de vente' },
    { title: 'FAQ', href: '/faq', description: 'Questions fréquemment posées' }
  ];

  const PageSection: React.FC<{ title: string; icon: React.ReactNode; pages: typeof mainPages }> = ({ title, icon, pages }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((page, index) => (
            <div key={index} className="flex items-start justify-between p-3 bg-secondary/50 rounded-lg">
              <div className="flex-1">
                <Link 
                  to={page.href} 
                  className="font-medium text-primary hover:underline"
                >
                  {page.title}
                </Link>
                <p className="text-sm text-muted-foreground mt-1">
                  {page.description}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <SEO 
        title="Plan du site - Mariable"
        description="Découvrez toutes les pages de Mariable : outils de mariage, prestataires, blog, conseils et ressources pour organiser votre mariage."
        canonical="/sitemap"
      />
      
      <Header />
      
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Breadcrumbs items={[
              { label: 'Accueil', href: '/' },
              { label: 'Plan du site' }
            ]} />
          </div>
          
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Plan du Site</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Retrouvez facilement toutes les pages et fonctionnalités de Mariable pour planifier votre mariage parfait.
              </p>
            </div>

            <div className="space-y-6">
              <PageSection 
                title="Pages principales" 
                icon={<Users className="h-5 w-5" />}
                pages={mainPages}
              />
              
              <PageSection 
                title="Outils de planification" 
                icon={<Calendar className="h-5 w-5" />}
                pages={toolsPages}
              />
              
              <PageSection 
                title="Pages régionales" 
                icon={<MapPin className="h-5 w-5" />}
                pages={regionalPages}
              />
              
              <PageSection 
                title="À propos" 
                icon={<Users className="h-5 w-5" />}
                pages={aboutPages}
              />
              
              <PageSection 
                title="Informations légales" 
                icon={<FileText className="h-5 w-5" />}
                pages={legalPages}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Vous ne trouvez pas ce que vous cherchez ? Notre équipe est là pour vous aider.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                      <Link to="/contact">Nous contacter</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/faq">Consulter la FAQ</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default SitemapHTML;