const I18n = {
  _locale: null,
  _messages: {},

  _supportedLocales: ['en', 'pt_BR'],

  _detectBrowserLocale() {
    const uiLang = browser.i18n.getUILanguage().replace('-', '_');
    if (this._supportedLocales.includes(uiLang)) {
      return uiLang;
    }
    const baseLang = uiLang.split('_')[0];
    const match = this._supportedLocales.find(loc => loc.split('_')[0] === baseLang);
    return match || 'en';
  },

  async init() {
    const result = await browser.storage.local.get('language');
    this._locale = result.language || this._detectBrowserLocale();
    this._messages = {};
  },

  getLocale() {
    return this._locale;
  },

  getMessage(key, substitutions) {
    if (this._locale && this._messages[this._locale] && this._messages[this._locale][key]) {
      let msg = this._messages[this._locale][key];
      if (substitutions !== undefined) {
        if (!Array.isArray(substitutions)) {
          substitutions = [substitutions];
        }
        for (let i = 0; i < substitutions.length; i++) {
          msg = msg.replace(new RegExp('\\$' + (i + 1), 'g'), substitutions[i]);
        }
      }
      return msg;
    }

    let msg = browser.i18n.getMessage(key, substitutions);
    if (!msg) {
      msg = key;
    }
    return msg;
  },

  async setLocale(locale) {
    this._locale = locale;
    await browser.storage.local.set({ language: locale });
  },

  getSupportedLocales() {
    return [
      { code: 'en', label: 'English' },
      { code: 'pt_BR', label: 'Português (Brasil)' }
    ];
  }
};

if (typeof window !== 'undefined') {
  window.I18n = I18n;
}
