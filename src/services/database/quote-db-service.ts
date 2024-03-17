import { AppDataSource } from "../../utils/data-source";

import { QuoteCreate } from "../../types/quote";
import { Quote } from "../../entity";

const entityManager = AppDataSource.manager;

const getQuoteByUuid = async (quoteUuid: string): Promise<Quote | null> => {
    const quote = await entityManager.findOneBy(Quote, {
        uuid: quoteUuid,
    });

    return quote;
};

const createQuote = async (newQuote: QuoteCreate) => {
    const quote = entityManager.create(
        Quote, { ...newQuote }
    );

    await entityManager.save(Quote, quote);
    return quote;
};

const updateQuote = async (quote: Quote) => {
    await entityManager.save(Quote, quote);
};

export default {
    getQuoteByUuid,
    createQuote,
    updateQuote
};
