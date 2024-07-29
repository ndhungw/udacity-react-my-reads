import { useCallback, useEffect, useState } from "react";
import * as BooksAPI from "./BooksAPI";
import Book from "./Book";
import { SHELF_TYPE } from "./constants";
import { Link } from "react-router-dom";
import { useAppContext } from "./AppContext";

const useDebounce = (value, delay = 1000) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [delay, value]);

  return {
    debouncedValue,
    isDebouncing: value !== debouncedValue,
  };
};

const useBooksQuery = (query, maxResult) => {
  const [books, setBooks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const searchForBooks = useCallback(async (query, maxResult) => {
    if (!query) {
      setBooks([]);
      return;
    }
    try {
      setIsFetching(true);
      const searchForBooksResp = await BooksAPI.search(query, maxResult).then((resp) => resp);
      console.log("searchForBooks searchForBooksResp:", searchForBooksResp);

      if (searchForBooksResp.error) {
        setBooks([]);
        return;
      }
      setBooks(searchForBooksResp.filter((book) => typeof book.imageLinks?.thumbnail === "string"));
    } catch (error) {
      console.log("Error in :", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    searchForBooks(query, maxResult);
  }, [maxResult, query, searchForBooks]);

  return { books, isFetching };
};

const SearchPage = () => {
  const { books: myBooks, getAllBooks } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const { debouncedValue: debouncedSearchTerm, isDebouncing } = useDebounce(searchTerm);
  const { books: foundBooks, isFetching } = useBooksQuery(
    searchTerm ? debouncedSearchTerm : "",
    10
  );

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/" className="close-search">
          Close
        </Link>
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN"
            value={searchTerm}
            onInput={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="search-books-results">
        {/* <div>{searchTerm}</div>
        <div>{debouncedSearchTerm}</div>
        <div>{isDebouncing ? "debouncing" : "ready"}</div> */}
        {!isFetching && !searchTerm && <div>The found books will be displayed here</div>}
        {(isFetching || isDebouncing) && searchTerm && <div>fetching . . .</div>}
        {!isFetching &&
          !isDebouncing &&
          searchTerm &&
          debouncedSearchTerm &&
          foundBooks.length === 0 && <div>No book found with keyword: {searchTerm}</div>}
        {!isFetching && searchTerm && foundBooks.length > 0 && (
          <ol className="books-grid">
            {foundBooks.map((book) => (
              <li key={book.id}>
                <Book
                  id={book.id}
                  coverImg={book.imageLinks?.thumbnail}
                  authors={book.authors}
                  title={book.title}
                  shelf={myBooks.find((myBook) => myBook.id === book.id)?.shelf || SHELF_TYPE.none}
                  onAfterChangeShelfOfBook={getAllBooks}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
