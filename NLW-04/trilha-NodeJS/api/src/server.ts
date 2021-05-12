import express from "express";

import router from "./routes"

const api = express();

api.get("/", ( request, response ) => response.json({message: "Hello world!"}))

api.use("/users", router)

api.listen(3333, () => console.log("Server is running!"))
