
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  createdAt: Date;
}

const DOCUMENTS_DATA: Document[] = [
  { 
    id: '1', 
    name: 'Devis_Chateau_Des_Fleurs.pdf', 
    type: 'pdf', 
    size: '1.2 MB', 
    createdAt: new Date(2023, 3, 15) 
  },
  { 
    id: '2', 
    name: 'Contrat_Traiteur_Délices.pdf', 
    type: 'pdf', 
    size: '850 KB', 
    createdAt: new Date(2023, 3, 10) 
  },
  { 
    id: '3', 
    name: 'Liste_invités_finale.xlsx', 
    type: 'xlsx', 
    size: '320 KB', 
    createdAt: new Date(2023, 2, 28) 
  },
];

const DocumentsSection: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-serif">Documents & Devis</CardTitle>
        <CardDescription>
          Accédez rapidement à vos documents importants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {DOCUMENTS_DATA.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mt-2">
              Aucun document enregistré
            </p>
            <Button className="mt-4 bg-wedding-olive hover:bg-wedding-olive/90">
              Ajouter un document
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {DOCUMENTS_DATA.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between border rounded-md p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-wedding-olive/10 p-2 rounded">
                    <FileText className="h-4 w-4 text-wedding-olive" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[180px] sm:max-w-none">
                      {doc.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.size} • {doc.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="w-full mt-4" 
              asChild
            >
              <Link to="/dashboard/documents">
                Voir tous les documents <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
