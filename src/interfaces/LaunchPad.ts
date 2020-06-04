export interface ILaunchPad {
    id: number;
    status: string;
    location: {
        name: string;
        region: string;
        latitude: number;
        longitude: number;
    }
    vehicles_launched: [
        string
    ],
    attempted_launches: number;
    successful_launches: number;
    wikipedia: string;
    details: string;
    site_id: string;
    site_name_long: string;
}