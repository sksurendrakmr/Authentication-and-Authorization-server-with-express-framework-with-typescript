import {Router} from 'express';
import { getUserDetails, login, registerUser } from '../controllers/User';
import { auth } from '../middleware/auth';

const router:Router = Router();

router.post('/',registerUser);
router.post('/login',login);
router.get('/me',auth,getUserDetails);

export default router;





