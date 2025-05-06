import { useState, useEffect } from "react";
import axios from "axios";
import CardLayout from "../layouts/CardLayout";
import StakingTable from "../components/Table";
import ReferralTreeView from "../layouts/ReferralTreeView";

const Home = () => {
  return (
    <div>
      <CardLayout />
      <StakingTable />
      <ReferralTreeView />
    </div>
  );
};

export default Home;
