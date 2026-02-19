import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useVideos, Video, VideoFormData } from '@/hooks/useVideos';
import { useSections, Section, SectionFormData } from '@/hooks/useSections';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  LogOut,
  Video as VideoIcon,
  DollarSign,
  Star,
  Search,
  LayoutGrid,
  Settings,
  Gift,
  Copy,
  ExternalLink,
  Play,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FileUploadInput } from '@/components/admin/FileUploadInput';
import SectionsManager from '@/components/admin/SectionsManager';
import SiteSettings from '@/components/admin/SiteSettings';
import SpecialOfferSettings from '@/components/admin/SpecialOfferSettings';

import hotpayLogo from '@/assets/hotpay-logo.png';
import { resolveImageUrl } from '@/lib/imageAssets';

const emptyFormData: VideoFormData = {
  title: '',
  description: '',
  cover_image_url: '',
  preview_video_url: '',
  price: 0,
  benefits: [],
  category: '',
  featured: false,
  payment_link_url: '',
  section_id: null,
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const { videos, isLoading: videosLoading, createVideo, updateVideo, deleteVideo } = useVideos();
  const { sections, isLoading: sectionsLoading, createSection, updateSection, deleteSection } = useSections();

  const [activeTab, setActiveTab] = useState('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState<VideoFormData>(emptyFormData);
  const [benefitsText, setBenefitsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  const copyUserId = async () => {
    const id = user?.id;
    if (!id) return;

    try {
      await navigator.clipboard.writeText(id);
      toast({
        title: 'User ID copiado',
        description: 'O ID do usuário foi copiado para a área de transferência.',
      });
    } catch {
      toast({
        title: 'Não foi possível copiar',
        description: 'Seu navegador bloqueou o acesso à área de transferência.',
        variant: 'destructive',
      });
    }
  };

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenForm = (video?: Video) => {
    if (video) {
      setEditingVideo(video);
      setFormData({
        title: video.title,
        description: video.description || '',
        cover_image_url: video.cover_image_url,
        preview_video_url: video.preview_video_url || '',
        price: Number(video.price),
        benefits: video.benefits || [],
        category: video.category || '',
        featured: video.featured,
        payment_link_url: video.payment_link_url || '',
        section_id: video.section_id || null,
      });
      setBenefitsText((video.benefits || []).join('\n'));
    } else {
      setEditingVideo(null);
      setFormData(emptyFormData);
      setBenefitsText('');
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVideo(null);
    setFormData(emptyFormData);
    setBenefitsText('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data: VideoFormData = {
      ...formData,
      benefits: benefitsText.split('\n').filter(b => b.trim()),
    };

    if (editingVideo) {
      await updateVideo(editingVideo.id, data);
    } else {
      await createVideo(data);
    }

    setIsSubmitting(false);
    handleCloseForm();
  };

  const handleDelete = async () => {
    if (videoToDelete) {
      await deleteVideo(videoToDelete.id);
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (authLoading || (!user || !isAdmin)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <img src={hotpayLogo} alt="HotHub" className="w-10 h-10 object-contain shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl font-bold">
                <span className="brand-text">Hot</span>
                <span className="text-foreground">Pay</span>
                <span className="text-muted-foreground ml-2">Admin</span>
              </h1>
              <div className="mt-1 flex flex-col gap-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                {user?.id && (
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-xs font-mono text-muted-foreground break-all">{user.id}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={copyUserId}
                      className="h-7 px-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span className="sr-only">Copiar User ID</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid w-full grid-cols-3 gap-2 md:flex md:w-auto md:items-center md:gap-2">

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="w-full justify-center"
            >
              <ExternalLink className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Ver Site</span>
              <span className="sr-only sm:hidden">Ver Site</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-center">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
              <span className="sr-only sm:hidden">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 overflow-x-hidden">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-brand/10">
                <VideoIcon className="w-6 h-6 text-brand" />
              </div>
              <div>
                <p className="text-2xl font-bold">{videos.length}</p>
                <p className="text-sm text-muted-foreground">Total de Vídeos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-500/10">
                <Star className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{videos.filter(v => v.featured).length}</p>
                <p className="text-sm text-muted-foreground">Em Destaque</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-emerald-500/10">
                <DollarSign className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${videos.reduce((sum, v) => sum + Number(v.price), 0).toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">Valor Total</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <LayoutGrid className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sections.length}</p>
                <p className="text-sm text-muted-foreground">Seções</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="max-w-full overflow-x-auto">
            <TabsList className="w-max justify-start">
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <VideoIcon className="w-4 h-4" />
                Conteúdos
              </TabsTrigger>
              <TabsTrigger value="sections" className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                Seções
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configurações
              </TabsTrigger>
              <TabsTrigger value="offer" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Oferta
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="videos" className="space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar vídeos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleOpenForm()} className="bg-brand hover:bg-brand/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Conteúdo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingVideo ? 'Editar Conteúdo' : 'Adicionar Novo Conteúdo'}
                    </DialogTitle>
                    <DialogDescription>
                      Preencha as informações do vídeo/conteúdo
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Nome do conteúdo"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">Preço (USD) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          placeholder="29.99"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descrição do conteúdo..."
                        rows={3}
                      />
                    </div>

                    <FileUploadInput
                      label="Imagem de Capa"
                      value={formData.cover_image_url}
                      onChange={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
                      bucket="video-covers"
                      accept="image/*"
                      placeholder="https://..."
                      required
                    />

                    <FileUploadInput
                      label="Vídeo Preview"
                      value={formData.preview_video_url}
                      onChange={(url) => setFormData(prev => ({ ...prev, preview_video_url: url }))}
                      bucket="video-previews"
                      accept="video/*"
                      placeholder="https://..."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="section">Seção</Label>
                        <Select
                          value={formData.section_id || 'none'}
                          onValueChange={(value) => setFormData(prev => ({
                            ...prev,
                            section_id: value === 'none' ? null : value
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma seção" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Sem seção</SelectItem>
                            {sections.filter(s => s.layout !== 'carousel').map(section => (
                              <SelectItem key={section.id} value={section.id}>
                                {section.display_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="Ex: Exclusive, Hot..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment_link_url">Link de pagamento — opcional</Label>
                      <Input
                        id="payment_link_url"
                        value={formData.payment_link_url || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, payment_link_url: e.target.value }))
                        }
                        placeholder="https://t.me/user, https://wa.me/55..., https://checkout.stripe.com/..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Aceita qualquer link: Telegram (t.me), WhatsApp (wa.me), Stripe, PayPal, etc.
                      </p>
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="benefits">Benefícios (um por linha)</Label>
                      <Textarea
                        id="benefits"
                        value={benefitsText}
                        onChange={(e) => setBenefitsText(e.target.value)}
                        placeholder="Exclusive HD photos & videos&#10;Lifetime access&#10;Instant download"
                        rows={4}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                      />
                      <Label htmlFor="featured">Destaque no carrossel</Label>
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
                          editingVideo ? 'Salvar Alterações' : 'Criar Conteúdo'
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Videos Grid */}
            {videosLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
              </div>
            ) : filteredVideos.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <VideoIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum conteúdo encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? 'Tente uma busca diferente' : 'Adicione seu primeiro vídeo/conteúdo'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => handleOpenForm()} className="bg-brand hover:bg-brand/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Conteúdo
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredVideos.map((video) => (
                  <Card key={video.id} className="overflow-hidden group">
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={resolveImageUrl(video.cover_image_url)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      {video.featured && (
                        <Badge className="absolute top-2 right-2 bg-yellow-500">
                          <Star className="w-3 h-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-1 mb-1">{video.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span className="text-green-500 font-medium">${Number(video.price).toFixed(2)}</span>
                        {video.category && (
                          <>
                            <span>•</span>
                            <span>{video.category}</span>
                          </>
                        )}
                      </div>

                      {/* Preview URL */}
                      {video.preview_video_url && (
                        <div className="mb-3 p-2 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <Play className="w-3 h-3" />
                            <span>Link Preview:</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <code className="text-xs bg-background px-1.5 py-0.5 rounded flex-1 truncate">
                              {video.preview_video_url}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(video.preview_video_url!, 'Link de preview')}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => window.open(video.preview_video_url!, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleOpenForm(video)}
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setVideoToDelete(video);
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
          </TabsContent>

          <TabsContent value="sections">
            <SectionsManager />
          </TabsContent>

          <TabsContent value="settings">
            <SiteSettings />
          </TabsContent>

          <TabsContent value="offer">
            <SpecialOfferSettings />
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{videoToDelete?.title}"? Esta ação não pode ser desfeita.
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

export default Admin;
