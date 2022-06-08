const { User, Message } = require("../database");

class MessageService {
  async create(body) {
    return await Message.create({ ...body });
  }

  async getSentMessages(sender) {
    return await Message.findAll({ where: { sender } });
  }

  async getReceivedMessages(recipient) {
    return await Message.findAll({ where: { recipient } });
  }
}

module.exports = new MessageService();
