import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, Mail, Eye, EyeOff, UserPlus, Copy } from 'lucide-react';
import hotpayLogo from '@/assets/hotpay-logo.png';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Email inválido').max(255),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleCopyUserId = async () => {
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

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate input
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    if (isSignUp) {
      // Sign up flow
      const { error: signUpError } = await signUp(email, password);

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Este email já está registrado. Tente fazer login.');
        } else {
          setError(signUpError.message);
        }
        setIsLoading(false);
        return;
      }

      // After signup, check if this is the first user and make them admin
      const {
        data: { user: newUser },
      } = await supabase.auth.getUser();

      if (newUser) {
        // Check if there are any admins yet
        const { data: existingAdmins } = await supabase
          .from('user_roles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);

        // If no admins exist, make this user the first admin
        if (!existingAdmins || existingAdmins.length === 0) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert([{ user_id: newUser.id, role: 'admin' }]);

          if (!roleError) {
            toast({
              title: 'Conta admin criada!',
              description: 'Você é o primeiro administrador do sistema.',
            });
            // Refresh to update admin status
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } else {
          toast({
            title: 'Conta criada!',
            description: 'Aguarde um administrador autorizar seu acesso.',
          });
        }
      }

      setIsLoading(false);
      return;
    }

    // Login flow
    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      if (signInError.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else {
        setError(signInError.message);
      }
      setIsLoading(false);
      return;
    }

    // Wait a bit for auth state to update and check admin status
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={hotpayLogo} alt="HotHub Logo" className="w-20 h-20 object-contain" />
          </div>
          <div>
            <CardTitle className="text-2xl">
              <span className="brand-text">Hot</span>
              <span className="text-foreground">Pay</span>
              <span className="text-muted-foreground ml-2 text-lg">Admin</span>
            </CardTitle>
            <CardDescription className="mt-2">
              {isSignUp ? 'Criar nova conta de administrador' : 'Acesse o painel de administração'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {user?.id && (
            <div className="mb-4 rounded-lg border border-border/60 bg-muted/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">User ID (para promoção de admin)</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground break-all">{user.id}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUserId}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hothub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-brand hover:bg-brand/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </>
              ) : (
                <>
                  {isSignUp && <UserPlus className="w-4 h-4 mr-2" />}
                  {isSignUp ? 'Criar Conta Admin' : 'Entrar'}
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isSignUp ? 'Já tem conta? Fazer login' : 'Primeiro acesso? Criar conta'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Voltar ao site
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
