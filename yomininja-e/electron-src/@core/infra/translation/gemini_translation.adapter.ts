import { net } from 'electron';

export async function translateTextLines( input: {
    textLines: string[];
    targetLanguage: string;
    apiKey: string;
    model: string;
}): Promise<string[]> {

    const { textLines, targetLanguage, apiKey, model } = input;

    if ( !textLines.length ) return [];

    try {
        const numberedLines = textLines
            .map( ( line, i ) => `[${i + 1}] ${line}` )
            .join('\n');

        const prompt = `Translate each numbered line from Japanese to ${targetLanguage}. Return ONLY the translations with the same numbering format. No explanations.\n\n${numberedLines}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const body = JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        });

        const responseText = await geminiRequest( url, body );

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

async function geminiRequest( url: string, body: string ): Promise<string> {

    const response = await net.fetch( url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    });

    if ( !response.ok ) {
        const errorBody = await response.text();
        throw new Error( `Gemini API error ${response.status}: ${errorBody}` );
    }

    const json = await response.json() as GeminiResponse;

    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

    if ( !text ) {
        throw new Error( 'No text in Gemini response' );
    }

    return text;
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

type GeminiResponse = {
    candidates?: {
        content?: {
            parts?: { text?: string }[];
        };
    }[];
};
