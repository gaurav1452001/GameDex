import express from 'express'
import { getGames, getScreenshots, getPlaytime, getPopularGames, searchGames,getGameInfo,getGamingEvents,getEventInfo,getKeywordGames } from '../controllers/post.controller.js'

const router = express.Router()

router.get('/', getGames);
router.get('/screenshot', getScreenshots);
router.get('/playtime', getPlaytime);
router.get('/popular', getPopularGames);
router.get('/search', searchGames);
router.get('/search/:id', getGameInfo);
router.get('/searchEvent/:id', getEventInfo);
router.get('/events',getGamingEvents);
router.get('/keywords/:id', getKeywordGames);

export default router