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

    document.body.innerHTML = `
      <div id="pagenexus-container">
        <header id="pagenexus-header">
          <h1>${articleTitle}</h1>
          <p>${articleByline || ''}</p>
        </header>
        <div id="pagenexus-nav-top"></div>
        <div id="pagenexus-content"></div>
        <div id="pagenexus-nav-bottom"></div>
      </div>
    `;

    document.getElementById('pagenexus-content').appendChild(pageFragment.cloneNode(true));

    const navTop = document.getElementById('pagenexus-nav-top');
    const navBottom = document.getElementById('pagenexus-nav-bottom');

    const navigationHTML = `
      <button id="pagenexus-prev" ${currentPage === 0 ? 'disabled' : ''}>&laquo; Anterior</button>
      <span>Página ${currentPage + 1} de ${pages.length}</span>
      <button id="pagenexus-next" ${currentPage >= pages.length - 1 ? 'disabled' : ''}>Próxima &raquo;</button>
      <button id="pagenexus-restore">Restaurar Original</button>
    `;

    navTop.innerHTML = navigationHTML;
    navBottom.innerHTML = navigationHTML;

    document.querySelectorAll('#pagenexus-prev').forEach(btn => btn.addEventListener('click', prevPage));
    document.querySelectorAll('#pagenexus-next').forEach(btn => btn.addEventListener('click', nextPage));
    document.querySelectorAll('#pagenexus-restore').forEach(btn => btn.addEventListener('click', restoreOriginal));

    window.scrollTo(0, 0);
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

      const readerContentDiv = document.createElement('div');
      readerContentDiv.innerHTML = article.content;

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



