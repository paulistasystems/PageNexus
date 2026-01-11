(function () {
  if (window.self !== window.top) {
    return;
  }

  const DEFAULT_CHARS_PER_PAGE = 2500;
  const DEFAULT_MAX_CHARS_FOR_AI = 10000;

  let originalBody = null;
  let pages = [];
  let currentPage = 0;
  let articleTitle = '';
  let articleByline = '';

  function collectNodes(root) {
    // Coleta apenas elementos de conteúdo individuais (parágrafos, títulos, itens de lista, etc)
    // DIVs são containers, não conteúdo, então continuamos percorrendo
    const contentElements = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'PRE', 'TABLE', 'UL', 'OL'];
    const nodes = [];

    function traverse(element) {
      if (!element || !element.tagName) return;

      const tagName = element.tagName.toUpperCase();

      // Ignora scripts, styles, etc
      if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'NOSCRIPT') {
        return;
      }

      // Se é um elemento de conteúdo com texto, adiciona ele
      if (contentElements.includes(tagName)) {
        const text = element.textContent.trim();
        if (text.length > 0) {
          nodes.push(element);
        }
        // Não percorre filhos de elementos de conteúdo (para evitar duplicação)
        return;
      }

      // Caso contrário (incluindo DIVs), percorre os filhos
      if (element.children && element.children.length > 0) {
        for (const child of element.children) {
          traverse(child);
        }
      }
    }

    traverse(root);
    console.log("[PageNexus] collectNodes retornou", nodes.length, "elementos de conteúdo");
    return nodes;
  }

  function paginate(nodes, charsPerPage) {
    pages = [];
    if (nodes.length === 0) return;

    console.log("[PageNexus] Paginando", nodes.length, "nós com limite de", charsPerPage, "caracteres por página");

    let currentPageFragment = document.createDocumentFragment();
    let currentPageLength = 0;

    for (const node of nodes) {
      const nodeTextLength = node.textContent.trim().length;

      if (currentPageLength + nodeTextLength > charsPerPage && currentPageLength > 0) {
        pages.push(currentPageFragment);
        console.log("[PageNexus] Página", pages.length, "criada com", currentPageLength, "caracteres");
        currentPageFragment = document.createDocumentFragment();
        currentPageLength = 0;
      }

      currentPageFragment.appendChild(node.cloneNode(true));
      currentPageLength += nodeTextLength;
    }

    if (currentPageLength > 0) {
      pages.push(currentPageFragment);
      console.log("[PageNexus] Página", pages.length, "criada com", currentPageLength, "caracteres");
    }

    console.log("[PageNexus] Total de páginas criadas:", pages.length);

    displayPage(0);
  }

  function displayPage(pageIndex) {
    currentPage = pageIndex;
    const pageFragment = pages[currentPage];

    console.log("[PageNexus] Exibindo página", currentPage + 1, "de", pages.length);
    console.log("[PageNexus] Fragmento tem", pageFragment.childNodes.length, "nós filhos");

    // Limpa o body de forma segura
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    // Cria estrutura do container usando DOM API
    const container = document.createElement('div');
    container.id = 'pagenexus-container';

    const header = document.createElement('header');
    header.id = 'pagenexus-header';
    const h1 = document.createElement('h1');
    h1.textContent = articleTitle;
    const bylineP = document.createElement('p');
    bylineP.textContent = articleByline || '';
    header.appendChild(h1);
    header.appendChild(bylineP);

    const navTop = document.createElement('div');
    navTop.id = 'pagenexus-nav-top';
    const contentDiv = document.createElement('div');
    contentDiv.id = 'pagenexus-content';
    const navBottom = document.createElement('div');
    navBottom.id = 'pagenexus-nav-bottom';

    container.appendChild(header);
    container.appendChild(navTop);
    container.appendChild(contentDiv);
    container.appendChild(navBottom);
    document.body.appendChild(container);

    contentDiv.appendChild(pageFragment.cloneNode(true));

    // Função helper para criar navegação de forma segura
    function createNavigation() {
      const nav = document.createDocumentFragment();

      const prevBtn = document.createElement('button');
      prevBtn.id = 'pagenexus-prev';
      prevBtn.textContent = '« Anterior';
      prevBtn.disabled = currentPage === 0;
      prevBtn.addEventListener('click', prevPage);

      const pageSpan = document.createElement('span');
      pageSpan.textContent = `Página ${currentPage + 1} de ${pages.length}`;

      const nextBtn = document.createElement('button');
      nextBtn.id = 'pagenexus-next';
      nextBtn.textContent = 'Próxima »';
      nextBtn.disabled = currentPage >= pages.length - 1;
      nextBtn.addEventListener('click', nextPage);

      const restoreBtn = document.createElement('button');
      restoreBtn.id = 'pagenexus-restore';
      restoreBtn.textContent = 'Restaurar Original';
      restoreBtn.addEventListener('click', restoreOriginal);

      nav.appendChild(prevBtn);
      nav.appendChild(pageSpan);
      nav.appendChild(nextBtn);
      nav.appendChild(restoreBtn);

      return nav;
    }

    navTop.appendChild(createNavigation());
    navBottom.appendChild(createNavigation());

    document.querySelectorAll('#pagenexus-prev').forEach(btn => btn.addEventListener('click', prevPage));
    document.querySelectorAll('#pagenexus-next').forEach(btn => btn.addEventListener('click', nextPage));
    document.querySelectorAll('#pagenexus-restore').forEach(btn => btn.addEventListener('click', restoreOriginal));

    window.scrollTo(0, 0);

    // Copia automaticamente o conteúdo da página para a área de transferência
    copyPageToClipboard();
  }

  /**
   * Copia o conteúdo da página atual para a área de transferência
   */
  async function copyPageToClipboard() {
    const contentDiv = document.getElementById('pagenexus-content');
    console.log('[PageNexus] Tentando copiar conteúdo...');

    if (!contentDiv) {
      console.error('[PageNexus] Elemento pagenexus-content não encontrado!');
      return;
    }

    const text = contentDiv.textContent.trim();
    console.log(`[PageNexus] Texto a copiar: ${text.length} caracteres`);

    try {
      // Tenta usar a API moderna de clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        console.log(`[PageNexus] ✅ Página ${currentPage + 1} copiada via Clipboard API`);
        showCopyFeedback();
      } else {
        // Fallback para execCommand
        copyUsingExecCommand(text);
      }
    } catch (error) {
      console.warn('[PageNexus] Clipboard API falhou, tentando fallback:', error);
      // Fallback para execCommand
      copyUsingExecCommand(text);
    }
  }

  /**
   * Fallback para copiar usando execCommand (para browsers mais antigos ou sem permissão)
   */
  function copyUsingExecCommand(text) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        console.log(`[PageNexus] ✅ Página ${currentPage + 1} copiada via execCommand`);
        showCopyFeedback();
      } else {
        console.error('[PageNexus] ❌ execCommand retornou false');
      }
    } catch (error) {
      console.error('[PageNexus] ❌ Erro ao copiar com execCommand:', error);
    }
  }

  /**
   * Mostra toast visual de que a página foi copiada
   */
  function showCopyFeedback() {
    // Remove toast anterior se existir
    const existingFeedback = document.getElementById('pagenexus-copy-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.id = 'pagenexus-copy-feedback';
    feedback.textContent = `📋 Página ${currentPage + 1} copiada!`;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(feedback);

    // Remove após 2 segundos
    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transition = 'opacity 0.3s ease';
      setTimeout(() => feedback.remove(), 300);
    }, 2000);
  }

  function nextPage() {
    if (currentPage < pages.length - 1) {
      displayPage(currentPage + 1);
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      displayPage(currentPage - 1);
    }
  }

  function restoreOriginal() {
    document.body.replaceWith(originalBody);
    // Recarrega a página para restaurar completamente o estado, incluindo scripts.
    window.location.reload();
  }



  function init() {
    // Obtém configuração de limite para IA (também usado para paginação)
    browser.storage.local.get("maxCharsForAI").then((result) => {
      const charsPerPage = result.maxCharsForAI || DEFAULT_MAX_CHARS_FOR_AI;

      originalBody = document.body.cloneNode(true);

      console.log("[PageNexus] Tentando extrair artigo com Readability...");
      console.log("[PageNexus] URL:", window.location.href);
      console.log("[PageNexus] Título da página:", document.title);

      const documentClone = document.cloneNode(true);
      const article = new Readability(documentClone).parse();

      console.log("[PageNexus] Resultado do Readability:", article ? "Sucesso" : "Falhou");
      if (article) {
        console.log("[PageNexus] Título extraído:", article.title);
        console.log("[PageNexus] Tamanho do conteúdo:", article.length, "caracteres");
      }

      if (!article || !article.content) {
        console.log("[PageNexus] Readability não conseguiu extrair o artigo. Nenhuma ação necessária.");
        alert("❌ PageNexus: Não foi possível extrair o artigo desta página.\n\nTente com outra página (ex: artigos da Wikipedia).");
        return;
      }

      articleTitle = article.title;
      articleByline = article.byline;

      // Parse do conteúdo usando DOMParser (mais seguro que innerHTML)
      const parser = new DOMParser();
      const parsedDoc = parser.parseFromString(article.content, 'text/html');
      const readerContentDiv = document.createElement('div');
      while (parsedDoc.body.firstChild) {
        readerContentDiv.appendChild(parsedDoc.body.firstChild);
      }

      const allNodes = collectNodes(readerContentDiv);
      const totalTextLength = article.length;

      if (totalTextLength < charsPerPage) {
        console.log("[PageNexus] Conteúdo do artigo é menor que o limite. Nenhuma ação necessária.");
        // Mesmo assim, mostra o modo de leitura sem paginação
        pages.push(readerContentDiv);
        displayPage(0);
        return;
      }

      paginate(allNodes, charsPerPage);
    }).catch((error) => {
      console.error(`[PageNexus] Erro: ${error}`);
    });
  }

  // Listener para mensagens do background script
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleReaderMode") {
      console.log("[PageNexus] Ativando modo de leitura...");
      init();
      sendResponse({ success: true });
    }
    return true; // Mantém o canal aberto para resposta assíncrona
  });

  // NÃO chama init() automaticamente mais
  // init();

})();



