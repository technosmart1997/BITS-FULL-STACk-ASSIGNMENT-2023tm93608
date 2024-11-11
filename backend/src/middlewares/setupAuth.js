import { verifyToken } from "./auth.js";

export const setupAuth = (app, routes) => {
  routes.forEach((r) => {
    if (r.auth) {
      app.use(r.url, verifyToken, (req, res, next) => {
        next();
      });
    }
  });
};
