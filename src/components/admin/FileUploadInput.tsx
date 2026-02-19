import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link, Loader2, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  bucket: 'video-covers' | 'video-previews';
  accept?: string;
  placeholder?: string;
  required?: boolean;
}

export const FileUploadInput = ({
  label,
  value,
  onChange,
  bucket,
  accept = 'image/*',
  placeholder = 'https://...',
  required = false,
}: FileUploadInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O arquivo deve ter no máximo 50MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress('uploading');

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
      setUploadProgress('success');

      toast({
        title: 'Upload concluído!',
        description: 'O arquivo foi enviado com sucesso.',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadProgress('error');
      toast({
        title: 'Erro no upload',
        description: error.message || 'Não foi possível enviar o arquivo.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearValue = () => {
    onChange('');
    setUploadProgress('idle');
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      
      <Tabs defaultValue="url" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="url" className="text-xs">
            <Link className="w-3 h-3 mr-1" />
            URL
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs">
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="mt-2">
          <div className="relative">
            <Input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              required={required && !value}
            />
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={clearValue}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-2">
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileUpload}
              className="hidden"
              id={`file-upload-${bucket}`}
            />
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Escolher arquivo
                  </>
                )}
              </Button>
              
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={clearValue}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {uploadProgress === 'success' && value && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Arquivo enviado com sucesso
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      {value && (
        <div className="mt-2">
          {accept.includes('image') ? (
            <img
              src={value}
              alt="Preview"
              className="h-20 w-auto rounded-md object-cover border"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : accept.includes('video') ? (
            <video
              src={value}
              className="h-20 w-auto rounded-md object-cover border"
              controls={false}
              muted
            />
          ) : (
            <p className="text-xs text-muted-foreground truncate max-w-xs">{value}</p>
          )}
        </div>
      )}
    </div>
  );
};
