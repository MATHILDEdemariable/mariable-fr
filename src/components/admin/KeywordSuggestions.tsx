import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, X, Search } from 'lucide-react';

interface KeywordSuggestionsProps {
  title: string;
  content: string;
  currentKeywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
}

const KeywordSuggestions: React.FC<KeywordSuggestionsProps> = ({
  title,
  content,
  currentKeywords,
  onKeywordsChange
}) => {
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour générer des suggestions de mots-clés basées sur le contenu
  const generateKeywordSuggestions = (title: string, content: string): string[] => {
    const commonWeddingKeywords = [
      'mariage', 'organisation mariage', 'planning mariage', 'budget mariage',
      'prestataires mariage', 'lieu de réception', 'photographe mariage',
      'traiteur mariage', 'décoration mariage', 'robe de mariée',
      'costume marié', 'alliance mariage', 'fleurs mariage',
      'musique mariage', 'animation mariage', 'wedding planner',
      'cérémonie laïque', 'cérémonie religieuse', 'vin d\'honneur',
      'repas mariage', 'gâteau mariage', 'faire-part mariage',
      'liste mariage', 'voyage de noces', 'lune de miel'
    ];

    const titleWords = title.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    const contentWords = content.toLowerCase().split(/\s+/).filter(word => word.length > 4);
    
    const allWords = [...titleWords, ...contentWords];
    const wordFrequency: Record<string, number> = {};
    
    allWords.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3) {
        wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
      }
    });

    const frequentWords = Object.entries(wordFrequency)
      .filter(([word, count]) => count > 1)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);

    const weddingRelated = commonWeddingKeywords.filter(keyword => 
      title.toLowerCase().includes(keyword) || 
      content.toLowerCase().includes(keyword)
    );

    const suggestions = [
      ...weddingRelated.slice(0, 8),
      ...frequentWords.slice(0, 4),
      ...commonWeddingKeywords.slice(0, 6)
    ];

    return [...new Set(suggestions)].filter(keyword => 
      !currentKeywords.includes(keyword)
    ).slice(0, 12);
  };

  useEffect(() => {
    if (title || content) {
      setIsLoading(true);
      setTimeout(() => {
        const suggestions = generateKeywordSuggestions(title, content);
        setSuggestedKeywords(suggestions);
        setIsLoading(false);
      }, 500);
    }
  }, [title, content, currentKeywords]);

  const addKeyword = (keyword: string) => {
    if (!currentKeywords.includes(keyword)) {
      onKeywordsChange([...currentKeywords, keyword]);
    }
  };

  const removeKeyword = (keyword: string) => {
    onKeywordsChange(currentKeywords.filter(k => k !== keyword));
  };

  const addCustomKeyword = () => {
    if (newKeyword.trim() && !currentKeywords.includes(newKeyword.trim())) {
      onKeywordsChange([...currentKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Suggestions de mots-clés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {suggestedKeywords.map((keyword, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => addKeyword(keyword)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {keyword}
                  </Button>
                ))}
              </div>
              
              {suggestedKeywords.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Ajoutez du contenu pour obtenir des suggestions de mots-clés
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mots-clés sélectionnés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un mot-clé personnalisé..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomKeyword()}
              />
              <Button onClick={addCustomKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {keyword}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeKeyword(keyword)}
                  />
                </Badge>
              ))}
            </div>
            
            {currentKeywords.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Aucun mot-clé sélectionné
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeywordSuggestions;