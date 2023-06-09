const mongoose = require("mongoose");
const config = require("../config/config");
class Database {
  url = config.mongodb.url;
  port = config.mongodb.port;
  database = config.mongodb.database;

  get fullUrl() {
    if (this.url.includes("+srv")) {
      return `${this.url}/${this.database}`;
    }
    return `${this.url}:${this.port}/${this.database}`;
  }
  _connect() {
    return mongoose.connect(this.fullUrl);
  }
}

module.exports = new Database();
