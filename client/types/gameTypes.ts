export interface GamePageDataType {
    id: number;
    cover: {
        id: number;
        url: string;
    };
    name: string;
    keywords: Array<{
        id: number;
        name: string;
    }>;
    game_modes: Array<{
        id: number;
        name: string;
    }>;
    player_perspectives:Array<{
        id: number;
        name: string;
    }>;
    genres: Array<{
        id: number;
        name: string;
    }>;
    themes: Array<{
        id: number;
        name: string;
    }>;
    rating: number;
    rating_count: number;
    aggregated_rating: number;
    aggregated_rating_count: number;
    screenshots: Array<{
        id: number;
        url: string;
    }>;
    involved_companies: Array<{
        id: number;
        company: {
            id: number;
            name: string;
        };
        developer: boolean;
        porting: boolean;
        publisher: boolean;
        supporting: boolean;
    }>;
    first_release_date: number;
    release_dates: Array<{
        id: number;
        platform: {
            id: number;
            name: string;
            platform_logo: {
                id: number;
                url: string;
            };
        };
        date: number;
    }>;
    summary: string;
    similar_games: Array<{
        id: number;
        cover: {
            id: number;
            url: string;
        };
    }>;
    videos: Array<{
        id: number;
        video_id: string;
    }>;
}

export interface PlaytimeType {
    completely: number;
    game_id: number;
    hastily: number;
    normally: number;
    count: number;
}

export interface KeywordGameType {
    id: number;
    cover: {
        id: number;
        url: string;
    };
    involved_companies: Array<{
        id: number;
        company: {
            id: number;
            name: string;
        };
    }>;
    first_release_date: number;
    name: string;
    rating: number;
    summary: string;
}

export interface HomePageGameType {
    id: number;
    cover: {
        id: number;
        url: string;
    };
    rating: number;
    first_release_date: number;
}

export interface SearchGameType {
    id: number;
    cover: {
        id: number;
        url: string;
    };
    name: string;
    rating: number;
    involved_companies: Array<{
        id: number;
        company: {
            id: number;
            name: string;
        };
    }>;
    first_release_date: number;
}