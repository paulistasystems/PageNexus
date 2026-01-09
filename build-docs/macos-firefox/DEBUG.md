# Debug: Extensão Não Funciona ao Clicar no Ícone

## Passos para Debug

### 1. Verificar se Background Script Carregou

1. Abra o **Console do Navegador**: **Cmd+Shift+J**
2. Procure por: `[PageNexus Background] Script carregado!`
   - ✅ **Se aparecer**: Background script está funcionando
   - ❌ **Se não aparecer**: Há erro no background.js

### 2. Verificar se Ícone Está Clicável

1. Clique no ícone do PageNexus na barra de ferramentas
2. No Console do Navegador, procure por: `[PageNexus Background] Ícone clicado! Tab ID: X`
   - ✅ **Se aparecer**: Clique está sendo detectado
   - ❌ **Se não aparecer**: Ícone pode não estar configurado corretamente

### 3. Verificar se Mensagem Chega no Content Script

Depois de clicar no ícone, procure por:
- `[PageNexus] Ativando modo de leitura...` - Content script recebeu mensagem
- `[PageNexus Background] Erro ao ativar modo de leitura:` - Erro ao enviar mensagem

### 4. Erros Comuns

**Erro: "Could not establish connection"**
- Content script não está injetado na página
- **Solução**: Recarregue a página (F5) após carregar a extensão

**Erro: "Receiving end does not exist"**
- Content script não tem listener ativo
- **Solução**: Verifique se `content_script.js` tem o listener correto

**Nenhum log aparece**
- Background script não carregou
- **Solução**: Vá para `about:debugging` e veja erros

### 5. Checklist Completo

- [ ] Extensão carregada em `about:debugging`
- [ ] Extensão está ativa (não opaca/cinza)
- [ ] Background script carregou (veja log no console)
- [ ] Ícones existem em `icons/icon16.png` e `icons/icon48.png`
- [ ] Página foi recarregada após carregar extensão
- [ ] Página é compatível (teste com Wikipedia)

### 6. Teste Manual Direto

Se o ícone não funcionar, teste diretamente no console da página:

1. Abra uma página (ex: Wikipedia)
2. Pressione **Cmd+Option+I** (Console da Página)
3. Digite:
   ```javascript
   // Simula a mensagem do background
   browser.runtime.onMessage.addListener((msg) => {
     console.log("Mensagem recebida:", msg);
   });
   
   // Tenta ativar manualmente
   window.location.reload();
   ```

### 7. Logs Esperados

**Console do Navegador (Cmd+Shift+J):**
```
[PageNexus Background] Script carregado!
[PageNexus Background] Ícone clicado! Tab ID: 123
[PageNexus Background] Modo de leitura ativado: {success: true}
```

**Console da Página (Cmd+Option+I):**
```
[PageNexus] Ativando modo de leitura...
[PageNexus] Texto preparado para IA: 4823 caracteres (limite: 10000)
```

---

**Me envie os logs que aparecem no console para eu te ajudar!**
