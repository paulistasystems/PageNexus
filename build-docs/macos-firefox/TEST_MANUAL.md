# Debug Rápido - Teste Manual

Se a extensão não está funcionando, vamos testar manualmente no console:

## 1. Abra uma página da Wikipedia

Ex: https://pt.wikipedia.org/wiki/Inteligência_artificial

## 2. Abra o Console da Página (Cmd+Option+I)

## 3. Cole este código para testar o Readability:

```javascript
// Teste 1: Verificar se Readability está carregado
console.log("Readability disponível?", typeof Readability);

// Teste 2: Tentar extrair artigo
const documentClone = document.cloneNode(true);
const article = new Readability(documentClone).parse();

if (article) {
  console.log("✅ Artigo extraído com sucesso!");
  console.log("Título:", article.title);
  console.log("Tamanho:", article.length, "caracteres");
  console.log("Conteúdo (primeiros 200 chars):", article.textContent.substring(0, 200));
} else {
  console.log("❌ Falha ao extrair artigo");
}

// Teste 3: Verificar se listener está ativo
console.log("Listener de mensagens ativo?", browser.runtime.onMessage.hasListeners());
```

## 4. Me envie o resultado!

Isso vai nos dizer exatamente onde está o problema.
