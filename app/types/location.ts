export interface LocationFeature {
    geometry: {
        coordinates: [number, number];
        type: string;
    };
    type: string;
    properties: {
        osm_id?: string;
        name: string;
        city?: string;
        state?: string;
        country?: string;
        street?: string;
        postcode?: string;
    };
}

export interface LocationResponse {
    features: LocationFeature[];
    type: string;
} 