import { net } from 'electron';

export async function translateTextLinesKoboldCpp( input: {
    textLines: string[];
    targetLanguage: string;
    host: string;
    extraContext?: string;
}): Promise<string[]> {

    const { textLines, targetLanguage, host, extraContext } = input;

    if ( !textLines.length ) return [];

    try {
        const numberedLines = textLines
            .map( ( line, i ) => `[${i + 1}] ${line}` )
            .join('\n');

        const promptParts = [
            `You are translating OCR-captured text from a Japanese game screen.`,
            `The text includes dialogue, UI labels, character names, buttons, and other on-screen elements.`,
            `Each numbered line is a separate OCR region — consider them in context for accurate translation.`,
            `Translate each line from Japanese to ${targetLanguage}. If a line is already in ${targetLanguage}, return it unchanged.`,
            `Return ONLY the translations with the same [N] numbering format. No explanations.`,
        ];

        if ( extraContext?.trim() ) {
            promptParts.push( `Additional context: ${extraContext.trim()}` );
        }

        promptParts.push( '', numberedLines );
        const prompt = promptParts.join('\n');

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
