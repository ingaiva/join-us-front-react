import React, { useState, useEffect } from "react";
import "../../../general-style.css"

const Loader = (props) => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 1700);
  }, [show]);

  return (
    <div className={`loader-wrapper ${show ? "mainPage-img" : "loderhide"}`}>
      <div className="typewriter">
        <h1 className="text-white">{process.env.REACT_APP_TITLE_APP} ...</h1>
      </div>
    </div>
  );
};

export default Loader;
