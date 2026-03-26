export type TranslationSettings = {
    enabled: boolean;
    target_language: string;  // e.g. 'en', 'pt', 'es'
    api_key: string;
    model: string;            // e.g. 'gemini-3.1-flash-lite'
};
