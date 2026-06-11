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

const CONTEXT_MENU_IDS = [
"run-all-tabs-close",
"run-tabs-right-close",
"run-tabs-left-close",
"run-other-tabs-close"
];

function createContextMenus() {
browser.contextMenus.create({
id: "run-all-tabs-close",
title: browser.i18n.getMessage("contextMenuRunAllTabsClose"),
contexts: ["tab"]
});

browser.contextMenus.create({
id: "run-tabs-right-close",
title: browser.i18n.getMessage("contextMenuRunTabsRightClose"),
contexts: ["tab"]
});

browser.contextMenus.create({
id: "run-tabs-left-close",
title: browser.i18n.getMessage("contextMenuRunTabsLeftClose"),
contexts: ["tab"]
});

browser.contextMenus.create({
id: "run-other-tabs-close",
title: browser.i18n.getMessage("contextMenuRunOtherTabsClose"),
contexts: ["tab"]
});
}

function removeContextMenus() {
for (const id of CONTEXT_MENU_IDS) {
browser.contextMenus.remove(id).catch(() => {});
}
}

async function updateContextMenus(show) {
if (show) {
createContextMenus();
} else {
removeContextMenus();
}
}

browser.storage.local.get('showContextMenus').then((result) => {
if (result.showContextMenus === true) {
createContextMenus();
}
});

browser.storage.onChanged.addListener((changes, area) => {
if (area === 'local' && 'showContextMenus' in changes) {
updateContextMenus(changes.showContextMenus.newValue === true);
}
});

async function runOnTabsAndClose(tabIds) {
  for (const id of tabIds) {
    try {
      await browser.tabs.sendMessage(id, { action: "toggleReaderMode" });
    } catch (error) {
      console.warn("[PageNexus Background] Não foi possível ativar modo de leitura na tab", id, ":", error.message);
    }
  }
  if (tabIds.length > 0) {
    browser.tabs.remove(tabIds);
  }
}

browser.contextMenus.onClicked.addListener((info, tab) => {
  const menuId = info.menuItemId;
  const currentWindowId = tab.windowId;
  const currentIndex = tab.index;
  const currentId = tab.id;

  browser.tabs.query({ windowId: currentWindowId }).then((allTabs) => {
    let targetTabs;

    if (menuId === "run-all-tabs-close") {
      targetTabs = allTabs;
    } else if (menuId === "run-tabs-right-close") {
      targetTabs = allTabs.filter(t => t.index > currentIndex);
    } else if (menuId === "run-tabs-left-close") {
      targetTabs = allTabs.filter(t => t.index < currentIndex);
    } else if (menuId === "run-other-tabs-close") {
      targetTabs = allTabs.filter(t => t.id !== currentId);
    } else {
      return;
    }

    const targetIds = targetTabs.map(t => t.id);
    console.log(`[PageNexus Background] Context menu "${menuId}": executando em ${targetIds.length} abas`);
    runOnTabsAndClose(targetIds);
  });
});

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
      maxCharsForAI,
      showContextMenus: false
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

  browser.tabs.sendMessage(tab.id, { action: "toggleReaderMode" })
  .then(response => {
    console.log("[PageNexus Background] Modo de leitura ativado:", response);
  })
  .catch(error => {
    console.error("[PageNexus Background] Erro ao ativar modo de leitura:", error);
    console.error("[PageNexus Background] Detalhes do erro:", error.message);
  });
});

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "closeTab") {
    console.log("[PageNexus Background] Fechando tab:", sender.tab.id);
    browser.tabs.remove(sender.tab.id);
  }
});
