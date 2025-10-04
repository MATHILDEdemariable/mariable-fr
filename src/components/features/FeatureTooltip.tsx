import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Feature } from '@/data/dashboardFeatures';

interface FeatureTooltipProps {
  feature: Feature | null;
  onClose: () => void;
}

export const FeatureTooltip = ({ feature, onClose }: FeatureTooltipProps) => {
  if (!feature) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="fixed z-50 max-w-md"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Card className="shadow-2xl border-2 border-wedding-olive/20 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-wedding-olive flex items-center gap-2">
              {feature.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
