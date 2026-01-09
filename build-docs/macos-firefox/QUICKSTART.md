# Como Usar a Extensão PageNexus

## ✅ Extensão Carregada e Ativa

Agora a extensão funciona com **acionamento manual** via botão!

## 🎯 Como Ativar o Modo de Leitura

### Passo 1: Abra uma Página com Artigo

Abra qualquer página com conteúdo de artigo, por exemplo:
- https://pt.wikipedia.org/wiki/Inteligência_artificial
- https://pt.wikipedia.org/wiki/JavaScript
- Qualquer blog ou site de notícias

### Passo 2: Clique no Ícone da Extensão

Na barra de ferramentas do Firefox, você verá o ícone do **PageNexus** (um documento azul).

**Clique no ícone** para ativar o modo de leitura!

### Passo 3: Veja a Transformação

A página será transformada em modo de leitura:
- ✅ Layout limpo sem anúncios e menus
- ✅ Conteúdo paginado
- ✅ Botões de navegação: **« Anterior** | **Próxima »** | **Restaurar Original**

## ⚙️ Configurar a Extensão

1. Vá para `about:addons` no Firefox
2. Encontre **PageNexus** → **Opções**
3. Configure:
   - **Caracteres por página:** 2500 (padrão)
   - **Limite de caracteres para IA:** 10000 (padrão)
4. Salve

## 🧪 Testar Limitação para IA

Depois de ativar o modo de leitura em uma página:

1. Pressione **Cmd+Option+I** (Console do Desenvolvedor)
2. Digite:
   ```javascript
   await window.getTextForAI()
   ```
3. Pressione **Enter**
4. Você verá:
   ```
   [PageNexus] Texto preparado para IA: 4823 caracteres (limite: 10000)
   ```

## 📋 Resumo Rápido

1. **Abra** uma página com artigo
2. **Clique** no ícone do PageNexus na barra de ferramentas
3. **Navegue** usando os botões Anterior/Próxima
4. **Restaure** a página original clicando em "Restaurar Original"

## 🔄 Recarregar Extensão Após Mudanças

Se você modificou o código:

1. Vá para `about:debugging#/runtime/this-firefox`
2. Encontre **PageNexus**
3. Clique em **"Recarregar"** (ícone de seta circular)
4. Recarregue a página que está testando (F5)

## ❓ Problemas Comuns

**Ícone não aparece na barra de ferramentas:**
- Vá para `about:debugging` e recarregue a extensão
- Verifique se há erros no console

**Nada acontece ao clicar no ícone:**
- Abra o Console do Navegador (Cmd+Shift+J)
- Procure por erros `[PageNexus]`
- A página pode não ser compatível (tente Wikipedia)

**Página não é transformada:**
- Readability não conseguiu extrair o artigo
- Tente outra página (Wikipedia funciona bem)

---

**Pronto para testar!** 🚀

Agora você tem controle total sobre quando ativar o modo de leitura!
