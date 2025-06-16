const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TransactionRepository {
  async findAllByUser(userId) {
    return prisma.transaction.findMany({
      where: { userId: parseInt(userId) },
      include: {
        category: true
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  async findByDateRange(userId, startDate, endDate) {
    return prisma.transaction.findMany({
      where: {
        userId: parseInt(userId),
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: true
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  async findById(id) {
    return prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true
      }
    });
  }

  async create(transactionData) {
    return prisma.transaction.create({
      data: transactionData,
      include: {
        category: true
      }
    });
  }

  async update(id, transactionData) {
    return prisma.transaction.update({
      where: { id: parseInt(id) },
      data: transactionData,
      include: {
        category: true
      }
    });
  }

  async delete(id) {
    return prisma.transaction.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new TransactionRepository();