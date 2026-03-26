export type TranslationSource = 'gemini';

export type TranslationSettings = {
    enabled: boolean;
    source: TranslationSource;
    target_language: string;  // e.g. 'en', 'pt', 'es'
    api_key: string;          // Gemini API key
    model: string;            // e.g. 'gemini-3.1-flash-lite-preview'
    hide_non_japanese: boolean;
    extra_context: string;       // Additional context appended to the translation prompt
};
