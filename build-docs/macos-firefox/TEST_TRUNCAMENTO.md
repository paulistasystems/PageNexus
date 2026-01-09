# Teste de Truncamento - PageNexus

## Teste Rápido no Console

Abra qualquer página da Wikipedia e cole este código no **Console da Página** (Cmd+Option+I):

```javascript
// Teste de truncamento
async function testarTruncamento() {
  console.log("🧪 Iniciando teste de truncamento...\n");
  
  // 1. Verificar configuração atual
  const config = await browser.storage.local.get("maxCharsForAI");
  const limite = config.maxCharsForAI || 10000;
  console.log(`⚙️ Limite configurado: ${limite.toLocaleString()} caracteres\n`);
  
  // 2. Obter texto preparado
  const textoPreparado = await window.getTextForAI();
  
  // 3. Verificar resultados
  console.log("📊 RESULTADOS DO TESTE:");
  console.log("─".repeat(50));
  console.log(`✅ Texto retornado: ${textoPreparado.length.toLocaleString()} caracteres`);
  console.log(`⚙️ Limite configurado: ${limite.toLocaleString()} caracteres`);
  console.log(`📏 Diferença: ${(limite - textoPreparado.length).toLocaleString()} caracteres`);
  
  // 4. Validação
  if (textoPreparado.length <= limite) {
    console.log("✅ PASSOU: Texto está dentro do limite!");
    
    if (textoPreparado.includes("[...conteúdo truncado...]")) {
      console.log("✂️ Texto foi truncado (contém marcador de truncamento)");
    } else {
      console.log("📄 Texto completo (não foi necessário truncar)");
    }
  } else {
    console.log("❌ FALHOU: Texto excede o limite!");
  }
  
  console.log("─".repeat(50));
  
  // 5. Mostrar amostra
  console.log("\n📝 Amostra do texto (primeiros 200 caracteres):");
  console.log(textoPreparado.substring(0, 200) + "...");
  
  return {
    limite: limite,
    tamanho: textoPreparado.length,
    passou: textoPreparado.length <= limite,
    foiTruncado: textoPreparado.includes("[...conteúdo truncado...]")
  };
}

// Executar teste
testarTruncamento();
```

## Teste com Diferentes Limites

Cole este código para testar com vários limites:

```javascript
async function testarMultiplosLimites() {
  const limites = [1000, 5000, 10000, 50000, 100000];
  
  console.log("🧪 Testando múltiplos limites...\n");
  
  for (const limite of limites) {
    // Salva limite temporário
    await browser.storage.local.set({ maxCharsForAI: limite });
    
    // Obtém texto
    const texto = await window.getTextForAI();
    
    // Resultados
    const passou = texto.length <= limite;
    const emoji = passou ? "✅" : "❌";
    
    console.log(`${emoji} Limite: ${limite.toLocaleString()} → Resultado: ${texto.length.toLocaleString()} caracteres`);
  }
  
  console.log("\n✅ Teste concluído!");
}

// Executar
testarMultiplosLimites();
```

## Teste Manual Simples

1. **Configure um limite baixo** (ex: 5.000 caracteres):
   - Vá em Opções → Selecione "Personalizado"
   - Digite 5000
   - Salve

2. **Abra um artigo grande** da Wikipedia (ex: Inteligência Artificial)

3. **No console**, digite:
   ```javascript
   await window.getTextForAI()
   ```

4. **Veja o alert** - deve mostrar:
   ```
   ✂️ PageNexus: Texto limitado
   
   📄 Original: 51.080 caracteres
   ✅ Limitado: 5.000 caracteres
   ⚙️ Limite configurado: 5.000 caracteres
   
   10% do texto original mantido.
   ```

5. **Verifique o texto retornado** - deve ter ~5.000 caracteres

## Teste de Precisão

Para verificar se o truncamento é preciso:

```javascript
async function testarPrecisao() {
  const limite = 10000;
  await browser.storage.local.set({ maxCharsForAI: limite });
  
  const texto = await window.getTextForAI();
  
  console.log("📏 Teste de Precisão:");
  console.log(`Limite: ${limite}`);
  console.log(`Tamanho: ${texto.length}`);
  console.log(`Diferença: ${Math.abs(limite - texto.length)}`);
  console.log(`Precisão: ${((texto.length / limite) * 100).toFixed(2)}%`);
  
  // Truncamento deve ser próximo do limite (±10%)
  const margem = limite * 0.1;
  const dentroMargem = Math.abs(limite - texto.length) <= margem;
  
  if (dentroMargem) {
    console.log("✅ Truncamento está preciso (dentro de ±10%)");
  } else {
    console.log("⚠️ Truncamento pode estar impreciso");
  }
}

testarPrecisao();
```

## Resultados Esperados

### ✅ Teste PASSOU se:
- Texto retornado ≤ Limite configurado
- Alert mostra informações corretas
- Marcador `[...conteúdo truncado...]` aparece quando necessário
- Parágrafos não são cortados no meio

### ❌ Teste FALHOU se:
- Texto retornado > Limite configurado
- Alert mostra valores incorretos
- Texto é cortado no meio de palavras/parágrafos

## Teste Automatizado (Futuro)

Para criar testes unitários reais, você precisaria:

1. **Framework de testes** (ex: Jest, Mocha)
2. **Ambiente de teste** para WebExtensions
3. **Mocks** do Readability e browser.storage

Por enquanto, os testes manuais no console são suficientes e funcionam perfeitamente! ✅
