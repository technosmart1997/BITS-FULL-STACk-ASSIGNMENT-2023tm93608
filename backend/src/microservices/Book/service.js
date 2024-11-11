import { Exchange, ExchangeStatus } from "../../db/mongodb/models/Exchange.js";
import { Book } from "../../db/mongodb/models/book.js";

export const addBookService = async (user, data) => {
  // Validate User in database
  const { title, author, genre, condition } = data;

  const { _id } = user;
  // Get User using email
  await Book.create({
    title,
    author,
    genre,
    condition,
    userId: _id,
  });

  return {
    status: 201,
    message: "Book Added!",
  };
};

export const getBookService = async (
  user,
  { id = null, userBooks = false, status = "available" }
) => {
  const isUserBooks = userBooks === "true" ? true : false;
  const { _id } = user;

  // Add User
  let filter = {};
  if (isUserBooks && status === "requested" && !id) {
    filter = {
      userId: _id,
      status,
    };
  } else if (isUserBooks && !id) {
    filter = {
      userId: _id,
    };
  } else if (!isUserBooks && !id) {
    filter = {
      userId: { $ne: _id },
      status,
    };
  } else if (id) {
    filter = {
      _id: id,
    };
  }

  const books = await Book.find(filter, { __v: 0 });
  return {
    status: 200,
    message: "Books fetched!",
    data: books,
  };
};

export const updateBookService = async (params, body) => {
  const { id } = params;
  // Add User
  await Book.updateOne({ _id: id }, { $set: { ...body } });

  return {
    status: 201,
    message: "Book Updated!",
  };
};

export const deleteBookService = async (params) => {
  const { id } = params;
  // Add User
  await Book.deleteOne({ _id: id });

  return {
    status: 200,
    message: "Book Deleted!",
  };
};

export const exchangeBookService = async (user, data) => {
  // Validate User in database
  const { _id: senderId } = user;
  const { bookId, receiverId, duration = 7 } = data;
  // Get User using email

  // Add the exchange for now (TODO: Add Validations)
  const exchangeRequest = {
    bookId,
    senderId,
    receiverId,
    duration,
    status: ExchangeStatus.PENDING,
  };

  await Exchange.create(exchangeRequest);

  // Udpate book status to requested
  await Book.updateOne(
    {
      _id: bookId,
    },
    {
      $set: {
        status: "requested",
      },
    }
  );

  return {
    status: 201,
    message: "Exchange Request Sent!",
  };
};

// Handle book status update by book owner
export const handleRequestedBook = async (user, data) => {
  // Validate User in database
  const { bookId, status, exchangeId } = data;
  // Get User using email

  // Find exchange request based on exchangeId

  const exchange = await Exchange.findOne({ _id: exchangeId });
  if (!exchange) {
    return {
      status: 404,
      message: "Exchange Request not found!",
    };
  }

  // Update exchange status to what is being sent
  await Exchange.updateOne(
    { _id: exchangeId },
    {
      $set: {
        status,
      },
    }
  );

  if (status === "accepted") {
    // Set book to be unavailable for next duration
    await Book.updateOne(
      {
        _id: bookId,
      },
      {
        $set: {
          status: "reserved",
        },
      }
    );
  } else if (status === "rejected") {
    // Status marked rejected mark book to be available again
    await Book.updateOne(
      {
        _id: bookId,
      },
      {
        $set: {
          status: "available",
        },
      }
    );
  }

  return {
    status: 201,
    message: "Status updated!",
  };
};

export const getExchangeService = async (user, params) => {
  // Validate User in database
  const { type } = params;
  // Get User using email
  let filter = {};
  if (type === "my-request") {
    filter = {
      senderId: user._id,
    };
  } else if (type === "granted-books") {
    filter = {
      receiverId: user._id,
      status: "accepted",
    };
  } else {
    filter = {
      receiverId: user._id,
      status: { $nin: ["accepted"] },
    };
  }

  const response = await Exchange.aggregate([
    {
      $match: filter,
    },
    {
      $project: { __v: 0 },
    },
    {
      $lookup: {
        from: "books", // Collection to join
        localField: "bookId", // Field from `books` collection
        foreignField: "_id", // Field from `exchange` collection
        as: "requestedBooks", // Output array field
      },
    },
  ]);

  let books = [];
  for (const ex of response) {
    const { requestedBooks } = ex;
    for (const book of requestedBooks) {
      delete ex["requestedBooks"];
      books.push({
        ...book,
        exchange: {
          ...ex,
        },
      });
    }
  }

  return {
    status: 201,
    message: "Status updated!",
    data: books,
  };
};
