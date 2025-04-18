import { useState, useEffect } from "react";
import axios from "axios";
import CardLayout from "../layouts/CardLayout";
import StakingTable from "../components/Table";

const Home = () => {
  return (
    <div>
      <CardLayout />
      <StakingTable />
    </div>
  );
};

export default Home;
