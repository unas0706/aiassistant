import React from "react";
import { Link } from "react-router-dom";

const Card = () => {
  return (
    <>
      <Link
        to="/"
        class="card col col-6 col-md-4 col-lg-3 mb-4"
        style={{ width: "18rem" }}
      >
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZiKbdm61On0OKn0E2KtFw3lMUuf0HyuqxXQ&s"
          class="card-img-top"
          alt="..."
          style={{ height: "150px", width: "100%" }}
        />
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
        </div>
      </Link>
    </>
  );
};

export default Card;
