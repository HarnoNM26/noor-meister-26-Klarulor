export interface EnergyReading {
    id: number;
    timestamp: string;
    location: string;
    price_eur_mwh?: number | undefined;
    source: "UPLOAD" | "API";
    created_at: Date;
}