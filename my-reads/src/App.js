import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ListBooks from "./ListBooks";
import SearchPage from "./SearchPage";

import { AppContextProvider } from "./AppContext";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        index: true,
        element: <ListBooks />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
    ],
  },
]);

function App() {
  return (
    <AppContextProvider>
      <div className="app">
        <RouterProvider router={router} />
      </div>
    </AppContextProvider>
  );
}

export default App;
