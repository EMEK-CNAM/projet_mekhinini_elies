export interface Pollution {
    id?: number | string;
    titre: string;
    lieu: string;
    date_observation: string;
    type_pollution: string;
    description: string;
    latitude: number;
    longitude: number;
    photo_url?: string;
}
