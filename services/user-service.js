const { User, Message } = require("../database");

class UserService {
  async create(username) {
    return await User.create({ username });
  }

  async getUser(username) {
    return await User.findOne({ where: { username }, include: [Message] });
  }

  async getUsers() {
    return await User.findAll();
  }
}

module.exports = new UserService();
