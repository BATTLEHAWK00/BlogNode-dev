const isDev = process.env.NODE_ENV === "development";

require("../src/entry");
// if (isDev) require("../src/entry");
// else require("../dist/entry");

exports = {};
