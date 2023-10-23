import express from 'express';
import { bookslot, freesession, login, loginc, pendingsession } from '../controllers/fxn.js';
const router = express.Router();

router.post('/login', login);

router.get('/free-sessions', freesession);

router.post('/book-slot', bookslot);

router.get('/pending-sessions', pendingsession);

router.get('/login-c', loginc);

export default router;