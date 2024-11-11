import Joi from "joi";
import {
  addBookService,
  deleteBookService,
  exchangeBookService,
  getBookService,
  getExchangeService,
  handleRequestedBook,
  updateBookService,
} from "./service.js";

export const addBookController = async (req, res, next) => {
  try {
    const schema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().required(),
      genre: Joi.string().required(),
      condition: Joi.string().optional().allow(null),
    });
    await schema.validateAsync(req.body);

    // Make Service call
    const response = await addBookService(req.user, req.body);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getBookController = async (req, res, next) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.string().optional(),
      userBooks: Joi.boolean().default(false),
      status: Joi.string().default("available"),
    });

    // Validate the request parameters (id)
    await paramsSchema.validateAsync(req.query);
    // Make Service call
    const response = await getBookService(req.user, req.query);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const updateBookController = async (req, res, next) => {
  try {
    // Define validation schema for the id parameter and request body
    const paramsSchema = Joi.object({
      id: Joi.string().required(), // Validate that the id is a UUID
    });

    const bodySchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().required(),
    });

    // Validate the request parameters (id)
    await paramsSchema.validateAsync(req.query);
    // Validate the request body (title, author)
    await bodySchema.validateAsync(req.body);

    // Call the book service to update the book by id
    const response = await updateBookService(req.query, req.body);

    // Return the updated book information in the response
    return res.json(response);
  } catch (error) {
    // Pass any validation or other errors to the error handler middleware
    next(error);
  }
};

export const deleteBookController = async (req, res, next) => {
  try {
    const paramsSchema = Joi.object({
      id: Joi.string().required(), // Validate that the id is a UUID
    });
    // Validate the request parameters (id)
    await paramsSchema.validateAsync(req.params);
    // Make Service call
    const response = await deleteBookService(req.params);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const exchangeBookController = async (req, res, next) => {
  try {
    const schema = Joi.object({
      bookId: Joi.string().required(),
      receiverId: Joi.string().required(),
      duration: Joi.number().default(7),
      status: Joi.string().default("pending"),
    });

    await schema.validateAsync(req.body);

    // Make Service call
    const response = await exchangeBookService(req.user, req.body);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getExchangeController = async (req, res, next) => {
  try {
    const schema = Joi.object({
      type: Joi.string().required(),
    });

    await schema.validateAsync(req.query);

    // Make Service call
    const response = await getExchangeService(req.user, req.query);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const handleRequestedBookController = async (req, res, next) => {
  try {
    const schema = Joi.object({
      exchangeId: Joi.string().required(),
      bookId: Joi.string().required(),
      status: Joi.string().default("pending"),
    });

    await schema.validateAsync(req.body);

    // Make Service call
    const response = await handleRequestedBook(req.user, req.body);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
