
## Objetivo imediato
Você quer ativar a proteção **“Leaked Password Protection”** (bloquear senhas já vazadas) nas **configurações de autenticação do backend (Lovable Cloud)** e, só depois, continuar a implementação de:
- Links de pagamento **manuais por vídeo**
- Telegram **global** + **override por vídeo**

Eu não consigo “clicar” nessas configurações por você (é uma configuração do backend), mas consigo te guiar para ativar e te dizer como validar que ficou funcionando.

---

## Como ativar (passo a passo no Lovable Cloud)
1. **Abra o Backend do projeto (Lovable Cloud)**
   - No editor do Lovable, vá na área de **Backend / Database / Auth** (o painel do backend).
   - Procure por **Authentication** (ou **Auth**).

2. **Entre em “Authentication settings”**
   - Dentro de Auth, procure uma seção como:
     - **Settings**
     - **Security**
     - **Password security**
     - **Policies**
   - O nome exato pode variar, mas o item normalmente está em um bloco de “segurança de senha”.

3. **Ative a opção de proteção de senhas vazadas**
   - Procure por um toggle/checkbox com um nome parecido com:
     - **Leaked Password Protection**
     - **Block compromised passwords**
     - **Prevent compromised passwords**
   - Ative (ON) e **salve**.

4. **Se não aparecer essa opção**
   - Me diga exatamente quais opções aparecem nessa área de “Password/Security” (pode ser print ou copiar os textos).
   - Em algumas configurações ela pode estar dentro de “Password strength / password policy” ou um submenu de “Security”.

---

## Como confirmar que está funcionando (teste rápido)
Depois de ativar:
1. Vá em **/admin/login**
2. Clique em **“Primeiro acesso? Criar conta”**
3. Tente cadastrar com uma senha muito comum/vazada (ex.: `Password123!`, `12345678`, `qwerty123`)
4. O sistema deve **recusar** com alguma mensagem do tipo “senha comprometida/leaked/too common”.

Se recusar, a proteção está ativa.

---

## O que eu farei na sequência (assim que você confirmar que ativou)
Quando você me confirmar aqui “já ativei”, eu continuo com a implementação dos 2 recursos no código, seguindo este desenho (já alinhado com o que você pediu):

### A) Links de pagamento manuais por vídeo (admin)
- Adicionar no formulário do vídeo no painel admin um campo:
  - **“Link de pagamento (checkout) – opcional”**
  - Salvar em `videos.payment_link_url`
- Ajustar o fluxo de compra:
  - Se `payment_link_url` existir no vídeo → abrir esse link direto
  - Senão → continuar o fallback atual (por preço) e por fim Telegram

### B) Telegram global + override por vídeo
- Criar/usar config global em `app_settings`:
  - key: `telegram_username`
  - value: `...`
- Ajustar a lógica:
  - Se o vídeo tiver `telegram_username` preenchido → usar ele
  - Senão → usar o `telegram_username` global vindo de `app_settings`
- Também ajustar componentes/hook para parar de ter `TELEGRAM_USERNAME` “hardcoded” em vários lugares e centralizar a fonte.

---

## Observações técnicas importantes (para quando eu voltar a implementar)
- Vi que hoje existem **3 lugares diferentes** com username fixo:
  - `src/components/PaymentModal.tsx` (const `TELEGRAM_USERNAME`)
  - `src/hooks/useVideos.ts` (const `TELEGRAM_USERNAME` + `generateTelegramLinks`)
  - `src/utils/telegram.ts` (const `TELEGRAM_USERNAME`)
  Vamos unificar isso para não ficar inconsistência.
- Também notei que apareceu um diff editando `src/integrations/supabase/types.ts` — esse arquivo é normalmente auto-gerado. Quando eu voltar a implementar, vou alinhar isso ao fluxo correto (sem manter edição manual), para não quebrar atualizações automáticas de tipos.

---

## O que eu preciso de você agora
1) Faça os passos acima e ative “Leaked Password Protection”.
2) Me responda aqui: **“Ativei”** (e se possível diga se o teste com senha comum foi bloqueado).  
Aí eu continuo a implementação dos links manuais por vídeo + Telegram global + override por vídeo.
