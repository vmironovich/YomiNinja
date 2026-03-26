import { net } from 'electron';

export async function translateTextLinesKoboldCpp( input: {
    textLines: string[];
    targetLanguage: string;
    host: string;
}): Promise<string[]> {

    const { textLines, targetLanguage, host } = input;

    if ( !textLines.length ) return [];

    try {
        const numberedLines = textLines
            .map( ( line, i ) => `[${i + 1}] ${line}` )
            .join('\n');

        const prompt = `Translate each numbered line from Japanese to ${targetLanguage}. Return ONLY the translations with the same numbering format. No explanations.\n\n${numberedLines}`;

        const url = `${host.replace( /\/+$/, '' )}/api/v1/generate`;

        const body = JSON.stringify({
            prompt,
            max_length: 500,
            temperature: 0.3,
        });

        const response = await net.fetch( url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        if ( !response.ok ) {
            const errorBody = await response.text();
            throw new Error( `KoboldCpp API error ${response.status}: ${errorBody}` );
        }

        const json = await response.json() as KoboldCppResponse;
        const responseText = json?.results?.[0]?.text;

        if ( !responseText ) {
            throw new Error( 'No text in KoboldCpp response' );
        }

        const translatedLines = parseNumberedResponse( responseText, textLines.length );

        if ( translatedLines.length !== textLines.length ) {
            console.error('Translation line count mismatch, falling back to original text');
            return textLines;
        }

        return translatedLines;

    } catch ( error ) {
        console.error( 'KoboldCpp translation error:', error );
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

type KoboldCppResponse = {
    results?: { text?: string }[];
};
