// src/AuthService.js
import { BaseService } from "../server.js";
import { verifyToken } from "../../middlewares/auth.js";
import {
  DashboardController,
  LoginController,
  SignupController,
} from "./controller.js";

class AuthService extends BaseService {
  constructor(port) {
    super(port);
  }

  initializeRoutes() {
    super.initializeRoutes();

    // Define the routes for orders
    this.router.post("/login", this.login.bind(this));
    this.router.post("/signup", this.signup.bind(this));
    this.router.get("/account", verifyToken, this.getAccount.bind(this));
    this.router.get("/reset/password", verifyToken, this.getAccount.bind(this));

    this.router.use("/auth", this.router);
  }

  async getAccount(req, res, next) {
    return await DashboardController(req, res, next);
  }

  async resetPassword(req, res, next) {
    return await DashboardController(req, res, next);
  }

  async signup(req, res, next) {
    return await SignupController(req, res, next);
  }

  async login(req, res, next) {
    return await LoginController(req, res, next);
  }

  // async logout(req, res, next) {
  //   return await LoginController(req, res, next);
  // }
}

// Start the service
const orderService = new AuthService(3001);
orderService.listen();
