const { Router } = require('express');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const transactionRoutes = require('./transactionRoutes');
const authMiddlewares = require('../middlewares/authMiddlewares');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', authMiddlewares, categoryRoutes);
router.use('/transactions', authMiddlewares, transactionRoutes);

module.exports = router;