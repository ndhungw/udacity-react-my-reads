import Book from "./Book";

const BookShelf = ({ title, books, onAfterChangeShelfOfBook }) => {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map((book) => (
            <li key={book.id}>
              <Book
                id={book.id}
                title={book.title}
                authors={book.authors}
                coverImg={book.imageLinks.thumbnail}
                shelf={book.shelf}
                onAfterChangeShelfOfBook={onAfterChangeShelfOfBook}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default BookShelf;
