export interface eventScreenType {
        id: number;
        name: string;
        description: string;
        event_logo: {
            image_id: string;
        };
        start_time: number;
}
export interface eventPageDataType {
        id: number;
        name: string;
        description: string;
        slug: string;
        event_logo: {
            image_id: string;
        };
        start_time: number;
        end_time: number;
        time_zone: string;
        live_stream_url: string;
        games: Array<{
            id: number;
            cover: {
                id: number;
                image_id: string;
            };
        }>;
        videos: Array<{
            id: number;
            checksum: string;
            video_id: string;
            game: {
                id: number;
                name: string;
            };
            name: string;
        }>;
        event_networks: Array<{
            id: number;
            url: string;
        }>;
}