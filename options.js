const DEFAULT_LIMITS = {
  chatgpt: 5000,
  copilot: 3000,
  claude: 10000,
  gemini: 35000,
  mistral: 8000,
  custom: 10000
};

const LIMIT_INPUTS = {
  limitChatgpt: 'chatgpt',
  limitCopilot: 'copilot',
  limitClaude: 'claude',
  limitGemini: 'gemini',
  limitMistral: 'mistral',
  limitCustom: 'custom'
};

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const message = I18n.getMessage(key);
    if (message && message !== key) {
      if (el.tagName === 'OPTION') {
        el.textContent = message;
      } else {
        el.textContent = message;
      }
    }
  });

  document.querySelectorAll('[data-i18n-option]').forEach(el => {
    const key = el.getAttribute('data-i18n-option');
    const message = I18n.getMessage(key);
    if (message && message !== key) {
      el.textContent = message;
    }
  });

  const customOption = document.querySelector('#llmPreset option[value="custom"]');
  if (customOption) {
    customOption.textContent = I18n.getMessage('optionsCustom');
  }
}

function showStatus(message) {
  const status = document.getElementById('saveStatus');
  status.textContent = message;
  status.style.opacity = '1';
  setTimeout(() => {
    status.style.opacity = '0';
  }, 2000);
}

async function saveSettings() {
  const selectedLLM = document.getElementById('llmPreset').value;
  const autoCopyToClipboard = document.getElementById('autoCopyToClipboard').checked;
  const language = document.getElementById('language').value;

  const limits = {};
  for (const [inputId, llmKey] of Object.entries(LIMIT_INPUTS)) {
    const input = document.getElementById(inputId);
    limits[llmKey] = parseInt(input.value, 10) || DEFAULT_LIMITS[llmKey];
  }

  const maxCharsForAI = limits[selectedLLM];

  await browser.storage.local.set({
    selectedLLM,
    llmLimits: limits,
    maxCharsForAI,
    autoCopyToClipboard,
    language
  });

  console.log(`[PageNexus] Settings saved: ${selectedLLM} = ${maxCharsForAI.toLocaleString()} chars, autoCopy: ${autoCopyToClipboard}, language: ${language}`);
  showStatus(I18n.getMessage('optionsSaved'));
}

async function restoreOptions() {
  const result = await browser.storage.local.get(['selectedLLM', 'llmLimits', 'maxCharsForAI', 'autoCopyToClipboard', 'language']);

  const language = result.language || I18n._detectBrowserLocale();
  document.getElementById('language').value = language;
  await I18n.setLocale(language);
  applyTranslations();

  const selectedLLM = result.selectedLLM || 'chatgpt';
  document.getElementById('llmPreset').value = selectedLLM;

  const autoCopyToClipboard = result.autoCopyToClipboard === true;
  document.getElementById('autoCopyToClipboard').checked = autoCopyToClipboard;

  const limits = result.llmLimits || DEFAULT_LIMITS;

  for (const [inputId, llmKey] of Object.entries(LIMIT_INPUTS)) {
    const input = document.getElementById(inputId);
    input.value = limits[llmKey] || DEFAULT_LIMITS[llmKey];
  }

  console.log(`[PageNexus] Settings loaded: ${selectedLLM}, autoCopy: ${autoCopyToClipboard}, language: ${language}`);
}

document.getElementById('llmPreset').addEventListener('change', saveSettings);
document.getElementById('autoCopyToClipboard').addEventListener('change', saveSettings);
document.getElementById('language').addEventListener('change', async () => {
  const newLang = document.getElementById('language').value;
  await I18n.setLocale(newLang);
  applyTranslations();
  saveSettings();
});

for (const inputId of Object.keys(LIMIT_INPUTS)) {
  document.getElementById(inputId).addEventListener('change', saveSettings);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
