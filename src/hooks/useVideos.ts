import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { resolveImageUrl } from "@/lib/imageAssets";
import { generateBuyLink, generateSupportLink } from "@/utils/telegram";
import { useTelegramUsername } from "@/hooks/useAppSettings";

export interface Video {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string;
  preview_video_url: string | null;
  price: number;
  benefits: string[];
  category: string | null;
  featured: boolean;
  payment_link_url: string | null;
  section_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface VideoFormData {
  title: string;
  description: string;
  cover_image_url: string;
  preview_video_url: string;
  price: number;
  benefits: string[];
  category: string;
  featured: boolean;
  payment_link_url?: string;
  section_id: string | null;
}

// Generate Telegram links for a video (global username)
export const generateTelegramLinks = (video: { title: string; price: number }, telegramUsername: string) => {
  const telegramBuyLink = generateBuyLink(telegramUsername);
  const telegramSupportLink = generateSupportLink(video.title, video.price, telegramUsername);
  return { telegramBuyLink, telegramSupportLink };
};

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("videos").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      setVideos((data as Video[]) || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vídeos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createVideo = async (formData: VideoFormData) => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .insert([
          {
            title: formData.title,
            description: formData.description || null,
            cover_image_url: formData.cover_image_url,
            preview_video_url: formData.preview_video_url || null,
            price: formData.price,
            benefits: formData.benefits,
            category: formData.category || null,
            featured: formData.featured,
            payment_link_url: formData.payment_link_url?.trim() ? formData.payment_link_url.trim() : null,
            section_id: formData.section_id || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Vídeo criado!",
        description: "O conteúdo foi adicionado com sucesso.",
      });

      await fetchVideos();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar vídeo",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateVideo = async (id: string, formData: Partial<VideoFormData>) => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .update({
          title: formData.title,
          description: formData.description || null,
          cover_image_url: formData.cover_image_url,
          preview_video_url: formData.preview_video_url || null,
          price: formData.price,
          benefits: formData.benefits,
          category: formData.category || null,
          featured: formData.featured,
          payment_link_url: formData.payment_link_url?.trim() ? formData.payment_link_url.trim() : null,
          section_id: formData.section_id || null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Vídeo atualizado!",
        description: "As alterações foram salvas.",
      });

      await fetchVideos();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar vídeo",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const { error } = await supabase.from("videos").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Vídeo removido!",
        description: "O conteúdo foi excluído.",
      });

      await fetchVideos();
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover vídeo",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    isLoading,
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo,
  };
};

// Public-facing video type used by components
export interface PublicVideo {
  id: string;
  title: string;
  coverImage: string;
  previewVideoUrl: string;
  price: number;
  description: string;
  benefits: string[];
  category: string | null;
  featured: boolean;
  sectionId: string | null;
  paymentLinkUrl: string | null;
  telegramBuyLink: string;
  telegramSupportLink: string;
}

// Hook for public video access (converts DB format to app format)
export const usePublicVideos = () => {
  const { videos, isLoading } = useVideos();
  const { telegramUsername: globalTelegramUsername } = useTelegramUsername();

  const formattedVideos: PublicVideo[] = videos.map((video) => {
    return {
      id: video.id,
      title: video.title,
      coverImage: resolveImageUrl(video.cover_image_url),
      previewVideoUrl: video.preview_video_url || "",
      price: Number(video.price),
      description: video.description || "",
      benefits: video.benefits || [],
      category: video.category,
      featured: video.featured,
      sectionId: video.section_id,
      paymentLinkUrl: video.payment_link_url,
      ...generateTelegramLinks({ title: video.title, price: Number(video.price) }, globalTelegramUsername),
    };
  });

  const getVideosBySection = (sectionId: string) => formattedVideos.filter((v) => v.sectionId === sectionId);

  const getFeaturedVideos = () => formattedVideos.filter((v) => v.featured);
  const getVideoById = (id: string) => formattedVideos.find((v) => v.id === id);
  const getVideosByCategory = (category: string) => formattedVideos.filter((v) => v.category === category);
  const getAllCategories = () => [...new Set(formattedVideos.map((v) => v.category).filter(Boolean))];

  return {
    videos: formattedVideos,
    isLoading,
    getFeaturedVideos,
    getVideoById,
    getVideosByCategory,
    getVideosBySection,
    getAllCategories,
  };
};
