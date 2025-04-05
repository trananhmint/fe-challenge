// import React from "react";
import style from "./spinner.module.css";

const Spinner = ({ isLoading }: { isLoading: boolean }) => {
  return <>{isLoading && <div className={style.loader}></div>}</>;
};

export default Spinner;
