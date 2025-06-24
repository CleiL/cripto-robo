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
}