class WsClients {
  clients = [];

  add(client) {
    this.clients.push(client);
  }

  sendToAll(data) {
    this.clients.forEach((client) => {
      client.ws.send(JSON.stringify(data));
    });
  }

  send(id, data) {
    this.clients.forEach((client) => {
      if (id === client.id) {
        client.ws.send(JSON.stringify(data));
      }
    });
  }

  connect() {}
}

module.exports = new WsClients();
