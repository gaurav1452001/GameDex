import express from 'express';
import postRouter from './routes/post.route.js';
import 'dotenv/config';

const app = express()

app.use(express.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/posts", postRouter);

const PORT = process.env.PORT || 8000


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})