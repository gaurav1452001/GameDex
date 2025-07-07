export const getGames = async (req, res) => {
    try {
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": process.env.client_id,
                Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: "fields name,rating,cover.url,summary,screenshots.url,storyline; sort rating desc;limit 50;"
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


