import express from "express";
import cors from "cors";
// import pino from "pino-http";
import contactsRouter from "./routers/contacts.js";
import { getEnvVar } from "./utils/getEnvVar.js";


export const setupServer = () => {
    const app = express();

    // const logger = pino({
    //     transport: {
    //       target: 'pino-pretty',
    //       options: {
    //         colorize: true,
    //         levelFirst: true,
    //       },
    //     }
    //   });


      app.use(cors());
      app.use(express.json());
      // app.use(logger);



      app.use("/contacts", contactsRouter);

      app.use((req, res) => {
        res.status(404).json({ message: `Resource ${req.url} not found` });
      });


    const port = Number(getEnvVar("PORT", 3000));
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
};
