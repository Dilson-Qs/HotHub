import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Section {
  id: string;
  name: string;
  display_name: string;
  display_order: number;
  layout: 'scroll' | 'grid' | 'carousel';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionFormData {
  name: string;
  display_name: string;
  display_order: number;
  layout: 'scroll' | 'grid' | 'carousel';
  is_active: boolean;
}

export const useSections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSections((data as Section[]) || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar seções",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSection = async (formData: SectionFormData) => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Seção criada!",
        description: "A seção foi adicionada com sucesso.",
      });

      await fetchSections();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao criar seção",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updateSection = async (id: string, formData: Partial<SectionFormData>) => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .update(formData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Seção atualizada!",
        description: "As alterações foram salvas.",
      });

      await fetchSections();
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar seção",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteSection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Seção removida!",
        description: "A seção foi excluída.",
      });

      await fetchSections();
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Erro ao remover seção",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return {
    sections,
    isLoading,
    fetchSections,
    createSection,
    updateSection,
    deleteSection,
  };
};

// Hook for public section access - standalone hook to avoid nested hook issues
export const usePublicSections = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicSections = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('sections')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setSections((data as Section[]) || []);
      } catch (error) {
        console.error('Error loading sections:', error);
        setSections([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicSections();
  }, []);

  const getCarouselSection = () => sections.find(s => s.layout === 'carousel');
  const getContentSections = () => sections.filter(s => s.layout !== 'carousel');

  return {
    sections,
    isLoading,
    getCarouselSection,
    getContentSections,
  };
};
