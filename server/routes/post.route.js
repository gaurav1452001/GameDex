import express from 'express'
import { getGames, getPlaytime, getPopularGames, searchGames,getGameInfo,getGamingEvents,getEventInfo,getKeywordGames } from '../controllers/post.controller.js'

const router = express.Router()

router.get('/', getGames);
router.get('/playtime/:id', getPlaytime);
router.get('/popular', getPopularGames);
router.get('/search', searchGames);
router.get('/search/:id', getGameInfo);
router.get('/events',getGamingEvents);
router.get('/searchEvent/:id', getEventInfo);
router.get('/keywords/:id', getKeywordGames);

export default router