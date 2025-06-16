const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const { uploadFile } = require('../utils/fileUpload');

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await userRepository.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userRepository.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createUser(req, res) {
    try {
      const { name, email, password, phone } = req.body;
      
      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await userRepository.create({
        name,
        email,
        password: hashedPassword,
        phone
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { name, phone } = req.body;
      const userId = req.params.id;

      const user = await userRepository.update(userId, {
        name,
        phone
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      await userRepository.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const userId = req.user.id;
      const avatarPath = `/uploads/${req.file.filename}`;

      const user = await userRepository.update(userId, {
        avatar: avatarPath
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();