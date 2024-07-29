import { Link } from "react-router-dom";
import BookShelf from "./BookShelf";
import { SHELF_TYPE } from "./constants";
import { useAppContext } from "./AppContext";

const ListBooks = () => {
  const { booksByShelf, getAllBooks } = useAppContext();

  return (
    <div className="list-books">
      <div className="list-books-title">
        <h1>MyReads</h1>
      </div>
      <div className="list-books-content">
        <div>
          <BookShelf
            title={"Currently Reading"}
            books={booksByShelf[SHELF_TYPE.currentlyReading]}
            onAfterChangeShelfOfBook={getAllBooks}
          />
          <BookShelf
            title={"Want To Read"}
            books={booksByShelf[SHELF_TYPE.wantToRead]}
            onAfterChangeShelfOfBook={getAllBooks}
          />
          <BookShelf
            title={"Read"}
            books={booksByShelf[SHELF_TYPE.read]}
            onAfterChangeShelfOfBook={getAllBooks}
          />
        </div>
      </div>
      <div className="open-search">
        <Link to="/search">Add a book</Link>
      </div>
    </div>
  );
};

export default ListBooks;
