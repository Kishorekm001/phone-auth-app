import React from "react";
import { Link } from "react-router-dom";

const Sucess = () => {
  return (
    <div className="success_wrapper">
      <h2>You have successfully signed up!</h2>
      <div>
        <Link to="/">Go back</Link>
      </div>
    </div>
  );
};

export default Sucess;
