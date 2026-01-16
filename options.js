// Configuração padrão dos limites
const DEFAULT_LIMITS = {
  chatgpt: 5000,
  copilot: 3000,
  claude: 10000,
  gemini: 35000,
  mistral: 8000,
  custom: 10000
};

// Mapeamento dos IDs de input para as chaves
const LIMIT_INPUTS = {
  limitChatgpt: 'chatgpt',
  limitCopilot: 'copilot',
  limitClaude: 'claude',
  limitGemini: 'gemini',
  limitMistral: 'mistral',
  limitCustom: 'custom'
};

// Mostra status de salvamento
function showStatus(message) {
  const status = document.getElementById('saveStatus');
  status.textContent = message;
  status.style.opacity = '1';
  setTimeout(() => {
    status.style.opacity = '0';
  }, 2000);
}

// Salva configurações automaticamente
function saveSettings() {
  const selectedLLM = document.getElementById('llmPreset').value;
  const autoCopyToClipboard = document.getElementById('autoCopyToClipboard').checked;

  // Coleta todos os limites customizados
  const limits = {};
  for (const [inputId, llmKey] of Object.entries(LIMIT_INPUTS)) {
    const input = document.getElementById(inputId);
    limits[llmKey] = parseInt(input.value, 10) || DEFAULT_LIMITS[llmKey];
  }

  // Calcula o maxCharsForAI baseado na seleção atual
  const maxCharsForAI = limits[selectedLLM];

  browser.storage.local.set({
    selectedLLM,
    llmLimits: limits,
    maxCharsForAI,
    autoCopyToClipboard
  }).then(() => {
    console.log(`[PageNexus] Configurações salvas: ${selectedLLM} = ${maxCharsForAI.toLocaleString()} caracteres, autoCopy: ${autoCopyToClipboard}`);
    showStatus('✓ Salvo');
  });
}

// Restaura opções ao carregar a página
function restoreOptions() {
  browser.storage.local.get(['selectedLLM', 'llmLimits', 'maxCharsForAI', 'autoCopyToClipboard']).then((result) => {
    // Restaura o LLM selecionado
    const selectedLLM = result.selectedLLM || 'chatgpt';
    document.getElementById('llmPreset').value = selectedLLM;

    // Restaura a configuração de cópia automática (padrão: desativado)
    const autoCopyToClipboard = result.autoCopyToClipboard === true;
    document.getElementById('autoCopyToClipboard').checked = autoCopyToClipboard;

    // Restaura os limites customizados
    const limits = result.llmLimits || DEFAULT_LIMITS;

    for (const [inputId, llmKey] of Object.entries(LIMIT_INPUTS)) {
      const input = document.getElementById(inputId);
      input.value = limits[llmKey] || DEFAULT_LIMITS[llmKey];
    }

    console.log(`[PageNexus] Configurações carregadas: ${selectedLLM}, autoCopy: ${autoCopyToClipboard}`);
  }).catch((error) => {
    console.log(`[PageNexus] Erro ao carregar: ${error}`);
  });
}

// Event listeners
document.getElementById('llmPreset').addEventListener('change', saveSettings);
document.getElementById('autoCopyToClipboard').addEventListener('change', saveSettings);

// Adiciona listeners para todos os inputs de limite
for (const inputId of Object.keys(LIMIT_INPUTS)) {
  document.getElementById(inputId).addEventListener('change', saveSettings);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
