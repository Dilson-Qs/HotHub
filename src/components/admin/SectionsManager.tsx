import { useState } from 'react';
import { useSections, Section, SectionFormData } from '@/hooks/useSections';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  LayoutGrid,
  Rows,
  Images,
  GripVertical,
} from 'lucide-react';

const emptySectionFormData: SectionFormData = {
  name: '',
  display_name: '',
  display_order: 0,
  layout: 'scroll',
  is_active: true,
};

const SectionsManager = () => {
  const { sections, isLoading, createSection, updateSection, deleteSection } = useSections();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [formData, setFormData] = useState<SectionFormData>(emptySectionFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);

  const handleOpenForm = (section?: Section) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        name: section.name,
        display_name: section.display_name,
        display_order: section.display_order,
        layout: section.layout,
        is_active: section.is_active,
      });
    } else {
      setEditingSection(null);
      setFormData({
        ...emptySectionFormData,
        display_order: sections.length,
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSection(null);
    setFormData(emptySectionFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (editingSection) {
      await updateSection(editingSection.id, formData);
    } else {
      await createSection(formData);
    }

    setIsSubmitting(false);
    handleCloseForm();
  };

  const handleDelete = async () => {
    if (sectionToDelete) {
      await deleteSection(sectionToDelete.id);
      setDeleteDialogOpen(false);
      setSectionToDelete(null);
    }
  };

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case 'carousel':
        return <Images className="w-4 h-4" />;
      case 'grid':
        return <LayoutGrid className="w-4 h-4" />;
      default:
        return <Rows className="w-4 h-4" />;
    }
  };

  const getLayoutLabel = (layout: string) => {
    switch (layout) {
      case 'carousel':
        return 'Carrossel';
      case 'grid':
        return 'Grade';
      default:
        return 'Scroll';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Gerenciar Seções</h2>
          <p className="text-sm text-muted-foreground">
            Configure as seções da página inicial
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()} className="bg-brand hover:bg-brand/90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Seção
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSection ? 'Editar Seção' : 'Nova Seção'}
              </DialogTitle>
              <DialogDescription>
                Configure os detalhes da seção
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome (identificador)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    name: e.target.value.toLowerCase().replace(/\s+/g, '-') 
                  }))}
                  placeholder="ex: premium-content"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_name">Nome de Exibição</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="Ex: All Premium Content"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="layout">Layout</Label>
                  <Select
                    value={formData.layout}
                    onValueChange={(value: 'scroll' | 'grid' | 'carousel') => 
                      setFormData(prev => ({ ...prev, layout: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scroll">
                        <div className="flex items-center gap-2">
                          <Rows className="w-4 h-4" />
                          Scroll Horizontal
                        </div>
                      </SelectItem>
                      <SelectItem value="grid">
                        <div className="flex items-center gap-2">
                          <LayoutGrid className="w-4 h-4" />
                          Grade
                        </div>
                      </SelectItem>
                      <SelectItem value="carousel">
                        <div className="flex items-center gap-2">
                          <Images className="w-4 h-4" />
                          Carrossel (Hero)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_order">Ordem</Label>
                  <Input
                    id="display_order"
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      display_order: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Seção ativa</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseForm}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-brand hover:bg-brand/90" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    editingSection ? 'Salvar' : 'Criar'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <LayoutGrid className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma seção criada</h3>
            <p className="text-muted-foreground mb-4">
              Adicione seções para organizar o conteúdo da home
            </p>
            <Button onClick={() => handleOpenForm()} className="bg-brand hover:bg-brand/90">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Seção
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sections.map((section) => (
            <Card key={section.id} className={!section.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="cursor-move text-muted-foreground">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{section.display_name}</h3>
                    {!section.is_active && (
                      <Badge variant="secondary">Inativa</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {getLayoutIcon(section.layout)}
                      {getLayoutLabel(section.layout)}
                    </span>
                    <span>•</span>
                    <span>Ordem: {section.display_order}</span>
                    <span>•</span>
                    <span className="text-xs font-mono">{section.name}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenForm(section)}
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSectionToDelete(section);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a seção "{sectionToDelete?.display_name}"? 
              Os vídeos vinculados não serão excluídos, apenas desvinculados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SectionsManager;
