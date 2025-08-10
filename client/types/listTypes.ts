export interface listType {
        externalId: string;
        name: string;
        userImageUrl?: string;
        listName: string;
        listDesc?: string;
        list_game_ids: Array<{
            game_id: string;
            game_cover_url?: string; // Optional field for game cover URL
        }>;
}
