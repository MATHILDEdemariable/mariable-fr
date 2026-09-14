import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Package, Pencil, Plus, Search, Sparkles, Trash2 } from 'lucide-react';
import { VENDOR_CATEGORIES, getPriceUnit } from '@/data/constants';
import { usePriceCatalog, type PriceCatalogItem } from '@/hooks/usePriceCatalog';
import CatalogItemDialog from './CatalogItemDialog';

const PriceCatalogTab: React.FC = () => {
  const { t, i18n } = useTranslation('budget');
  const { toast } = useToast();
  const isEnglish = i18n.language?.startsWith('en');
  const { items, isLoading, createItem, updateItem, deleteItem, loadStandardTemplates } = usePriceCatalog();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceCatalogItem | null>(null);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter(item => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesQuery = !query
        || item.name.toLowerCase().includes(query)
        || (item.description || '').toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [items, search, categoryFilter]);

  const grouped = useMemo(() => {
    return VENDOR_CATEGORIES
      .map(category => ({
        category,
        entries: filteredItems.filter(item => item.category === category.key),
      }))
      .filter(group => group.entries.length > 0);
  }, [filteredItems]);

  const handleLoadTemplates = async () => {
    if (!window.confirm(t('catalog.templates.confirm'))) return;
    try {
      const count = await loadStandardTemplates.mutateAsync();
      toast({
        title: t('catalog.templates.successTitle'),
        description: count > 0
          ? t('catalog.templates.successDescription', { count })
          : t('catalog.templates.alreadyLoaded'),
      });
    } catch (error) {
      console.error('❌ loadStandardTemplates failed:', error);
      toast({ title: t('catalog.errors.title'), description: t('catalog.errors.generic'), variant: 'destructive' });
    }
  };

  const handleSubmit = async (values: Parameters<typeof createItem.mutateAsync>[0]) => {
    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem.id, ...values });
      } else {
        await createItem.mutateAsync(values);
      }
      toast({ title: t('catalog.toasts.savedTitle') });
    } catch (error) {
      console.error('❌ save catalog item failed:', error);
      toast({ title: t('catalog.errors.title'), description: t('catalog.errors.generic'), variant: 'destructive' });
    }
  };

  const handleDelete = async (item: PriceCatalogItem) => {
    if (!window.confirm(t('catalog.actions.deleteConfirm', { name: item.name }))) return;
    try {
      await deleteItem.mutateAsync(item.id);
      toast({ title: t('catalog.toasts.deletedTitle') });
    } catch (error) {
      console.error('❌ delete catalog item failed:', error);
      toast({ title: t('catalog.errors.title'), description: t('catalog.errors.generic'), variant: 'destructive' });
    }
  };

  const formatPrice = (value: number) => `${new Intl.NumberFormat('fr-FR').format(value)} €`;
  const unitLabel = (key: string) => {
    const unit = getPriceUnit(key);
    return isEnglish ? unit.en : unit.fr;
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-lg sm:text-xl font-serif text-wedding-olive">{t('catalog.title')}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('catalog.count', { count: items.length })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadTemplates}
            disabled={loadStandardTemplates.isPending}
            className="text-wedding-olive border-wedding-olive hover:bg-wedding-olive/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {t('catalog.templates.button')}
          </Button>
          <Button
            size="sm"
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            onClick={() => { setEditingItem(null); setDialogOpen(true); }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('catalog.actions.add')}
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('catalog.searchPlaceholder')}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="sm:w-64"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">{t('catalog.allCategories')}</SelectItem>
                {VENDOR_CATEGORIES.map(cat => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {cat.icon} {isEnglish ? cat.en : cat.fr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading ? (
        <p className="text-center py-10 text-muted-foreground">{t('catalog.loading')}</p>
      ) : grouped.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="py-14 text-center space-y-3">
              <Package className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">{t('catalog.empty')}</p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {grouped.map(({ category, entries }) => (
            <Card key={category.key}>
              <CardHeader className="py-3 border-b">
                <CardTitle className="text-base font-serif flex items-center gap-2">
                  <span aria-hidden>{category.icon}</span>
                  <span>{isEnglish ? category.en : category.fr}</span>
                  <span className="text-xs text-muted-foreground font-sans">({entries.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y">
                {entries.map(item => (
                  <div key={item.id} className="group flex items-start justify-between gap-3 p-3 sm:p-4">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      {item.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="font-semibold text-wedding-olive">{formatPrice(item.base_price)}</p>
                        <p className="text-xs text-muted-foreground">{unitLabel(item.price_unit)}</p>
                      </div>
                      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t('catalog.actions.edit')}
                          onClick={() => { setEditingItem(item); setDialogOpen(true); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t('catalog.actions.delete')}
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </motion.div>
      )}

      <CatalogItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSubmit={handleSubmit}
        isSubmitting={createItem.isPending || updateItem.isPending}
      />
    </div>
  );
};

export default PriceCatalogTab;
