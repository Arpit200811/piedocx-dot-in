import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-bg">
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="notfound-content">
  
        <p className="subtitle">Oops! Page Not Found</p>
        <p className="description">
          Our robot is lost in space. The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="home-button">🚀 Take Me Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
