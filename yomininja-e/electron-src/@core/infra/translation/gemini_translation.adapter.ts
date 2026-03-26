import { GoogleGenAI } from '@google/genai';

export async function translateTextLines( input: {
    textLines: string[];
    targetLanguage: string;
    apiKey: string;
    model: string;
}): Promise<string[]> {

    const { textLines, targetLanguage, apiKey, model } = input;

    if ( !textLines.length ) return [];

    try {
        const ai = new GoogleGenAI({ apiKey });

        const numberedLines = textLines
            .map( ( line, i ) => `[${i + 1}] ${line}` )
            .join('\n');

        const prompt = `Translate each numbered line from Japanese to ${targetLanguage}. Return ONLY the translations with the same numbering format. No explanations.\n\n${numberedLines}`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        const responseText = response.text;

        if ( !responseText ) {
            throw new Error( 'No text in Gemini response' );
        }

        const translatedLines = parseNumberedResponse( responseText, textLines.length );

        if ( translatedLines.length !== textLines.length ) {
            console.error('Translation line count mismatch, falling back to original text');
            return textLines;
        }

        return translatedLines;

    } catch ( error ) {
        console.error( 'Translation error:', error );
        return textLines;
    }
}

function parseNumberedResponse( responseText: string, expectedCount: number ): string[] {

    const lines = responseText.trim().split('\n').filter( line => line.trim() );
    const result: string[] = [];

    for ( const line of lines ) {
        const match = line.match( /^\[(\d+)\]\s*(.+)$/ );
        if ( match ) {
            result.push( match[2].trim() );
        }
    }

    return result;
}
