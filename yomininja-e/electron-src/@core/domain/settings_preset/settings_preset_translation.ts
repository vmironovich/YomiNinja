export type TranslationSource = 'gemini' | 'koboldcpp';

export type TranslationSettings = {
    enabled: boolean;
    source: TranslationSource;
    target_language: string;  // e.g. 'en', 'pt', 'es'
    api_key: string;          // Gemini API key
    model: string;            // e.g. 'gemini-3.1-flash-lite-preview'
    koboldcpp_host: string;   // e.g. 'http://localhost:5001'
    hide_non_japanese: boolean;
};
