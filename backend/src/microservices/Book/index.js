// src/ProductService.js
import { extractUserInfo } from "../../middlewares/userInfo.js";
import { BaseService } from "../server.js";
import {
  addBookController,
  deleteBookController,
  exchangeBookController,
  getBookController,
  getExchangeController,
  handleRequestedBookController,
  updateBookController,
} from "./controller.js";
// import { LoginController, SignupController } from "./controller.js";

class BookService extends BaseService {
  constructor(port) {
    super(port);
    this.products = [];
  }

  initializeRoutes() {
    super.initializeRoutes();
    this.router.post("/", extractUserInfo, this.addBook.bind(this));
    this.router.post(
      "/exchange",
      extractUserInfo,
      this.exchangeBook.bind(this)
    );

    this.router.post(
      "/update/status",
      extractUserInfo,
      this.handleRequestedBook.bind(this)
    );

    this.router.get("/", extractUserInfo, this.getBooks.bind(this));
    this.router.get("/exchange", extractUserInfo, this.getExchanges.bind(this));

    this.router.patch("/:id", extractUserInfo, this.updateBook.bind(this));
    this.router.delete("/:id", extractUserInfo, this.deleteBook.bind(this));

    this.router.use("/book", this.router);
  }

  addBook(req, res, next) {
    return addBookController(req, res, next);
  }

  getBooks(req, res, next) {
    return getBookController(req, res, next);
  }

  updateBook(req, res, next) {
    return updateBookController(req, res, next);
  }

  deleteBook(req, res, next) {
    return deleteBookController(req, res, next);
  }

  exchangeBook(req, res, next) {
    return exchangeBookController(req, res, next);
  }

  handleRequestedBook(req, res, next) {
    return handleRequestedBookController(req, res, next);
  }

  getExchanges(req, res, next) {
    return getExchangeController(req, res, next);
  }
}

// Start the service
const productService = new BookService(3002);
productService.listen();
