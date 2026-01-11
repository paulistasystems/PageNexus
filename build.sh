#!/bin/bash

# Build script para PageNexus Firefox Extension
# Gera um arquivo ZIP para submissão ao Mozilla Add-ons (AMO)

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  PageNexus - Build Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Obtém a versão do manifest.json
VERSION=$(grep -o '"version": *"[^"]*"' manifest.json | cut -d'"' -f4)
echo -e "${YELLOW}Versão detectada: ${VERSION}${NC}"

# Nome do arquivo de saída
OUTPUT_FILE="pagenexus-v${VERSION}.zip"

# Remove arquivo anterior se existir
if [ -f "$OUTPUT_FILE" ]; then
    echo -e "${YELLOW}Removendo build anterior: ${OUTPUT_FILE}${NC}"
    rm "$OUTPUT_FILE"
fi

# Arquivos a serem incluídos
FILES=(
    "manifest.json"
    "background.js"
    "content_script.js"
    "Readability.js"
    "text_limiter.js"
    "options.html"
    "options.js"
    "options.css"
    "reader.css"
    "icons/"
)

echo -e "${YELLOW}Criando arquivo ZIP...${NC}"

# Cria o ZIP
zip -r "$OUTPUT_FILE" "${FILES[@]}" -x "*.DS_Store" -x "*__MACOSX*"

# Verifica se o arquivo foi criado
if [ -f "$OUTPUT_FILE" ]; then
    SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Build concluído com sucesso!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo -e "Arquivo: ${GREEN}${OUTPUT_FILE}${NC}"
    echo -e "Tamanho: ${GREEN}${SIZE}${NC}"
    echo ""
    echo -e "${YELLOW}Próximos passos:${NC}"
    echo "1. Acesse https://addons.mozilla.org/developers/"
    echo "2. Faça login com sua conta Mozilla"
    echo "3. Clique em 'Enviar um novo add-on'"
    echo "4. Faça upload do arquivo ${OUTPUT_FILE}"
else
    echo -e "${RED}Erro: Falha ao criar o arquivo ZIP${NC}"
    exit 1
fi
