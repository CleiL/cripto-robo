export interface Candle {
    symbol: string;
    timestamp: string;
    data: {
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    };

    mediumFast?: number;
    mediumSlow?: number;
    rsi?: number;
    bbUpper?: number;
    bbLower?: number;
    rsiStatus?: string;
    signal?: 'COMPRA' | 'VENDA' | null;
}