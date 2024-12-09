import express from 'express';

const router=express.Router();

router.post('/update/:id',updateUser)

export default router;