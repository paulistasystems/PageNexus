# Build & Run - PageNexus Extension

Documentação e scripts para facilitar o build e execução da extensão PageNexus em diferentes plataformas e navegadores.

## Plataformas Suportadas

### ✅ macOS + Firefox
- **Documentação:** [macos-firefox/TESTING.md](macos-firefox/TESTING.md)
- **Scripts:**
  - `run-extension.sh` - Abre Firefox para carregar a extensão
  - `test-ai-limit.sh` - Testa a limitação de texto para IA

### 🚧 Outras Plataformas (Em Breve)
- Windows + Firefox
- Linux + Firefox
- Chrome/Chromium (todas as plataformas)

## Início Rápido (macOS + Firefox)

### 1. Carregar Extensão

```bash
cd build-docs/macos-firefox
./run-extension.sh
```

Siga as instruções na tela para carregar o `manifest.json`.

### 2. Configurar

1. Vá para `about:addons` no Firefox
2. Encontre **PageNexus** → **Opções**
3. Configure:
   - **Caracteres por página:** 2500 (padrão)
   - **Limite de caracteres para IA:** 10000 (padrão)

### 3. Testar Limitação para IA

**Método 1: Console do Desenvolvedor**
```bash
# Abre Firefox com página de teste
./test-ai-limit.sh
```

Depois, no console do Firefox (Cmd+Option+I):
```javascript
await window.getTextForAI()
```

**Método 2: Manual**
1. Abra qualquer artigo longo (ex: Wikipedia)
2. Pressione **F12** ou **Cmd+Option+I**
3. Digite no console: `await window.getTextForAI()`
4. Verifique que o texto está limitado

## Estrutura de Diretórios

```
build-docs/
├── README.md                    # Este arquivo
└── macos-firefox/
    ├── TESTING.md              # Guia completo de testes
    ├── run-extension.sh        # Script para carregar extensão
    └── test-ai-limit.sh        # Script para testar limitação
```

## Documentação Detalhada

Para instruções completas, consulte:
- **macOS + Firefox:** [macos-firefox/TESTING.md](macos-firefox/TESTING.md)

## Contribuindo

Para adicionar suporte a novas plataformas/navegadores:

1. Crie uma pasta `[platform]-[browser]` (ex: `windows-firefox`)
2. Adicione um `TESTING.md` com instruções específicas
3. Crie scripts auxiliares quando aplicável
4. Atualize este README

## Problemas Comuns

### Extensão não carrega
- Verifique se selecionou o arquivo `manifest.json`
- Veja erros em `about:debugging`

### `getTextForAI()` não funciona
- Recarregue a página após carregar a extensão
- Verifique se a extensão está ativa

### Paginação não funciona
- Algumas páginas não são compatíveis com Readability
- Normal para SPAs complexas

## Links Úteis

- [Documentação do Firefox sobre extensões temporárias](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)
- [WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
