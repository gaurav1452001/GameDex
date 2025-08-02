export const getGames = async (req, res) => {
    try {
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": process.env.client_id,
                Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: "fields name,rating,cover.url,summary,screenshots.url,category,platforms,first_release_date,involved_companies.company.name; sort rating desc;limit 50;where category = 0 & platforms = 48;"
        });
        const data = await response.json();
        console.log(data);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Failed to fetch artworks", error: err.message });
    }
};


export const getKeywordGames = async (req, res) => {
    try {
        const { id } = req.params;
        // First fetch the keyword name
        const keywordResponse = await fetch("https://api.igdb.com/v4/keywords", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": process.env.client_id,
                Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: `fields name; where id = ${id};`
        });
        const keywordData = await keywordResponse.json();
        const keywordName = keywordData[0]?.name;

        // Then fetch games with that keyword
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": process.env.client_id,
                Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: `fields name,rating,cover.url,summary,first_release_date,involved_companies.company.name;sort rating desc; where keywords = ${id};`
        });
        const data = await response.json();
        console.log(data);
        res.status(200).json({
            keywordName: keywordName,
            games: data
        });
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Failed to fetch artworks", error: err.message });
    }
};

export const getScreenshots = async (req, res) => {
    try {
        // You need to get the game id from req.query or req.params
        const { id } = req.query; // or req.params if using route params
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": process.env.client_id,
                Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: `fields screenshots.*; where id = ${id};`
        });
        const data = await response.json();
        // data is an array, get the first screenshot url if exists
        const firstScreenshotUrl = data[0]?.screenshots?.[0]?.url
            ? 'https:' + data[0].screenshots[0].url
            : null;
        res.status(200).json({ screenshotUrl: firstScreenshotUrl });
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Failed to fetch screenshots", error: err.message });
    }
};

export const getPlaytime = async (req, res) => {
    try {
        // You need to get the game id from req.query or req.params
        const { id } = req.params; 
        const response = await fetch("https://api.igdb.com/v4/game_time_to_beats", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": process.env.client_id,
                Authorization: `Bearer ${process.env.bearer_token}`,
            },
        body: `fields completely,game_id,hastily,normally,count;where game_id = ${id};`
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        res
            .status(500)
            .json({ message: "Failed to fetch playtime", error: err.message });
    }
};

export const getPopularGames = async (req, res) => {
    try {
        // Fetch popular game IDs first
        const popularityResponse = await fetch("https://api.igdb.com/v4/popularity_primitives", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Client-ID": process.env.client_id,
            Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: "fields game_id,value,popularity_type; sort value desc; limit 50; where popularity_type = 3;"
        });
        const popularityData = await popularityResponse.json();
        const gameIds = popularityData.map(item => item.game_id).filter(Boolean);
        // Fetch game details using the IDs
        const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Client-ID": process.env.client_id,
            Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: `fields rating,cover.url,first_release_date;limit 50;sort rating desc; where id = (${gameIds.join(',')});`
        });
        const data = await gamesResponse.json();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Failed to fetch popular games", error: err.message });
    }
}

//search
export const searchGames = async (req, res) => {
    try {
        // Fetch popular game IDs first
        const { searchText } = req.query;
        const popularityResponse = await fetch("https://api.igdb.com/v4/games/", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Client-ID": process.env.client_id,
            Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: `fields name,rating,cover.url,platforms,first_release_date,involved_companies.company.name;search "${searchText}";limit 50;`
        });
        const data = await popularityResponse.json();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Failed to fetch popular games", error: err.message });
    }
}

//get information about a specific game
export const getGameInfo = async (req, res) => {
    try {
        // Fetch popular game IDs first
        const { id } = req.params;
        const gameInfo = await fetch("https://api.igdb.com/v4/games/", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Client-ID": process.env.client_id,
            Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: `fields name,rating,keywords.name,rating_count,genres.name,themes.name,game_modes.name,player_perspectives.name,cover.url,summary,screenshots.url,category,platforms,first_release_date,involved_companies.company.name,similar_games.cover.url,videos.video_id,aggregated_rating,aggregated_rating_count,involved_companies.*,release_dates.date,release_dates.platform.name,release_dates.platform.platform_logo.url,ports.cover.url,bundles.cover.url,dlcs.cover.url,expansions.cover.url,remakes.cover.url,remasters.cover.url,parent_game.cover.url,standalone_expansions.cover.url,expanded_games.cover.url,forks.cover.url,collections.name,collections.games.cover.url,franchise.name,franchise.games.cover.url;exclude involved_companies.created_at,involved_companies.updated_at,involved_companies.game,involved_companies.checksum; where id = ${id};"`
        });

        const data = await gameInfo.json();
        res.status(200).json(data[0]);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Failed to fetch popular games", error: err.message });
    }
}
//get the information about gaming events
export const getGamingEvents = async (req, res) => {
    try {
        // Fetch popular game IDs first
        const eventInfo = await fetch("https://api.igdb.com/v4/events", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Client-ID": process.env.client_id,
            Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: "fields start_time, description, name, event_logo.image_id; sort start_time desc; limit 50;"
        });
        const data = await eventInfo.json();
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Failed to fetch popular games", error: err.message });
    }
}
export const getEventInfo = async (req, res) => {
    try {
        // Fetch popular game IDs first
        const { id } = req.params;
        const eventInfo = await fetch("https://api.igdb.com/v4/events", {
            method: "POST",
            headers: {
            Accept: "application/json",
            "Client-ID": process.env.client_id,
            Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: `fields checksum, description,event_networks.url,end_time,event_networks,games.cover.image_id,live_stream_url,name,slug,start_time,time_zone,event_logo.image_id; where id = ${id};`    
        });
        const data = await eventInfo.json();
        res.status(200).json(data[0]);
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Failed to fetch popular games", error: err.message });
    }
}






