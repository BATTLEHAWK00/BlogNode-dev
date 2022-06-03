import path from "path";
import bus from "./system/bus";
import { EventType } from "./system/events";
import logging from "./system/logging";
import moduleLoader from "./system/moduleLoader";
import { Timer } from "./util/utils";

const logger = logging.getLogger("main");

const modelDir = path.resolve(__dirname, "orm/model");
const systemDir = path.resolve(__dirname, "system");
const serviceDir = path.resolve(__dirname, "orm/service");

function bindTimer() {
  const severStartTimer: Timer = new Timer();
  bus.once(EventType.BeforeSystemStart, () => severStartTimer.start());
  bus.once(EventType.SystemStarted, () => {
    severStartTimer.end();
    logger.info(`BlogNode started in ${severStartTimer.result()}ms`);
  });
}

async function loadConfig() {
  moduleLoader.loadModule(__dirname, "config.js");
}

async function loadSystem() {
  const files = moduleLoader
    .scanDir(systemDir, /\.js$/)
    .filter((file) => !["server.js"].includes(file));
  moduleLoader.loadFiles(systemDir, files, true);
}

async function loadModel() {
  moduleLoader.loadDir(modelDir, true);
}

async function loadService() {
  moduleLoader.loadDir(serviceDir, true);
}

(async () => {
  bindTimer();
  bus.broadcast(EventType.BeforeSystemStart);
  await loadConfig();
  await loadSystem();
  await loadModel();
  await loadService();
  moduleLoader.loadModule(systemDir, "server.js");
})();
