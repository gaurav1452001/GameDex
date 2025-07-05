export const getGames = async (req, res) => {
    try {
        const response = await fetch("https://api.igdb.com/v4/artworks", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": "gi1h9oqry4ps3lr4w2btdqye2cbrmt",
                Authorization: "Bearer 5qd4apirr7ikfb3nsm4qbs849b7y2q",
            },
        body: "fields alpha_channel,animated,artwork_type,checksum,game,height,image_id,url,width;limit 33;"
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

export const getScreenshots = async (req, res) => {
    try {
        const response = await fetch("https://api.igdb.com/v4/screenshots", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Client-ID": "gi1h9oqry4ps3lr4w2btdqye2cbrmt",
                Authorization: "Bearer 5qd4apirr7ikfb3nsm4qbs849b7y2q",
            },
        body: "fields alpha_channel,animated,checksum,game,height,image_id,url,width;limit 33;"
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


