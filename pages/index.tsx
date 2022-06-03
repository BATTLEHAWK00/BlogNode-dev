import React from "react";
import { GetServerSideProps } from "next";
import user from "../src/orm/model/userModel";
import NormalLayout from "../components/layout/normal";

class Hello extends React.Component {
  render() {
    return <NormalLayout>{JSON.stringify(this.props)}</NormalLayout>;
  }
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      title: "首页",
      users: JSON.stringify(await user.getAllUsers()),
    },
  };
};

export default Hello;
