import { Quote } from "./quote";

export class SwapRequest {
    quote_uuid: string;
}

export interface Swap extends Quote {
    finalPrice: number;
    fee: number;
    spread: number;
    fulfilled: boolean;
}

export interface SwapResponse {
    swapUuid: string;
    status: boolean;
    message?: string;
}
