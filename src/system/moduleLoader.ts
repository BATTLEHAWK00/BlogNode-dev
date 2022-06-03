import { sleep } from "../util/utils";
import fs from "fs";
import path from "path";
import logging from "./logging";

const logger = logging.getLogger("ModuleLoader");

function scanDir(dirname: string, regex: RegExp) {
  return fs.readdirSync(dirname).filter((filename) => regex.test(filename));
}

function loadModule(dirname: string, filename: string) {
  logger.debug(`loading module: ${filename}`);
  return import(path.resolve(dirname, filename));
}

async function loadFiles(
  dirname: string,
  filenames: string[],
  concurrent: boolean = false
) {
  if (concurrent) {
    await Promise.all(filenames.map((file) => loadModule(dirname, file)));
    return;
  }
  let file: string | undefined = filenames.pop();
  while (file) {
    await loadModule(dirname, file);
    file = filenames.pop();
  }
}

async function loadDir(dirname: string, concurrent: boolean = false) {
  const files = scanDir(dirname, /\.js$/);
  await loadFiles(dirname, files, concurrent);
}

export default {
  loadFiles,
  scanDir,
  loadModule,
  loadDir,
};
