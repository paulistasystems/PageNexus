// background.js - Gerencia o clique no ícone da extensão

console.log("[PageNexus Background] Script carregado!");

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
