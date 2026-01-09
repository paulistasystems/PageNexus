# PageNexus - Extensão de Paginação Inteligente

## 1. Objetivo

A finalidade desta extensão é diminuir o contexto em páginas para usar com a sidebar de IA do Firefox.

## 2. Requisitos Funcionais

### 2.1. Extração de Conteúdo Principal
A extensão deve usar a biblioteca Readability.js da Mozilla para analisar a página e extrair o artigo principal. Isso garante a remoção automática da maior parte do conteúdo periférico.

### 2.2. Paginação do Conteúdo Extraído
O conteúdo limpo, retornado pela Readability.js, deve ser dividido em páginas. A paginação é baseada em uma contagem de caracteres configurável, mas respeita a integridade dos elementos HTML (parágrafos, títulos), evitando quebras no meio deles.

### 2.3. Formato de Leitura Limpo
O conteúdo paginado deve ser exibido com uma estilização simples e legível (fonte serifada, bom espaçamento, layout de coluna única) para otimizar a experiência de leitura.

### 2.4. Navegação
A interface deve prover botões de "Próxima Página" e "Página Anterior", além de uma opção para restaurar a visualização original da página.

## 3. Configurações

O usuário poderá configurar os seguintes itens através de uma página de opções da extensão:

*   **Número de Caracteres por Página:** Um valor numérico que servirá como guia para a lógica de paginação inteligente.
*   **Limite de Caracteres para IA:** Limite máximo de caracteres ao enviar conteúdo para IA nativa do Firefox (padrão: 10.000). Evita erros 400 e outros limites ao resumir páginas grandes.

A configuração será salva localmente no navegador usando a API `browser.storage`.

## 4. Portabilidade

O código será escrito utilizando as APIs de WebExtensions, o que facilitará a adaptação futura para outros navegadores, como Google Chrome e Microsoft Edge, com o mínimo de alterações no código-fonte.

## 5. Estrutura de Arquivos e Componentes Chave

A extensão é composta pelos seguintes arquivos principais:

*   **`manifest.json`**: O arquivo de manifesto da extensão, que define metadados, permissões (incluindo `storage` para configurações e `tabs` para acesso à URL da página), e a injeção dos scripts de conteúdo (`Readability.js`, `text_limiter.js` e `content_script.js`) e estilos (`reader.css`).
*   **`Readability.js`**: A biblioteca externa utilizada para a extração do conteúdo principal da página, replicando a funcionalidade do "Modo Leitor" do Firefox.
*   **`text_limiter.js`**: Utilitário para truncar texto de forma inteligente, limitando o tamanho do conteúdo enviado para IA nativa do Firefox. Mantém parágrafos completos quando possível.
*   **`content_script.js`**: O script principal que é injetado nas páginas web. Ele coordena a extração do conteúdo via Readability, a paginação, a injeção da interface do usuário, a lógica de navegação e expõe a função `getTextForAI()` para preparar texto limitado para IA.
*   **`options.html`**: A interface de usuário para as configurações da extensão, permitindo que o usuário defina o número de caracteres por página e o limite para IA.
*   **`options.js`**: O script que gerencia a lógica da página de opções, salvando e carregando as preferências do usuário via `browser.storage`.
*   **`options.css`**: Estilos básicos para a página de opções.
*   **`reader.css`**: Folha de estilos dedicada a formatar o conteúdo extraído no modo de leitura, garantindo uma experiência visual limpa e focada.

## 6. Como Testar Localmente

### 6.1. Carregar a Extensão no Firefox

1. **Abra o Firefox**
2. **Digite na barra de endereços:** `about:debugging#/runtime/this-firefox`
3. **Clique em "Carregar extensão temporária..."** (Load Temporary Add-on)
4. **Navegue até a pasta** `/Users/username/PageNexus/PageNexus-Firefox/`
5. **Selecione o arquivo** `manifest.json`
6. A extensão será carregada temporariamente

### 6.2. Configurar a Extensão

1. Na página `about:debugging`, clique em **"Inspecionar"** ao lado da extensão PageNexus
2. Ou clique no ícone de extensões na barra de ferramentas e selecione **"Gerenciar extensão"**
3. Clique em **"Opções"** ou **"Preferências"**
4. Configure:
   - **Caracteres por página:** 2500 (padrão) ou ajuste conforme preferência
   - **Limite de caracteres para IA:** 10000 (padrão) ou ajuste conforme necessário

### 6.3. Testar Funcionalidades

#### Testar Paginação
1. Abra um artigo longo (ex: artigo da Wikipedia)
2. A extensão deve automaticamente extrair e paginar o conteúdo
3. Use os botões "Próxima" e "Anterior" para navegar
4. Clique em "Restaurar Original" para voltar à página original

#### Testar Limitação para IA
1. Abra um artigo muito longo (>10.000 caracteres)
2. Abra o Console do Desenvolvedor (F12)
3. Digite no console: `await window.getTextForAI()`
4. Verifique que o texto retornado está limitado ao valor configurado
5. Procure por logs como: `[PageNexus] Texto preparado para IA: XXXX caracteres (limite: 10000)`

#### Testar com IA Nativa do Firefox
1. Certifique-se de que a IA nativa do Firefox está habilitada
2. Abra um artigo longo
3. Use a funcionalidade de resumir do Firefox
4. Verifique que não ocorrem erros 400
5. O conteúdo deve ser limitado automaticamente

### 6.4. Depuração

**Ver logs da extensão:**
- Abra o Console do Navegador: `Ctrl+Shift+J` (Windows/Linux) ou `Cmd+Shift+J` (Mac)
- Filtre por `[PageNexus]` para ver apenas logs da extensão

**Recarregar após mudanças:**
1. Volte para `about:debugging#/runtime/this-firefox`
2. Clique em **"Recarregar"** ao lado da extensão
3. Ou pressione `Ctrl+R` na página de debugging

### 6.5. Testar Diferentes Cenários

| Cenário | Tamanho do Artigo | Comportamento Esperado |
|---------|-------------------|------------------------|
| Artigo pequeno | < 2.500 caracteres | Sem paginação, modo leitura simples |
| Artigo médio | 2.500 - 10.000 caracteres | Paginado, IA recebe conteúdo completo |
| Artigo grande | > 10.000 caracteres | Paginado, IA recebe conteúdo truncado |
| Artigo muito grande | > 50.000 caracteres | Paginado, IA recebe primeiros ~10k caracteres |

### 6.6. Problemas Comuns

**Extensão não carrega:**
- Verifique se o `manifest.json` está correto
- Veja erros no console de debugging

**Paginação não funciona:**
- Verifique se a página tem conteúdo extraível pelo Readability
- Algumas páginas não são compatíveis (ex: SPAs complexas)

**IA ainda retorna erro 400:**
- Reduza o limite de caracteres nas configurações
- Verifique se a função `getTextForAI()` está sendo chamada corretamente