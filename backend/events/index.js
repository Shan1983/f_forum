const events = require("events").EventEmitter;
const emitter = new events.EventEmitter();

// test
emitter.on("newCategory", () => {
  console.log("EMITTER: you added a new category");
});

module.exports = emitter;
