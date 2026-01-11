// background.js - Gerencia o clique no ícone da extensão

console.log("[PageNexus Background] Script carregado!");

// Configuração padrão dos limites
const DEFAULT_LIMITS = {
    chatgpt: 5000,
    copilot: 3000,
    claude: 10000,
    gemini: 35000,
    mistral: 8000,
    custom: 10000
};

// Handler de instalação - abre opções e define ChatGPT como padrão
browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        console.log("[PageNexus Background] Extensão instalada pela primeira vez!");

        // Define ChatGPT como LLM padrão
        const selectedLLM = 'chatgpt';
        const maxCharsForAI = DEFAULT_LIMITS[selectedLLM];

        browser.storage.local.set({
            selectedLLM,
            llmLimits: DEFAULT_LIMITS,
            maxCharsForAI
        }).then(() => {
            console.log(`[PageNexus Background] Configurações padrão salvas: ${selectedLLM} = ${maxCharsForAI.toLocaleString()} caracteres`);

            // Abre a página de opções
            browser.runtime.openOptionsPage();
        });
    }
});

browser.browserAction.onClicked.addListener((tab) => {
    console.log("[PageNexus Background] Ícone clicado! Tab ID:", tab.id);
    console.log("[PageNexus Background] URL da tab:", tab.url);

    // Envia mensagem para o content script ativar o modo de leitura
    browser.tabs.sendMessage(tab.id, { action: "toggleReaderMode" })
        .then(response => {
            console.log("[PageNexus Background] Modo de leitura ativado:", response);
        })
        .catch(error => {
            console.error("[PageNexus Background] Erro ao ativar modo de leitura:", error);
            console.error("[PageNexus Background] Detalhes do erro:", error.message);
        });
});
