import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Search, Eye, Clock, Target } from 'lucide-react';

interface SEORealtimeValidatorProps {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  h1Title: string;
  keywords: string[];
}

const SEORealtimeValidator: React.FC<SEORealtimeValidatorProps> = ({
  title,
  content,
  metaTitle,
  metaDescription,
  h1Title,
  keywords
}) => {
  // Calculs en temps réel
  const titleScore = metaTitle.length >= 30 && metaTitle.length <= 60 ? 100 : 
                   metaTitle.length > 0 ? 50 : 0;
  
  const descriptionScore = metaDescription.length >= 120 && metaDescription.length <= 160 ? 100 :
                          metaDescription.length > 0 ? 50 : 0;
  
  const keywordsScore = keywords.length >= 3 && keywords.length <= 8 ? 100 :
                       keywords.length > 0 ? 50 : 0;
  
  const contentScore = content.length >= 300 ? 100 : content.length > 100 ? 50 : 0;
  
  // Détection H1 depuis le champ h1Title ou dans le contenu
  const h1FromField = h1Title ? 1 : 0;
  const h1InContent = (content.match(/^#\s|<h1[^>]*>/gmi) || []).length;
  const totalH1 = h1FromField + h1InContent;
  
  // Détection H2 dans le contenu (markdown ## ou balises HTML)
  const h2Count = (content.match(/^##\s|<h2[^>]*>/gmi) || []).length;
  
  const structureScore = totalH1 === 1 && h2Count >= 2 ? 100 : 
                        totalH1 === 1 ? 75 : 
                        h2Count > 0 ? 50 : 0;
  
  const overallScore = Math.round((titleScore + descriptionScore + keywordsScore + contentScore + structureScore) / 5);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '✅';
    if (score >= 60) return '⚠️';
    return '❌';
  };

  const checks = [
    {
      name: 'Meta Titre',
      score: titleScore,
      current: metaTitle.length,
      optimal: '30-60 caractères',
      icon: <Target className="h-4 w-4" />
    },
    {
      name: 'Meta Description',
      score: descriptionScore,
      current: metaDescription.length,
      optimal: '120-160 caractères',
      icon: <Search className="h-4 w-4" />
    },
    {
      name: 'Mots-clés',
      score: keywordsScore,
      current: keywords.length,
      optimal: '3-8 mots-clés',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      name: 'Longueur contenu',
      score: contentScore,
      current: content.length,
      optimal: '300+ mots',
      icon: <Eye className="h-4 w-4" />
    },
    {
      name: 'Structure (H1/H2)',
      score: structureScore,
      current: `${totalH1} H1, ${h2Count} H2`,
      optimal: '1 H1, 2+ H2',
      icon: <Clock className="h-4 w-4" />
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Validation SEO en temps réel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Score global */}
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getScoreColor(overallScore)}`}>
              {overallScore}/100
            </div>
            <Progress value={overallScore} className="w-full mb-2" />
            <div className="text-sm text-muted-foreground">
              Score SEO global
            </div>
          </div>

          {/* Détail des vérifications */}
          <div className="space-y-3">
            {checks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {check.icon}
                  <div>
                    <div className="font-medium">{check.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Actuel: {check.current} | Optimal: {check.optimal}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getScoreIcon(check.score)}</span>
                  <Badge variant={check.score >= 80 ? 'default' : check.score >= 60 ? 'secondary' : 'destructive'}>
                    {check.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions rapides */}
          {overallScore < 80 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-800 mb-2">Améliorations suggérées</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                {titleScore < 80 && <li>• Optimisez la longueur de votre meta titre (30-60 caractères)</li>}
                {descriptionScore < 80 && <li>• Rédigez une meta description engageante (120-160 caractères)</li>}
                {keywordsScore < 80 && <li>• Ajoutez 3 à 8 mots-clés pertinents</li>}
                {contentScore < 80 && <li>• Enrichissez votre contenu (minimum 300 mots recommandé)</li>}
                {structureScore < 80 && <li>• Structurez avec 1 H1 et plusieurs H2</li>}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SEORealtimeValidator;