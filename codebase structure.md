e codebase structure (@explore subagent)
25,172

Explore the PageNexus codebase thoroughly. I need to understand:

1. The overall project structure - what framework is used, how the app is organized
2. How language/preferences are currently handled - find all files related to language selection, i18n, locale, preferences, settings
3. How text copying to clipboard works - find all files related to copying text, clipboard functionality, extracted text display
4. Find where the title/first line of extracted text is displayed vs where copy happens

Return:
- Project type and framework
- Full file paths and relevant line numbers for language/preference/i18n code
- Full file paths and relevant line numbers for clipboard/copy functionality
- Any relevant state management (stores, contexts) for these features
- The exact code snippets for the current language detection and text copy logic
Now let me also check the remaining files for completeness:

Here is the complete analysis of the PageNexus codebase:

1. Project Type and Framework
Type: Firefox WebExtension (Manifest V2)
Framework: Vanilla JavaScript (no framework) — uses WebExtensions APIs (`browser.*`)
Build: Shell script (build.sh) producing a ZIP for Mozilla Add-ons (AMO)
Key Libraries: Mozilla's Readability.js (bundled, for article extraction)

Architecture:

[background.js](background.js) — Background script, handles browser action click and initial setup
[content_script.js](content_script.js) — Main content script injected into all pages; orchestrates extraction, pagination, display, and clipboard copy
[i18n.js](i18n.js) — Custom i18n helper module
[text_limiter.js](text_limiter.js) — Utility for truncating text for AI limits
[options.html](options.html) / [options.js](options.js) / [options.css](options.css) — Extension settings page
[reader.css](reader.css) — Styling for the reader mode overlay
[_locales/en/messages.json](_locales/en/messages.json) & [_locales/pt_BR/messages.json](_locales/pt_BR/messages.json) — Chrome-style i18n message catalogs
[manifest.json](manifest.json) — Extension manifest (Manifest V2, permissions: storage, tabs, clipboardWrite)
State Management: No framework-based store/context. Uses `browser.storage.local` directly for all persistent state. In-memory state lives in closure variables within [content_script.js](content_script.js) (e.g., `articleTitle`, `articleByline`, `pages`, `currentPage`).

