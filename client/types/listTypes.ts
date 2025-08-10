export interface listType {
    externalId: string;
    name: string;
    userImageUrl?: string;
    listName: string;
    listDesc?: string;
    list_game_ids: Array<{
        game_id: string;
        game_name: string;
        game_cover_url?: string;
    }>;
}

export interface listGames {
        game_id: string;
        game_name: string;
        game_cover_url?: string;
}
