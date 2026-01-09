# Como Testar a Extensão no macOS com Firefox

## Pré-requisitos

- Firefox instalado no macOS
- Extensão PageNexus baixada/clonada

## Método 1: Usando o Script Automático

```bash
cd /Users/username/PageNexus/PageNexus-Firefox/build-docs/macos-firefox
./run-extension.sh
```

O script abrirá o Firefox na página de debugging. Siga as instruções na tela.

## Método 2: Manual

### 1. Carregar a Extensão

1. Abra o Firefox
2. Digite na barra de endereços: `about:debugging#/runtime/this-firefox`
3. Clique em **"Carregar extensão temporária..."** (Load Temporary Add-on)
4. Navegue até a pasta da extensão
5. Selecione o arquivo `manifest.json`
6. A extensão será carregada ✅

### 2. Configurar a Extensão

1. Na página `about:debugging`, encontre **PageNexus** na lista de extensões
2. Clique em **"Inspecionar"** (opcional, para ver logs)
3. Ou clique no ícone de **puzzle** 🧩 na barra de ferramentas do Firefox
4. Encontre **PageNexus** e clique no ícone de **engrenagem** ⚙️
5. Ou vá para `about:addons` → PageNexus → **Opções**

**Configurações disponíveis:**
- **Caracteres por página:** Controla quantos caracteres por página no modo de leitura (padrão: 2500)
- **Limite de caracteres para IA:** Limite máximo ao enviar para IA nativa (padrão: 10000)

### 3. Testar a Funcionalidade de Limitação para IA

#### Preparação
1. Configure o limite de caracteres para IA (ex: 5000 para testar com artigos menores)
2. Salve as configurações

#### Teste com Console do Desenvolvedor

1. Abra uma página com muito conteúdo (ex: https://pt.wikipedia.org/wiki/Inteligência_artificial)
2. Pressione **F12** ou **Cmd+Option+I** para abrir o Console do Desenvolvedor
3. Digite no console:
   ```javascript
   await window.getTextForAI()
   ```
4. Pressione **Enter**

**Resultado esperado:**
- O console retornará o texto limitado
- Você verá um log: `[PageNexus] Texto preparado para IA: XXXX caracteres (limite: 5000)`
- O texto retornado terá no máximo 5000 caracteres
- Se o artigo for maior, verá `[...conteúdo truncado...]` no final

#### Teste com IA Nativa do Firefox

> **Nota:** A IA nativa do Firefox pode não estar disponível em todas as versões/regiões.

1. Abra um artigo longo (>10.000 caracteres)
2. Use a funcionalidade de resumir do Firefox (se disponível)
3. Verifique que não ocorrem erros 400
4. O conteúdo será automaticamente limitado antes de ser enviado

### 4. Testar Paginação

1. Abra um artigo longo (ex: artigo da Wikipedia)
2. A extensão automaticamente:
   - Extrai o conteúdo principal
   - Remove menus, anúncios, barras laterais
   - Divide em páginas
   - Exibe em modo de leitura limpo

3. Use os controles:
   - **« Anterior** - Volta para página anterior
   - **Próxima »** - Avança para próxima página
   - **Restaurar Original** - Volta para a página original

### 5. Ver Logs de Depuração

**Console do Navegador:**
1. Pressione **Cmd+Shift+J** (macOS)
2. Filtre por `[PageNexus]` para ver apenas logs da extensão

**Logs úteis:**
- `[PageNexus] Texto preparado para IA: X caracteres (limite: Y)`
- `[PageNexus] Conteúdo do artigo é menor que o limite. Nenhuma ação necessária.`
- `[PageNexus] Readability não conseguiu extrair o artigo.`

### 6. Recarregar Após Mudanças no Código

Se você modificar o código da extensão:

1. Volte para `about:debugging#/runtime/this-firefox`
2. Encontre **PageNexus** na lista
3. Clique em **"Recarregar"** (ícone de seta circular)
4. Ou pressione **Ctrl+R** / **Cmd+R** na página de debugging

### 7. Exemplos de Teste

#### Teste 1: Artigo Pequeno
- **URL:** Artigo curto da Wikipedia (<2500 caracteres)
- **Esperado:** Modo leitura sem paginação
- **Console:** `await window.getTextForAI()` retorna texto completo

#### Teste 2: Artigo Médio
- **URL:** https://pt.wikipedia.org/wiki/JavaScript
- **Esperado:** Paginação ativa, múltiplas páginas
- **Console:** `await window.getTextForAI()` retorna texto completo (se <10k)

#### Teste 3: Artigo Grande
- **URL:** https://pt.wikipedia.org/wiki/Inteligência_artificial
- **Esperado:** Paginação ativa, muitas páginas
- **Console:** `await window.getTextForAI()` retorna texto truncado em ~10k caracteres

### 8. Problemas Comuns

#### Extensão não aparece após carregar
- **Solução:** Verifique erros no console de debugging
- Certifique-se de que selecionou `manifest.json`

#### `window.getTextForAI is not a function`
- **Solução:** Recarregue a página após carregar a extensão
- A função só está disponível após o content script ser injetado

#### Paginação não funciona em algumas páginas
- **Causa:** Readability não consegue extrair conteúdo de todas as páginas
- **Páginas incompatíveis:** SPAs complexas, páginas dinâmicas
- **Solução:** Normal, nem todas as páginas são compatíveis

#### IA ainda retorna erro 400
- **Solução:** Reduza o limite nas configurações (ex: 5000 caracteres)
- Verifique se a IA está chamando `getTextForAI()` corretamente

## Desinstalar/Remover

1. Vá para `about:debugging#/runtime/this-firefox`
2. Encontre **PageNexus**
3. Clique em **"Remover"**

Ou simplesmente feche o Firefox - extensões temporárias são removidas automaticamente.
