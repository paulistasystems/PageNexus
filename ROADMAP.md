# PageNexus Roadmap

## ✅ Recently Completed

### v0.5.3 - Open Preferences on Install
- [x] **Open preferences page on first install** - Added `options_ui` manifest field so `browser.runtime.openOptionsPage()` works correctly, ensuring the preferences tab opens when the extension is first installed

### v0.5.2 - Optional Context Menu Actions
- [x] **Make context menu actions optional** - Tab context menu actions are now hidden by default and can be enabled via the preferences page (showContextMenus setting)

### v0.5.1 - Bulk Tab Context Menu Actions
- [x] **Bulk tab context menu actions** - Added tab context menu items: Run on all tabs & close, Run on tabs to the right & close, Run on tabs to the left & close, Run on other tabs & close

### v0.5.0 - Close Tab After Copy, Context Menu Actions & Keyboard Shortcut
- [x] **Close tab after copy** - New option that closes the current tab after content is copied to the clipboard
- [x] **Remove Preferences from context menu** - Removed the Preferences tab from the extension's browser context menu (options now accessible via preferences page on install or from Add-ons manager)
- [x] **Toolbar shortcut** - Added `Ctrl+E` keyboard shortcut to toggle reader mode, firing the same action as the toolbar button (via the WebExtensions `_execute_browser_action` command)

### v0.4.2 - Bug Fixes
- [x] **Auto-copy not working on activation** - Fixed clipboard copy failing silently when reader mode is activated from the toolbar button (document not focused). Copy now refocuses the page and, as a last resort, copies on the user's first interaction with the page.

### v0.4.1 - Bug Fixes
- [x] **Browser language detection** - Automatically detect and use browser language on first install (Portuguese for pt-BR browsers, English fallback)
- [x] **Incomplete text copy** - Include article title and byline in clipboard text when auto-copying

### v0.4.0 - Internationalization (i18n)
- [x] Implement multi-language support with English as the default fallback language
- [x] Add Portuguese (Brasil) language support
- [x] Create language configuration system using WebExtensions i18n API + custom I18n helper
- [x] Allow users to switch between English and Portuguese in the extension options
- [x] Ensure all UI elements, messages, and notifications are properly translated
- [x] Add `_locales/en/` and `_locales/pt_BR/` message catalogs
- [x] Create `i18n.js` helper module for content script and options page translations
- [x] Add language selector to options page

### v0.3.1 - Clipboard Functionality
- [x] Copy extracted text content to clipboard automatically after each text extraction action
- [x] Support clipboard operations via Clipboard API (cross-platform) with execCommand fallback
- [x] Provide user feedback (toast notification) confirming successful clipboard copy
- [x] Handle edge cases and clipboard permission restrictions per platform
- [x] Add auto-copy toggle in extension options

## 🛠️ Next Steps
- Cross-platform native clipboard handling improvements (Linux XClip, macOS/Windows native APIs)
- Close tab after copy should only close on the last page (optional behavior)

## 🚀 Planned
- Additional language support beyond English and Portuguese
- Reader mode customization (font size, theme)
