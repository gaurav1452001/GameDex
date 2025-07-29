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

export const getScreenshots = async (req, res) => {
    try {
        // You need to get the game id from req.query or req.params
        const { id } = req.query; // or req.params if using route params
        console.log("Fetching screenshots for game ID:", id);
        console.log("Client ID:", process.env.client_id);
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
        const { game_id } = req.query; 
        console.log("Fetching playtime for game ID:", game_id);
        console.log("Client ID:", process.env.client_id);
        const response = await fetch("https://api.igdb.com/v4/game_time_to_beats", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": process.env.client_id,
                Authorization: `Bearer ${process.env.bearer_token}`,
            },
        body: `fields completely,game_id,hastily,normally;where game_id = ${game_id};`
        });
        const data = await response.json();
        console.log(data);
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
            body: `fields name,rating,cover.url,summary,screenshots.url,category,platforms,first_release_date,involved_companies.company.name;limit 50; where id = (${gameIds.join(',')});`
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
            body: `fields name,rating,cover.url,summary,screenshots.url,category,platforms,first_release_date,involved_companies.company.name;search "${searchText}";limit 50;`
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
            body: `fields name,rating,cover.url,summary,screenshots.url,category,platforms,first_release_date,involved_companies.company.name,similar_games.cover.url; where id = ${id};`
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





