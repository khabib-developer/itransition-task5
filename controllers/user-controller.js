const userService = require("../services/user-service");
const ApiError = require("../exception/api-errors");
const wsClient = require("../services/ws-service");
const messageService = require("../services/message-service");
class UserController {
  async enter(req, res, next) {
    try {
      let user = await userService.getUser(req.body.username);
      if (!user) {
        user = {
          ...(await userService.create(req.body.username)).dataValues,
        };

        wsClient.sendToAll({ type: "newUser", payload: user });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      let user = await userService.getUser(req.body.username);
      if (!user) {
        next(ApiError.BadRequest("user not found"));
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      res.json(await userService.getUsers());
    } catch (error) {
      next(error);
    }
  }

  async getSentMessages(req, res, next) {
    try {
      res.json(await messageService.getSentMessages(req.body.id));
    } catch (error) {
      next(error);
    }
  }

  async getReceivedMessages(req, res, next) {
    try {
      res.json(await messageService.getReceivedMessages(req.body.id));
    } catch (error) {
      next(error);
    }
  }

  async connect(ws, req) {
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data);
        switch (message.type) {
          case "connect":
            wsClient.add({ ws, id: message.payload });
            wsClient.send(message.payload, {
              payload: "connected",
              type: "connect",
            });
            return;
          case "message":
            const sms = await messageService.create(message.payload);
            const payload = {
              id: sms.id,
              ...message.payload,
              createdAt: sms.createdAt,
            };
            wsClient.send(message.payload.sender, {
              payload,
              type: "message",
            });
            wsClient.send(message.payload.recipient, {
              payload,
              type: "message",
            });
            return;
          default:
            return;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
}

module.exports = new UserController();
