import express from "express";
import cors from "cors";
import pino from "pino-http";
// import {contacts} from "./db/contacts.js";
import { getEnvVar } from "./utils/getEnvVar.js";
import * as contactsServices from "./services/contacts-services.js";


export const setupServer = () => {
    const app = express();

    const logger = pino({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
          },
        }
      });


      app.use(cors());
      app.use(express.json());
      app.use(logger);

    // app.use((req, res, next) => {
    //     console.log("111111111");
    //     next();
    // });

    app.get("/", (req, res) => {
        res.send("<h1>Hello World!</h1>" );
      });

    // app.get("/contacts", (req, res) => {
    //     res.send("<h1>My contacts</h1>" );
    //   });

    app.get("/contacts", async(req, res) => {
        const contacts = await contactsServices.getContacts();

        res.json({
          status: 200,
          message: 'Successfully found contacts!',
          data: contacts,
        });
        // res.send(contacts);
      });

      app.get("/contacts/:contactId", async(req, res) => {
        // console.log(req.params);
        const {contactId} = req.params;
        const data = await contactsServices.getContactById(contactId);

        if (!data) {
          res.status(404).json({
            status: 404,
            message: `Contact with id ${contactId} not found`,
          });
          return;
        };
        res.json({
          status: 200,
          message: `Successfully found contact with id ${contactId}!`,
          data,
      });
      });
    app.use((req, res) => {
        res.status(404).json({ message: `Resource ${req.url} not found` });
    });


    const port = Number(getEnvVar("PORT", 3000));
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
};
