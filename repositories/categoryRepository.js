const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoryRepository {
  async findAllByUser(userId) {
    return prisma.category.findMany({
      where: { userId: parseInt(userId) }
    });
  }

  async findById(id) {
    return prisma.category.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async create(categoryData) {
    return prisma.category.create({
      data: categoryData
    });
  }

  async update(id, categoryData) {
    return prisma.category.update({
      where: { id: parseInt(id) },
      data: categoryData
    });
  }

  async delete(id) {
    return prisma.category.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new CategoryRepository();