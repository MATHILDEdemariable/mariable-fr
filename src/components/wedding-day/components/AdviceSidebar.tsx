
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Lightbulb, Clock, Heart, Camera, Users, CheckCircle2 } from 'lucide-react';

const AdviceSidebar: React.FC = () => {
  const { t } = useTranslation('monJourM');

  const categoryKeys = [
    { key: 'morning', icon: <Clock className="h-5 w-5 text-wedding-olive" /> },
    { key: 'photos', icon: <Camera className="h-5 w-5 text-wedding-olive" /> },
    { key: 'guests', icon: <Users className="h-5 w-5 text-wedding-olive" /> },
    { key: 'keyMoments', icon: <Heart className="h-5 w-5 text-wedding-olive" /> },
  ];

  const quickChecklist = t('advice.checklist', { returnObjects: true }) as string[];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-wedding-olive">
            <Lightbulb className="h-5 w-5" />
            {t('advice.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {categoryKeys.map((category) => {
            const tips = t(`advice.categories.${category.key}.tips`, { returnObjects: true }) as string[];
            return (
              <div key={category.key} className="space-y-3">
                <h4 className="flex items-center gap-2 font-medium text-sm">
                  {category.icon}
                  {t(`advice.categories.${category.key}.title`)}
                </h4>
                <ul className="space-y-2">
                  {(Array.isArray(tips) ? tips : []).map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                      <span className="w-1 h-1 bg-wedding-olive rounded-full mt-1.5 flex-shrink-0"></span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-wedding-olive text-sm">
            <CheckCircle2 className="h-4 w-4" />
            {t('advice.checklistTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(Array.isArray(quickChecklist) ? quickChecklist : []).map((item, index) => (
              <li key={index} className="text-xs text-gray-600 leading-relaxed flex items-start gap-2">
                <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdviceSidebar;
