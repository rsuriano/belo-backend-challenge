/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// database connector
import { Quote } from "../types/quote";
import { readFile, writeFile } from 'fs/promises';


async function saveQuote(newQuote: Quote): Promise<void> {
    try {
        // Load the existing quotes JSON file
        const data = await readFile('quotes.json', { encoding: 'utf8' });
        const quotes: Record<string, Quote> = JSON.parse(data);

        // Append the new quote
        quotes[newQuote.swapUuid] = newQuote;

        // Save the updated quotes back to the JSON file
        await writeFile('quotes.json', JSON.stringify(quotes, null, 2), { encoding: 'utf8' });
        console.log('Quote saved successfully.');
    } catch (error) {
        console.error('Failed to save the quote:', error);
    }
}

async function getQuote(quoteId: string): Promise<Quote | undefined> {
    try {
        // Load the existing quotes JSON file
        const data = await readFile('quotes.json', { encoding: 'utf8' });
        const quotes: Record<string, Quote> = JSON.parse(data);

        // Retrieve the quote by its UUID
        const quote = quotes[quoteId];

        if (quote) {
            console.log('Quote found:', quote);
            return quote;
        } else {
            console.log('Quote not found.');
            return undefined;
        }
    } catch (error) {
        console.error('Failed to retrieve the quote:', error);
        return undefined;
    }
}


export default {
    saveQuote,
    getQuote
};
