export async function translateTextLines( input: {
    textLines: string[];
    targetLanguage: string;
    apiKey: string;
    model: string;
}): Promise<string[]> {

    const { textLines, targetLanguage, apiKey, model } = input;

    if ( !textLines.length ) return [];

    try {
        const { GoogleGenAI, Type } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });

        const numberedLines = textLines
            .map( ( line, i ) => `${i + 1}. ${line}` )
            .join('\n');

        const prompt = [
            `You are translating OCR-captured text from a Japanese game screen.`,
            `The text includes dialogue, UI labels, character names, buttons, and other on-screen elements.`,
            `Each numbered line is a separate OCR region — consider them in context for accurate translation.`,
            `Translate each line from Japanese to ${targetLanguage}.`,
            `If a line is already in ${targetLanguage} or is not Japanese, return it unchanged.`,
            `Return exactly ${textLines.length} translations in the same order.\n`,
            numberedLines
        ].join('\n');

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });

        const responseText = response.text;

        if ( !responseText ) {
            throw new Error( 'No text in Gemini response' );
        }

        const translations: string[] = JSON.parse( responseText );

        if ( translations.length !== textLines.length ) {
            console.error(`[Translation] Line count mismatch: got ${translations.length}, expected ${textLines.length}. Falling back to original.`);
            return textLines;
        }

        return translations;

    } catch ( error ) {
        console.error( '[Translation] Gemini error:', error );
        return textLines;
    }
}
