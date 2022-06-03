import React, { Component } from "react";
import NavBar from "../../navbar";
import styles from "./index.module.css";

class NormalLayout extends React.Component {
  render(): React.ReactNode {
    return (
      <>
        <NavBar />
        <main className={styles.main}>{this.props.children}</main>
      </>
    );
  }
}

export default NormalLayout;
