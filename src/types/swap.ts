import { Quote } from "./quote";

export interface SwapRequest {
    quote_uuid: string;
}

export interface Swap extends Quote {
    final_price: number;
    fee: number;
    spread: number;
    fulfilled: boolean;
}

export interface SwapResponse {
    swap_uuid: string;
    status: boolean;
    message?: string;
}
