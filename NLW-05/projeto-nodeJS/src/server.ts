import { http } from "./http";
import "./websockets/client";
import "./websockets/admin";

http.listen(3333, () => console.log("server is running on port 3333!"));