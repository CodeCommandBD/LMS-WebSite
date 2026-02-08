import express from 'express';

import { registerUser } from '../Controller/user.contollers.js';

const router = express.Router();

router.post('/register', registerUser);


export default router;