2. Language / Preferences / i18n — All Files and Line Numbers
/[i18n.js](i18n.js) — Custom i18n helper
Line 1-3: `I18n` object with `_locale` and `_messages` state
Lines 5-9: `init()` — Language detection logic:
```js
async init() {
  const result = await browser.storage.local.get('language');
  this._locale = result.language || browser.i18n.getUILanguage().replace('-', '_') || 'en';
  this._messages = {};
}
```
This reads language from storage, falls back to `browser.i18n.getUILanguage()`, then to `'en'`.
Lines 11-13: `getLocale()` — Returns current locale
Lines 15-34: `getMessage(key, substitutions)` — Tries custom `_messages` first, falls back to `browser.i18n.getMessage()`, then to raw key
Lines 36-39: `setLocale(locale)` — Saves to `browser.storage.local` under key `language`
Lines 41-46: `getSupportedLocales()` — Returns `['en', 'pt_BR']` list
/[_locales/en/messages.json](_locales/en/messages.json) — English translations
Full file (71 lines): All English message strings including `extensionName`, `extensionDescription`, `browserActionTitle`, `btnPrevious`, `btnNext`, `btnRestore`, `pageIndicator`, `copyFeedback`, `extractionError`, `truncatedContent`, `titleLabel`, `authorLabel`, `optionsActiveAI`, `optionsSelectAI`, `optionsAutoCopy`, `optionsAutoCopyHint`, `optionsCharLimits`, `optionsCharLimitsHint`, `optionsCharacters`, `optionsCustom`, `optionsSaved`, `optionsLanguage`, `optionsLanguageHint`
/[_locales/pt_BR/messages.json](_locales/pt_BR/messages.json) — Portuguese (Brasil) translations
Full file (71 lines): Same keys as English, with Portuguese translations
/[options.html](options.html) — Language selector UI
Lines 12-18: Language dropdown:
```html
<label for="language" data-i18n="optionsLanguage">Language:</label>
<select id="language" name="language">
  <option value="en">English</option>
  <option value="pt_BR">Português (Brasil)</option>
</select>
<small data-i18n="optionsLanguageHint">Choose the extension display language</small>
```
Lines 20-30: `data-i18n` attributes on elements for translation
Lines 37-43: Auto-copy checkbox with `data-i18n` labels
Line 88: Loads [i18n.js](i18n.js) before [options.js](options.js)
/[options.js](options.js) — Preference save/restore logic
Lines 19-44: `applyTranslations()` — Iterates `[data-i18n]` and `[data-i18n-option]` attributes, applies `I18n.getMessage()`
Lines 55-78: `saveSettings()` — Saves `language`, `autoCopyToClipboard`, `selectedLLM`, `llmLimits`, `maxCharsForAI` to `browser.storage.local`
Lines 80-102: `restoreOptions()` — Reads all settings from storage, sets `#language` select value, calls `I18n.setLocale()`, then `applyTranslations()`
Lines 106-111: Language change listener:
```js
document.getElementById('language').addEventListener('change', async () => {
  const newLang = document.getElementById('language').value;
  await I18n.setLocale(newLang);
  applyTranslations();
  saveSettings();
});
```
/[background.js](background.js) — Default language on install
Lines 16-36: onInstalled listener — Sets language: 'en' as default on first install:
```js
browser.storage.local.set({
  selectedLLM,
  llmLimits: DEFAULT_LIMITS,
  maxCharsForAI,
  language: 'en'
});
```
/[manifest.json](manifest.json) — i18n metadata
Line 3: `__MSG_extensionName__` — Uses Chrome i18n placeholder
Line 5: `__MSG_extensionDescription__` — Uses Chrome i18n placeholder
Line 6: `default_locale: 'en'` — Declares default locale
Line 26: `__MSG_browserActionTitle__` — Uses Chrome i18n placeholder
/[content_script.js](content_script.js) — i18n usage in content script
Line 6: `await I18n.init()` — Initializes i18n on script load
Line 135: `prevBtn.textContent = I18n.getMessage('btnPrevious')`;
Line 140: `pageSpan.textContent = I18n.getMessage('pageIndicator', [currentPage + 1, pages.length])`;
Line 144: `nextBtn.textContent = I18n.getMessage('btnNext')`;
Line 150: `restoreBtn.textContent = I18n.getMessage('btnRestore')`;
Line 255: `feedback.textContent = I18n.getMessage('copyFeedback', currentPage + 1)`;
Line 322: `alert(I18n.getMessage('extractionError'))`;
/[text_limiter.js](text_limiter.js) — i18n usage
Line 29: `I18n.getMessage('truncatedContent')` — Fallback for truncated content label
Line 33: `I18n.getMessage('truncatedContent')` — Same
Line 93: `I18n.getMessage('titleLabel')` — Label for title prefix
Line 97: `I18n.getMessage('authorLabel')` — Label for author prefix
3. Clipboard / Copy Functionality — All Files and Line Numbers
/[manifest.json](manifest.json) — Clipboard permission
Line 10: "clipboardWrite" — Declares clipboard permission
/[content_script.js](content_script.js) — Main clipboard logic
Line 171: `copyPageToClipboard()` — Called automatically at the end of `displayPage()`
Lines 177-213: `copyPageToClipboard()` — Full copy logic:
```js
async function copyPageToClipboard() {
  // Line 179: Checks auto-copy setting
  const settings = await browser.storage.local.get('autoCopyToClipboard');
  const autoCopyEnabled = settings.autoCopyToClipboard === true; // Default: disabled

  if (!autoCopyEnabled) { return; }

  // Line 187: Gets the content div
  const contentDiv = document.getElementById('pagenexus-content');
  
  // Line 195: Extracts text from content div ONLY (no title/byline)
  const text = contentDiv.textContent.trim();

  // Lines 199-212: Copy via Clipboard API with execCommand fallback
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showCopyFeedback();
    } else {
      copyUsingExecCommand(text);
    }
  } catch (error) {
    copyUsingExecCommand(text);
  }
}
```
Lines 218-241: `copyUsingExecCommand(text)` — Fallback using `document.execCommand('copy')` with a hidden textarea
Lines 246-278: `showCopyFeedback()` — Shows a green toast notification "Page X copied!" for 2 seconds
/[options.html](options.html) — Auto-copy toggle UI
Lines 37-43: Checkbox for auto-copy:
```html
<div class="form-group checkbox-group">
  <label>
    <input type="checkbox" id="autoCopyToClipboard" name="autoCopyToClipboard">
    <span data-i18n="optionsAutoCopy">Automatically copy to clipboard</span>
  </label>
  <small data-i18n="optionsAutoCopyHint">Copies the current page content when navigating between pages</small>
</div>
```
/[options.js](options.js) — Auto-copy setting persistence
Line 57: `const autoCopyToClipboard = document.getElementById('autoCopyToClipboard').checked;`
Line 72: Saved to storage: `autoCopyToClipboard`
Line 91: Restored from storage: `result.autoCopyToClipboard === true`
Line 92: `document.getElementById('autoCopyToClipboard').checked = autoCopyToClipboard;`
Line 105: Change listener: `document.getElementById('autoCopyToClipboard').addEventListener('change', saveSettings);`
4. Title/First Line Display vs. Copy — The Critical Gap
Where the title is DISPLAYED (but NOT copied):
[content_script.js](content_script.js), lines 105-112:

```js
const header = document.createElement('header');
header.id = 'pagenexus-header';
const h1 = document.createElement('h1');
h1.textContent = articleTitle;
const bylineP = document.createElement('p');
bylineP.textContent = articleByline || '';
header.appendChild(h1);
header.appendChild(bylineP);
```
The title (`articleTitle`) and byline (`articleByline`) are placed inside `#pagenexus-header`, which is a sibling of `#pagenexus-content`. The container structure is:

`#pagenexus-container`
  ├── `#pagenexus-header`     ← title & byline (NOT copied)
  ├── `#pagenexus-nav-top`    ← navigation buttons
  ├── `#pagenexus-content`    ← page content (COPIED)
  └── `#pagenexus-nav-bottom` ← navigation buttons
