import express from 'express'
import { getGames, getScreenshots, getPlaytime, getPopularGames } from '../controllers/post.controller.js'

const router = express.Router()

router.get('/', getGames);
router.get('/screenshot', getScreenshots);
router.get('/playtime', getPlaytime);
router.get('/popular', getPopularGames);

// router.get('/:slug',getPost);

export default router