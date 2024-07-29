import { createContext, useContext, useCallback, useEffect, useState, useMemo } from "react";
import * as BooksAPI from "./BooksAPI";
import { SHELF_TYPE } from "./constants";

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(`useAppContext must be used inside <AppContextProvider/>`);
  }
  return context;
};

export const AppContextProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  const booksByShelf = useMemo(() => {
    return classifyBooksByShelf(books);
  }, [books]);

  const getAllBooks = useCallback(async () => {
    try {
      const allBooks = await BooksAPI.getAll();
      setBooks(allBooks);
    } catch (error) {
      console.log({ error });
    }
  }, []);

  useEffect(() => {
    getAllBooks();
  }, [getAllBooks]);

  const value = useMemo(() => {
    return {
      books,
      booksByShelf,
      getAllBooks,
    };
  }, [books, booksByShelf, getAllBooks]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const getShelfLib = () => ({
  [SHELF_TYPE.currentlyReading]: [],
  [SHELF_TYPE.wantToRead]: [],
  [SHELF_TYPE.read]: [],
  [SHELF_TYPE.none]: [],
});

const classifyBooksByShelf = (books) => {
  return books.reduce((_booksByShelf, book) => {
    if (Object.keys(SHELF_TYPE).includes(book.shelf)) {
      if (_booksByShelf[book.shelf]) {
        _booksByShelf[book.shelf].push(book);
      } else {
        _booksByShelf[book.shelf] = [book];
      }
    }
    return _booksByShelf;
  }, getShelfLib());
};
