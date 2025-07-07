export const getGames = async (req, res) => {
    try {
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": process.env.client_id,
                Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: "fields name,rating,cover.url,summary; sort rating desc;limit 50;"
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
        const response = await fetch("https://api.igdb.com/v4/screenshots", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": process.env.client_id,
                Authorization: `Bearer ${process.env.bearer_token}`,
            },
            body: "fields name,rating,cover.url,screenshots,summary; sort rating desc;limit 50;"
        });
        const arts = await response.json();
        console.log(arts);
        res.status(200).json({ arts });
    } catch (err) {
        console.error(err);
        res
            .status(500)
            .json({ message: "Failed to fetch artworks", error: err.message });
    }
};


