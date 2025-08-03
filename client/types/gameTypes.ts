export interface GamePageDataType {
    id: number;
    cover: {
        id: number;
        url: string;
    };
    language_supports: Array<{
        id: number;
        language: {
            id:number;
            name:string;
        };
    }>;
    game_engines:Array<{
        id: number;
        name: string;
    }>;
    websites:Array<{
        id: number;
        url: string;
        type:{
            id: number;
            type: string;
        }
    }>
    age_ratings: Array<{
        id: number;
        rating_cover_url: string;
    }>;
    ports: Array<{
        id: number;
        cover: {
            id: number;
            url: string;
        };
    }>;
    bundles: Array<{
        id: number;
        cover: {
            id: number;
            url: string;
        };
    }>;
    dlcs: Array<{
        id: number;
        cover: {
            id: number;
            url: string;
        };
    }>;
    expansions: Array<{
        id: number;
        cover: {
            id: number;
            url: string;
        };
    }>;
    remakes: Array<{
        id: number;
        cover: {
            id: number;
            url: string;
        };
    }>;
    standalone_expansions: Array<{
        id: number;
        cover: {
            id: number;
            url: string;
        };
    }>;
    expanded_games: Array<{
        id: number;
        cover: {
            id: number;
            url: string;
        };
    }>;
    forks: Array<{
        id: number;
        cover: {
            id: number;
            url: string;
        };
    }>;
    collections: Array<{
        id: number;
        name: string;
        games: Array<{
            id: number;
            cover: {
                id: number;
                url: string;
            };
        }>;
    }>;
    franchise:{
        id: number;
        name: string;
        games: Array<{
            id: number;
            cover: {
                id: number;
                url: string;
            };
        }>;
    }
    remasters: Array<{
        id: number;
        cover: {
            id: number;
            url: string;
        };
    }>;
    parent_game: {
        id: number;
        cover: {
            id: number;
            url: string;
        };
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
    platforms: Array<{
        id: number;
        name:string;
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