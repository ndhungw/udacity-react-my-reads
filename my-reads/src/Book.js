import { useState } from "react";
import * as BooksAPI from "./BooksAPI";
import { SHELF_TYPE } from "./constants";

const shelfOptions = [
  { label: "Currently Reading", value: SHELF_TYPE.currentlyReading },
  { label: "Want to Read", value: SHELF_TYPE.wantToRead },
  { label: "Read", value: SHELF_TYPE.read },
  { label: "None", value: SHELF_TYPE.none },
];

const Book = ({ id, coverImg, title, authors, shelf: shelfProp, onAfterChangeShelfOfBook }) => {
  const [shelf, setShelf] = useState(shelfProp || SHELF_TYPE.none);

  const onChangeShelfOfBook = async (e) => {
    const nextShelf = e.target.value;
    console.log("change to shelf: ", nextShelf);

    setShelf(nextShelf);

    try {
      const updateResp = await BooksAPI.update(
        {
          id,
        },
        nextShelf
      );
      console.log("onChangeShelf  updateResp:", updateResp);
      onAfterChangeShelfOfBook?.();
    } catch (error) {
      console.log("Error in :", error);
    }
  };

  return (
    <div className="book">
      <div className="book-top">
        <div
          className="book-cover"
          style={{
            width: 128,
            height: 193,
            backgroundImage: `url(${coverImg})`,
          }}
        ></div>
        <div className="book-shelf-changer">
          <select value={shelf} onChange={onChangeShelfOfBook}>
            <option value="" disabled>
              Move to...
            </option>
            {shelfOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="book-title">{title}</div>
      <div className="book-authors">{authors?.join(", ")}</div>
    </div>
  );
};

export default Book;
