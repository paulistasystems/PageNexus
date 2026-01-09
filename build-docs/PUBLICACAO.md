# Guia de Publicação - Firefox Add-ons

## 📦 Como Publicar a Extensão PageNexus no Firefox Add-ons

Este guia detalha todos os passos para publicar sua extensão no [addons.mozilla.org](https://addons.mozilla.org).

---

## 📋 Pré-requisitos

### 1. Conta Firefox
- Crie uma conta em [addons.mozilla.org](https://addons.mozilla.org)
- Verifique seu email

### 2. Preparar a Extensão
- ✅ Código finalizado e testado
- ✅ Todos os presets aprovados
- ✅ Sem erros no console
- ✅ Funcionalidade validada

---

## 🔧 Preparação para Publicação

### 1. Atualizar `manifest.json`

Certifique-se de que o `manifest.json` está completo:

```json
{
  "manifest_version": 2,
  "name": "PageNexus",
  "version": "1.0.0",
  "description": "Pagina artigos longos e limita texto para IAs nativas. Presets otimizados para ChatGPT, Copilot, Claude, Gemini e Mistral.",
  "homepage_url": "https://github.com/seu-usuario/PageNexus",
  "icons": {
    "48": "icons/icon-48.png",
    "96": "icons/icon-96.png"
  },
  "permissions": [
    "activeTab",
    "storage",
    "<all_urls>"
  ],
  "browser_action": {
    "default_icon": "icons/icon-48.png",
    "default_title": "PageNexus - Ativar modo de leitura"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": [
        "lib/Readability.js",
        "lib/TextLimiter.js",
        "content_script.js"
      ],
      "css": ["reader.css"]
    }
  ],
  "background": {
    "scripts": ["background.js"]
  },
  "options_ui": {
    "page": "options.html",
    "browser_style": true
  }
}
```

**Campos importantes:**
- `version`: Versão da extensão (formato semântico: `1.0.0`)
- `description`: Descrição clara e concisa (máx. 132 caracteres)
- `homepage_url`: URL do repositório GitHub (opcional mas recomendado)
- `icons`: Ícones em 48x48 e 96x96 pixels

### 2. Criar Ícones

Você precisa de ícones nos seguintes tamanhos:
- **48x48 pixels** (obrigatório)
- **96x96 pixels** (obrigatório)
- **128x128 pixels** (recomendado)

**Dica:** Use um gerador de ícones online ou crie no Figma/Photoshop.

Salve em: `PageNexus-Firefox/icons/`

### 3. Criar README.md

Crie um `README.md` descritivo:

```markdown
# PageNexus

Extensão Firefox para paginar artigos longos e limitar texto para IAs nativas.

## Funcionalidades

- 📄 Paginação inteligente de artigos
- 🤖 Presets otimizados para ChatGPT, Copilot, Claude, Gemini e Mistral
- ⚡ Salvamento automático de configurações
- 🎯 Função `getTextForAI()` para integração com IA

## Como Usar

1. Clique no ícone do PageNexus na barra de ferramentas
2. Configure seu LLM preferido em Opções
3. Navegue entre páginas com os botões
4. Use `await window.getTextForAI()` no console para obter texto limitado

## Presets Disponíveis

- ChatGPT: 5.000 caracteres
- Copilot: 3.000 caracteres
- Claude 3.5: 10.000 caracteres
- Gemini Flash: 20.000 caracteres
- Mistral Large: 8.000 caracteres
- Personalizado: 1.000 - 1.000.000 caracteres

## Licença

MIT License
```

### 4. Adicionar LICENSE

Crie um arquivo `LICENSE` (recomendado MIT):

```
MIT License

Copyright (c) 2025 [Seu Nome]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📦 Criar Pacote ZIP

### Passo 1: Limpar Arquivos Desnecessários

Remova arquivos que não devem ser incluídos:
- `.git/`
- `.DS_Store`
- `node_modules/` (se houver)
- Arquivos de teste
- Documentação de desenvolvimento

### Passo 2: Criar ZIP

**No macOS/Linux:**
```bash
cd /Users/paulista/PageNexus/PageNexus-Firefox
zip -r pagenexus-1.0.0.zip . -x "*.git*" -x "*.DS_Store" -x "*build-docs*"
```

**Ou manualmente:**
1. Selecione todos os arquivos necessários
2. Clique com botão direito → Comprimir
3. Renomeie para `pagenexus-1.0.0.zip`

**Arquivos que DEVEM estar no ZIP:**
- `manifest.json`
- `background.js`
- `content_script.js`
- `options.html`
- `options.js`
- `options.css`
- `reader.css`
- `lib/Readability.js`
- `lib/TextLimiter.js`
- `icons/` (pasta com ícones)
- `README.md`
- `LICENSE`

---

## 🚀 Publicar no Firefox Add-ons

### Passo 1: Acessar o Portal de Desenvolvedores

1. Vá para [addons.mozilla.org/developers](https://addons.mozilla.org/developers/)
2. Faça login com sua conta Firefox
3. Clique em **"Submit a New Add-on"**

### Passo 2: Upload do Arquivo ZIP

1. Escolha **"On this site"** (para publicar no AMO)
2. Faça upload do arquivo `pagenexus-1.0.0.zip`
3. Aguarde a validação automática

### Passo 3: Preencher Informações

#### Informações Básicas
- **Nome:** PageNexus
- **Slug:** pagenexus (URL: addons.mozilla.org/firefox/addon/pagenexus)
- **Resumo:** "Pagina artigos longos e limita texto para IAs nativas"
- **Descrição Completa:**
```
PageNexus transforma artigos longos em páginas navegáveis e prepara o texto para IAs nativas.

🎯 Funcionalidades:
• Paginação inteligente de artigos
• Presets otimizados para ChatGPT, Copilot, Claude, Gemini e Mistral
• Salvamento automático de configurações
• Função getTextForAI() para integração com IA

📊 Presets Disponíveis:
• ChatGPT: 5.000 caracteres
• Copilot: 3.000 caracteres
• Claude 3.5: 10.000 caracteres
• Gemini Flash: 20.000 caracteres
• Mistral Large: 8.000 caracteres
• Personalizado: configure seu próprio limite

⚡ Como Usar:
1. Clique no ícone do PageNexus
2. Configure seu LLM em Opções
3. Navegue entre páginas
4. Use window.getTextForAI() para obter texto limitado
```

#### Categorias
- **Productivity**
- **Web Development** (opcional)

#### Tags
- pagination
- ai
- llm
- chatgpt
- readability
- text-limiter

#### Licença
- MIT License

#### Política de Privacidade
```
Esta extensão não coleta, armazena ou transmite dados pessoais.
Todas as configurações são armazenadas localmente no navegador.
```

### Passo 4: Screenshots

Tire screenshots da extensão em ação:
1. **Screenshot 1:** Página paginada com botões de navegação
2. **Screenshot 2:** Tela de opções mostrando presets
3. **Screenshot 3:** Console mostrando `getTextForAI()` em uso

**Requisitos:**
- Formato: PNG ou JPG
- Tamanho: 1280x800 ou 640x400 pixels
- Máximo: 10 screenshots

### Passo 5: Revisão e Submissão

1. Revise todas as informações
2. Aceite os termos de serviço
3. Clique em **"Submit Version"**

---

## ⏳ Processo de Revisão

### O que acontece depois?

1. **Validação Automática** (imediata)
   - Verifica erros no código
   - Valida manifest.json
   - Escaneia por malware

2. **Revisão Manual** (1-7 dias)
   - Equipe Mozilla revisa o código
   - Verifica conformidade com políticas
   - Testa funcionalidades básicas

3. **Aprovação ou Rejeição**
   - **Aprovado:** Extensão publicada automaticamente
   - **Rejeitado:** Você recebe feedback e pode corrigir

### Dicas para Aprovação Rápida

✅ **Faça:**
- Código limpo e bem documentado
- Descrição clara e honesta
- Screenshots de qualidade
- Respeite as políticas da Mozilla

❌ **Evite:**
- Código ofuscado
- Permissões desnecessárias
- Descrição enganosa
- Violação de direitos autorais

---

## 🔄 Atualizações Futuras

### Como Publicar uma Nova Versão

1. Atualize o `version` no `manifest.json` (ex: `1.0.1`)
2. Crie novo ZIP com as mudanças
3. Vá em **"Manage My Submissions"**
4. Clique em **"Upload New Version"**
5. Faça upload do novo ZIP
6. Descreva as mudanças (changelog)
7. Submeta para revisão

### Versionamento Semântico

- **1.0.0 → 1.0.1:** Correção de bugs (patch)
- **1.0.0 → 1.1.0:** Novas funcionalidades (minor)
- **1.0.0 → 2.0.0:** Mudanças incompatíveis (major)

---

## 📊 Monitoramento

Após publicação, você pode:
- Ver estatísticas de downloads
- Ler reviews dos usuários
- Responder a comentários
- Monitorar relatórios de bugs

Acesse em: [addons.mozilla.org/developers/addons](https://addons.mozilla.org/developers/addons)

---

## 🆘 Recursos Úteis

- [Documentação Oficial](https://extensionworkshop.com/)
- [Políticas de Add-ons](https://extensionworkshop.com/documentation/publish/add-on-policies/)
- [Guia de Revisão](https://extensionworkshop.com/documentation/publish/add-on-review/)
- [Fórum de Desenvolvedores](https://discourse.mozilla.org/c/add-ons/35)

---

## ✅ Checklist Final

Antes de submeter, verifique:

- [ ] `manifest.json` completo e correto
- [ ] Ícones criados (48x48, 96x96)
- [ ] README.md criado
- [ ] LICENSE adicionado
- [ ] ZIP criado sem arquivos desnecessários
- [ ] Extensão testada localmente
- [ ] Screenshots preparados
- [ ] Descrição escrita
- [ ] Política de privacidade definida
- [ ] Conta no addons.mozilla.org criada

**Boa sorte com a publicação! 🚀**
