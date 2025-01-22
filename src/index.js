import { setupServer } from "./server.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

import { createDirIfNotExist } from "./utils/createDirIfNotExist.js";

import { TEMPLATES_DIR, UPLOAD_DIR } from "./constants/index.js";

const bootstrap = async () => {
  await createDirIfNotExist(TEMPLATES_DIR);
  await createDirIfNotExist(UPLOAD_DIR);
  await initMongoConnection();
  setupServer();
};

bootstrap();
