import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <span className="page-not-found__text">
        <p className="page-not-found__404">404</p>
        <p className="page-not-found__text--main">
          Woops! Looks like this page doesn't exist.
        </p>
        <p className="page-not-found__subtext">
          Don't worry. You can either return to the previous page or visit our
          homepage.
        </p>
      </span>
      <Link className="page-not-found__link" to="/">
        Home
      </Link>
    </div>
  );
};

export default PageNotFound;
