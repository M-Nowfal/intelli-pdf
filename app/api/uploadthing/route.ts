import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});