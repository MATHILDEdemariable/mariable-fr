import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Eye, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import KeywordSuggestions from './KeywordSuggestions';
import BlogSEOAnalytics from './BlogSEOAnalytics';
import SEORealtimeValidator from './SEORealtimeValidator';

interface BlogSEOManagerProps {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  h1Title: string;
  slug: string;
  keywords: string[];
  onMetaChange: (field: string, value: string) => void;
  onSlugChange: (slug: string) => void;
  onKeywordsChange: (keywords: string[]) => void;
}

const BlogSEOManager: React.FC<BlogSEOManagerProps> = ({
  title,
  content,
  metaTitle,
  metaDescription,
  h1Title,
  slug,
  keywords,
  onMetaChange,
  onSlugChange,
  onKeywordsChange
}) => {
  const [seoScore, setSeoScore] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Suggestions de mots-clés basées sur le contenu
  const suggestedKeywords = [
    'mariage', 'organisation mariage', 'wedding planner', 'prestataires mariage',
    'budget mariage', 'planning mariage', 'coordination mariage', 'mariés',
    'cérémonie', 'réception', 'photographe mariage', 'traiteur mariage'
  ];

  // Calcul du score SEO
  useEffect(() => {
    let score = 0;
    const titleLength = metaTitle.length;
    const descLength = metaDescription.length;
    
    // Titre optimisé (50-60 caractères)
    if (titleLength >= 50 && titleLength <= 60) score += 25;
    else if (titleLength >= 30 && titleLength <= 70) score += 15;
    
    // Description optimisée (150-160 caractères)
    if (descLength >= 150 && descLength <= 160) score += 25;
    else if (descLength >= 120 && descLength <= 180) score += 15;
    
    // Présence de mots-clés
    if (keywords.length >= 3) score += 20;
    else if (keywords.length >= 1) score += 10;
    
    // Slug optimisé
    if (slug && slug.length > 0 && slug.length <= 60) score += 15;
    
    // Contenu suffisant
    if (content.length >= 300) score += 15;
    
    setSeoScore(score);
    
    // Suggestions d'amélioration
    const newSuggestions = [];
    if (titleLength < 50) newSuggestions.push("Titre trop court (min 50 caractères)");
    if (titleLength > 60) newSuggestions.push("Titre trop long (max 60 caractères)");
    if (descLength < 150) newSuggestions.push("Meta description trop courte (min 150 caractères)");
    if (descLength > 160) newSuggestions.push("Meta description trop longue (max 160 caractères)");
    if (keywords.length < 3) newSuggestions.push("Ajoutez au moins 3 mots-clés");
    if (content.length < 300) newSuggestions.push("Contenu trop court (min 300 caractères)");
    
    setSuggestions(newSuggestions);
  }, [metaTitle, metaDescription, keywords, slug, content]);

  const getScoreColor = () => {
    if (seoScore >= 80) return 'text-green-600';
    if (seoScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreText = () => {
    if (seoScore >= 80) return 'Excellent';
    if (seoScore >= 60) return 'Bon';
    if (seoScore >= 40) return 'Moyen';
    return 'À améliorer';
  };

  return (
    <Tabs defaultValue="validator" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="validator">Validation</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="keywords">Mots-clés</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="validator">
        <SEORealtimeValidator
          title={title}
          content={content}
          metaTitle={metaTitle}
          metaDescription={metaDescription}
          h1Title={h1Title}
          keywords={keywords}
        />
      </TabsContent>

      <TabsContent value="seo" className="space-y-6">
        {/* Score SEO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Score SEO: {seoScore}/100
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={seoScore} className="w-full" />
              <div className={`text-center font-medium ${getScoreColor()}`}>
                {getScoreText()}
              </div>
              
              {suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Suggestions d'amélioration
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meta Données */}
        <Card>
          <CardHeader>
            <CardTitle>Structure du contenu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Titre H1 ({h1Title.length} caractères)
              </label>
              <Input
                value={h1Title}
                onChange={(e) => onMetaChange('h1_title', e.target.value)}
                placeholder="Titre principal de l'article (H1)"
                className={h1Title.length > 70 ? 'border-orange-500' : ''}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Le titre H1 principal de votre article pour une meilleure structure
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meta Données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Meta Titre ({metaTitle.length}/60)
              </label>
              <Input
                value={metaTitle}
                onChange={(e) => onMetaChange('metaTitle', e.target.value)}
                placeholder="Titre optimisé pour les moteurs de recherche..."
                className={metaTitle.length > 60 ? 'border-red-500' : metaTitle.length > 50 ? 'border-orange-500' : ''}
              />
              {metaTitle.length > 60 && (
                <p className="text-red-500 text-xs mt-1">Le titre dépasse 60 caractères</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Meta Description ({metaDescription.length}/160)
              </label>
              <Textarea
                value={metaDescription}
                onChange={(e) => onMetaChange('metaDescription', e.target.value)}
                placeholder="Description engageante qui incite au clic..."
                rows={3}
                className={metaDescription.length > 160 ? 'border-red-500' : metaDescription.length > 150 ? 'border-orange-500' : ''}
              />
              {metaDescription.length > 160 && (
                <p className="text-red-500 text-xs mt-1">La description dépasse 160 caractères</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Slug URL ({slug.length} caractères)
              </label>
              <Input
                value={slug}
                onChange={(e) => onSlugChange(e.target.value)}
                placeholder="slug-optimise-seo"
                className={slug.length > 60 ? 'border-orange-500' : ''}
              />
            </div>
          </CardContent>
        </Card>

        {/* Aperçu SERP */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Aperçu SERP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-white">
              <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                {metaTitle || title || 'Titre de l\'article'}
              </div>
              <div className="text-green-700 text-sm">
                mariable.fr/blog/{slug || 'article'}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {metaDescription || 'Description de l\'article qui apparaîtra dans les résultats de recherche...'}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="keywords">
        <KeywordSuggestions
          title={title}
          content={content}
          currentKeywords={keywords}
          onKeywordsChange={onKeywordsChange}
        />
      </TabsContent>

      <TabsContent value="analytics">
        <BlogSEOAnalytics />
      </TabsContent>
    </Tabs>
  );
};

export default BlogSEOManager;