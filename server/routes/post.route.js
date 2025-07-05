import express from 'express'
import { getGames, getScreenshots } from '../controllers/post.controller.js'

const router = express.Router()

router.get('/', getGames);
router.get('/screenshot', getScreenshots);
// router.get('/:slug',getPost);

export default router