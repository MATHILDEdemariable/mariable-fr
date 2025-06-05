
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeddingChatbot from '@/components/wedding-assistant/v2/WeddingChatbot';

const AssistantPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif mb-2">Des questions ?</h1>
        <p className="text-muted-foreground">
          Notre assistant virtuel est là pour vous aider dans l'organisation de votre mariage
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Assistant Virtuel</CardTitle>
        </CardHeader>
        <CardContent>
          <WeddingChatbot preventScroll={true} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistantPage;
