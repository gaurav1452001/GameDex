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
    }>;
    first_release_date: number;
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