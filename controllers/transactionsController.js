const transactionRepository = require('../repositories/transactionRepository');
const categoryRepository = require('../repositories/categoryRepository');

class TransactionController {
  async getAllTransactions(req, res) {
    try {
      const transactions = await transactionRepository.findAllByUser(req.user.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTransactionsByDate(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const transactions = await transactionRepository.findByDateRange(
        req.user.id,
        new Date(startDate),
        new Date(endDate)
      );
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTransactionById(req, res) {
    try {
      const transaction = await transactionRepository.findById(req.params.id);
      if (!transaction || transaction.userId !== req.user.id) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createTransaction(req, res) {
    try {
      const { amount, type, description, categoryId, date } = req.body;
      
      // Verifica se a categoria pertence ao usuário
      const category = await categoryRepository.findById(categoryId);
      if (!category || category.userId !== req.user.id) {
        return res.status(400).json({ error: 'Invalid category' });
      }

      const transaction = await transactionRepository.create({
        amount: parseFloat(amount),
        type,
        description,
        categoryId: parseInt(categoryId),
        userId: req.user.id,
        date: date ? new Date(date) : new Date()
      });

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTransaction(req, res) {
    try {
      const { amount, type, description, categoryId, date } = req.body;
      const transactionId = req.params.id;

      // Verifica se a transação pertence ao usuário
      const existingTransaction = await transactionRepository.findById(transactionId);
      if (!existingTransaction || existingTransaction.userId !== req.user.id) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Verifica se a nova categoria pertence ao usuário
      if (categoryId) {
        const category = await categoryRepository.findById(categoryId);
        if (!category || category.userId !== req.user.id) {
          return res.status(400).json({ error: 'Invalid category' });
        }
      }

      const transaction = await transactionRepository.update(transactionId, {
        amount: amount ? parseFloat(amount) : undefined,
        type,
        description,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        date: date ? new Date(date) : undefined
      });

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTransaction(req, res) {
    try {
      const transactionId = req.params.id;

      // Verifica se a transação pertence ao usuário
      const existingTransaction = await transactionRepository.findById(transactionId);
      if (!existingTransaction || existingTransaction.userId !== req.user.id) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      await transactionRepository.delete(transactionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TransactionController();