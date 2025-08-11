import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, MousePointer, Clock } from 'lucide-react';

interface SEOMetrics {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnPage: string;
  organicTraffic: number;
  keywordRankings: Array<{
    keyword: string;
    position: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

interface BlogSEOAnalyticsProps {
  postId?: string;
  metrics?: SEOMetrics;
}

const BlogSEOAnalytics: React.FC<BlogSEOAnalyticsProps> = ({ 
  postId, 
  metrics = {
    pageViews: 1250,
    uniqueVisitors: 980,
    bounceRate: 35,
    avgTimeOnPage: '3m 45s',
    organicTraffic: 75,
    keywordRankings: [
      { keyword: 'organisation mariage', position: 12, trend: 'up' },
      { keyword: 'budget mariage 2024', position: 8, trend: 'up' },
      { keyword: 'prestataires mariage', position: 15, trend: 'stable' }
    ]
  }
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return <div className="h-4 w-4 bg-gray-300 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analytics SEO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-4 w-4 text-blue-500 mr-1" />
              </div>
              <div className="text-2xl font-bold">{metrics.pageViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Vues</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MousePointer className="h-4 w-4 text-green-500 mr-1" />
              </div>
              <div className="text-2xl font-bold">{metrics.uniqueVisitors.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Visiteurs uniques</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-4 w-4 text-orange-500 mr-1" />
              </div>
              <div className="text-2xl font-bold">{metrics.bounceRate}%</div>
              <div className="text-sm text-muted-foreground">Taux de rebond</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
              </div>
              <div className="text-2xl font-bold">{metrics.avgTimeOnPage}</div>
              <div className="text-sm text-muted-foreground">Temps moyen</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Positions des mots-clés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.keywordRankings.map((ranking, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{ranking.keyword}</span>
                  <Badge variant="outline">Position {ranking.position}</Badge>
                </div>
                <div className={`flex items-center gap-1 ${getTrendColor(ranking.trend)}`}>
                  {getTrendIcon(ranking.trend)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trafic organique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {metrics.organicTraffic}%
            </div>
            <div className="text-muted-foreground">
              du trafic provient des moteurs de recherche
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSEOAnalytics;