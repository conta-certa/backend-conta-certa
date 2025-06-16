const categoryRepository = require('../repositories/categoryRepository');

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const categories = await categoryRepository.findAllByUser(req.user.id);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await categoryRepository.findById(req.params.id);
      if (!category || category.userId !== req.user.id) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createCategory(req, res) {
    try {
      const { name } = req.body;
      
      const category = await categoryRepository.create({
        name,
        userId: req.user.id
      });

      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const { name } = req.body;
      const categoryId = req.params.id;

      // Verifica se a categoria pertence ao usuário
      const existingCategory = await categoryRepository.findById(categoryId);
      if (!existingCategory || existingCategory.userId !== req.user.id) {
        return res.status(404).json({ error: 'Category not found' });
      }

      const category = await categoryRepository.update(categoryId, {
        name
      });

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const categoryId = req.params.id;

      // Verifica se a categoria pertence ao usuário
      const existingCategory = await categoryRepository.findById(categoryId);
      if (!existingCategory || existingCategory.userId !== req.user.id) {
        return res.status(404).json({ error: 'Category not found' });
      }

      await categoryRepository.delete(categoryId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CategoryController();