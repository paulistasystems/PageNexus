/**
 * text_limiter.js
 * Utilitário para limitar texto antes de enviar para IA nativa do Firefox
 */

const TextLimiter = {
  /**
   * Trunca texto mantendo parágrafos completos quando possível
   * @param {string} text - Texto a ser truncado
   * @param {number} maxChars - Limite máximo de caracteres
   * @returns {string} - Texto truncado
   */
  truncateText(text, maxChars) {
    if (!text || text.length <= maxChars) {
      return text;
    }

    // Tenta truncar mantendo parágrafos completos
    const paragraphs = text.split(/\n\n+/);
    let result = '';
    
    for (const paragraph of paragraphs) {
      const trimmedParagraph = paragraph.trim();
      
      // Se adicionar este parágrafo ultrapassar o limite
      if (result.length + trimmedParagraph.length + 2 > maxChars) {
        // Se já temos algum conteúdo, retorna o que temos
        if (result.length > 0) {
          return result.trim() + '\n\n[...conteúdo truncado...]';
        }
        
        // Se nem o primeiro parágrafo cabe, trunca ele
        return trimmedParagraph.substring(0, maxChars - 30) + '...\n\n[...conteúdo truncado...]';
      }
      
      result += trimmedParagraph + '\n\n';
    }
    
    return result.trim();
  },

  /**
   * Trunca HTML mantendo estrutura quando possível
   * @param {string} html - HTML a ser truncado
   * @param {number} maxChars - Limite máximo de caracteres (do texto, não do HTML)
   * @returns {string} - HTML truncado
   */
  truncateHTML(html, maxChars) {
    // Cria um elemento temporário para extrair texto
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Extrai texto puro
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Se o texto já está dentro do limite, retorna o HTML original
    if (text.length <= maxChars) {
      return html;
    }
    
    // Trunca o texto
    const truncatedText = this.truncateText(text, maxChars);
    
    // Retorna o texto truncado (sem HTML para simplificar)
    return truncatedText;
  },

  /**
   * Prepara conteúdo de artigo para envio à IA
   * @param {Object} article - Objeto do Readability com title, content, textContent, etc.
   * @param {number} maxChars - Limite máximo de caracteres
   * @returns {string} - Texto formatado e truncado pronto para IA
   */
  prepareForAI(article, maxChars) {
    if (!article) {
      return '';
    }

    // Usa textContent se disponível, senão extrai do HTML
    let text = article.textContent || '';
    
    if (!text && article.content) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = article.content;
      text = tempDiv.textContent || tempDiv.innerText || '';
    }

    // Adiciona título e byline se disponíveis
    let result = '';
    
    if (article.title) {
      result += `Título: ${article.title}\n\n`;
    }
    
    if (article.byline) {
      result += `Autor: ${article.byline}\n\n`;
    }
    
    // Calcula quanto espaço resta para o conteúdo
    const remainingChars = maxChars - result.length;
    
    if (remainingChars <= 0) {
      // Se título e byline já ultrapassaram o limite, trunca só o título
      return this.truncateText(article.title || text, maxChars);
    }
    
    // Trunca o conteúdo
    const truncatedContent = this.truncateText(text, remainingChars);
    result += truncatedContent;
    
    return result;
  }
};

// Torna disponível globalmente para uso em outros scripts
if (typeof window !== 'undefined') {
  window.TextLimiter = TextLimiter;
}
