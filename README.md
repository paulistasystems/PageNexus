# PageNexus - Smart Pagination Extension

## 1. Purpose

This extension reduces page context for use with Firefox's AI sidebar.

## 2. Functional Requirements

### 2.1. Main Content Extraction
The extension uses Mozilla's Readability.js library to parse the page and extract the main article. This ensures automatic removal of most peripheral content.

### 2.2. Pagination of Extracted Content
The clean content returned by Readability.js is divided into pages. Pagination is based on a configurable character count but respects HTML element integrity (paragraphs, headings), avoiding breaks in the middle of them.

### 2.3. Clean Reading Format
Paginated content is displayed with simple, readable styling (serif font, good spacing, single-column layout) to optimize the reading experience.

### 2.4. Navigation
The interface provides "Next Page" and "Previous Page" buttons, plus an option to restore the original page view.

## 3. Settings

Users can configure the following items through the extension's options page:

*   **Characters per Page:** A numeric value that guides the smart pagination logic.
*   **AI Character Limit:** Maximum character limit when sending content to Firefox's native AI (default: 10,000). Prevents 400 errors and other limits when summarizing large pages.

Settings are saved locally in the browser using the `browser.storage` API.

## 4. Portability

The code is written using WebExtensions APIs, facilitating future adaptation to other browsers such as Google Chrome and Microsoft Edge with minimal source code changes.

## 5. File Structure and Key Components

The extension consists of the following main files:

*   **`manifest.json`**: The extension manifest file, defining metadata, permissions (including `storage` for settings and `tabs` for page URL access), and content script injection (`Readability.js`, `text_limiter.js`, and `content_script.js`) and styles (`reader.css`).
*   **`Readability.js`**: External library used for main page content extraction, replicating Firefox's "Reader Mode" functionality.
*   **`text_limiter.js`**: Utility for intelligently truncating text, limiting content size sent to Firefox's native AI. Keeps complete paragraphs when possible.
*   **`content_script.js`**: The main script injected into web pages. It coordinates content extraction via Readability, pagination, UI injection, and navigation logic.
*   **`options.html`**: The UI for extension settings, allowing users to define characters per page and AI limit.
*   **`options.js`**: Script managing options page logic, saving and loading user preferences via `browser.storage`.
*   **`options.css`**: Basic styles for the options page.
*   **`reader.css`**: Stylesheet dedicated to formatting extracted content in reading mode, ensuring a clean and focused visual experience.

## 6. Local Testing

### 6.1. Load the Extension in Firefox

1. **Open Firefox**
2. **Type in the address bar:** `about:debugging#/runtime/this-firefox`
3. **Click "Load Temporary Add-on..."**
4. **Navigate to the folder** containing the extension files
5. **Select the file** `manifest.json`
6. The extension will be temporarily loaded

### 6.2. Configure the Extension

1. On the `about:debugging` page, click **"Inspect"** next to the PageNexus extension
2. Or click the extensions icon in the toolbar and select **"Manage Extension"**
3. Click **"Options"** or **"Preferences"**
4. Configure:
   - **Characters per page:** 2500 (default) or adjust as preferred
   - **AI character limit:** 10000 (default) or adjust as needed

### 6.3. Test Features

#### Test Pagination
1. Open a long article (e.g., Wikipedia article)
2. The extension should automatically extract and paginate the content
3. Use "Next" and "Previous" buttons to navigate
4. Click "Restore Original" to return to the original page

#### Test with Firefox Native AI
1. Ensure Firefox's native AI is enabled
2. Open a long article
3. Activate PageNexus to paginate the content
4. Use Firefox's AI sidebar to summarize the current page
5. Content should be limited to the current page size

### 6.4. Debugging

**View extension logs:**
- Open Browser Console: `Ctrl+Shift+J` (Windows/Linux) or `Cmd+Shift+J` (Mac)
- Filter by `[PageNexus]` to see only extension logs

**Reload after changes:**
1. Go back to `about:debugging#/runtime/this-firefox`
2. Click **"Reload"** next to the extension
3. Or press `Ctrl+R` on the debugging page

### 6.5. Test Different Scenarios

| Scenario | Article Size | Expected Behavior |
|----------|--------------|-------------------|
| Small article | < 2,500 characters | No pagination, simple reading mode |
| Medium article | 2,500 - 10,000 characters | Paginated, AI receives full content |
| Large article | > 10,000 characters | Paginated, AI receives truncated content |
| Very large article | > 50,000 characters | Paginated, AI receives first ~10k characters |

### 6.6. Common Issues

**Extension won't load:**
- Check if `manifest.json` is correct
- Look for errors in the debugging console

**Pagination not working:**
- Check if the page has content extractable by Readability
- Some pages are not compatible (e.g., complex SPAs)

**AI still returns 400 error:**
- Reduce character limit in settings
- Try with a smaller page or navigate to a specific page