const { Router } = require('express');
const transactionsController = require('../controllers/transactionsController');

const router = Router();

router.get('/', transactionsController.getAllTransactions);
router.get('/by-date', transactionsController.getTransactionsByDate);
router.get('/:id', transactionsController.getTransactionById);
router.post('/', transactionsController.createTransaction);
router.put('/:id', transactionsController.updateTransaction);
router.delete('/:id', transactionsController.deleteTransaction);

module.exports = router;