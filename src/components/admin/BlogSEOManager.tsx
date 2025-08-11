import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Search, Target, TrendingUp } from 'lucide-react';

interface BlogSEOManagerProps {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  onMetaChange: (field: string, value: string) => void;
  onSlugChange: (slug: string) => void;
}

const BlogSEOManager: React.FC<BlogSEOManagerProps> = ({
  title,
  content,
  metaTitle,
  metaDescription,
  slug,
  onMetaChange,
  onSlugChange
}) => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState('');
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

  const addKeyword = () => {
    if (currentKeyword && !keywords.includes(currentKeyword)) {
      setKeywords([...keywords, currentKeyword]);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const addSuggestedKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
    }
  };

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
    <div className="space-y-6">
      {/* Score SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Score SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-3xl font-bold ${getScoreColor()}`}>
              {seoScore}/100
            </div>
            <div>
              <p className={`font-medium ${getScoreColor()}`}>
                {getScoreText()}
              </p>
              <p className="text-sm text-muted-foreground">
                Score d'optimisation SEO
              </p>
            </div>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-4">
              <p className="font-medium mb-2">Suggestions d'amélioration :</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Méta données SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Méta données SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">
              Titre SEO ({metaTitle.length}/60)
            </Label>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={(e) => onMetaChange('metaTitle', e.target.value)}
              placeholder="Titre optimisé pour les moteurs de recherche"
              className={metaTitle.length > 60 ? 'border-red-500' : ''}
            />
          </div>
          
          <div>
            <Label htmlFor="metaDescription">
              Meta Description ({metaDescription.length}/160)
            </Label>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => onMetaChange('metaDescription', e.target.value)}
              placeholder="Description attrayante qui apparaîtra dans les résultats de recherche"
              className={metaDescription.length > 160 ? 'border-red-500' : ''}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="slug">
              URL (Slug)
            </Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="url-de-larticle"
            />
          </div>
        </CardContent>
      </Card>

      {/* Mots-clés */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Mots-clés cibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              placeholder="Ajouter un mot-clé"
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <Button onClick={addKeyword} variant="outline">
              Ajouter
            </Button>
          </div>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeKeyword(keyword)}
                >
                  {keyword} ×
                </Badge>
              ))}
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-2">Suggestions :</p>
            <div className="flex flex-wrap gap-2">
              {suggestedKeywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => addSuggestedKeyword(keyword)}
                >
                  {keyword} +
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prévisualisation SERP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Prévisualisation SERP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-white">
            <div className="text-sm text-green-600 mb-1">
              mariable.fr › blog › {slug || 'slug-article'}
            </div>
            <div className="text-lg text-blue-600 font-medium mb-1 hover:underline cursor-pointer">
              {metaTitle || title || 'Titre de l\'article'}
            </div>
            <div className="text-sm text-gray-600 leading-relaxed">
              {metaDescription || 'Meta description de l\'article qui apparaîtra dans les résultats de recherche Google.'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSEOManager;