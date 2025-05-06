import React, { useEffect, useState } from "react";
import axios from "axios";
import { BigNumber } from "bignumber.js";
import { Card } from "../components/Card";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function CardLayout() {
  const [totalUsersNum, setTotalUsersNum] = useState("");
  const [totalStakedAmount, setTotalStakedAmount] = useState("");
  const [totalLockedAmount, setTotalLockedAmount] = useState("");
  const [totalTeamFeeAmount, setTotalTeamFeeAmount] = useState("");
  const [totalMarketingFeeAmount, setTotalMarketingFeeAmount] = useState("");
  const [totalDevFeeAmount, setTotalDevFeeAmount] = useState("");
  const [totalClaimedAmount, setTotalClaimedAmount] = useState("");
  const [totalBlockedUsersNum, setTotalBlockedUsersNum] = useState("");

  const calculateFixedSol = (lamports) => {
    return new BigNumber(lamports).div(LAMPORTS_PER_SOL).toFixed(4);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://backend.banditminer.com/api/total/staking/get"
      );
      if (res?.data !== undefined) {
        setTotalUsersNum(res.data.totalUsersNum);
        setTotalStakedAmount(calculateFixedSol(res.data.totalStakedAmount));
        setTotalLockedAmount(calculateFixedSol(res.data.totalLockedAmount));
        setTotalTeamFeeAmount(calculateFixedSol(res.data.totalTeamFeeAmount));
        setTotalMarketingFeeAmount(
          calculateFixedSol(res.data.totalMarketingFeeAmount)
        );
        setTotalDevFeeAmount(calculateFixedSol(res.data.totalDevFeeAmount));
        setTotalClaimedAmount(calculateFixedSol(res.data.totalClaimedAmount));
        setTotalBlockedUsersNum(res.data.totalBlockedUsersNum);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Define some professionally appealing themes
  const themes = [
    {
      background: "rgb(237, 247, 237)", // a soft green background
      titleColor: "rgb(33, 69, 33)",
      valueColor: "rgb(33, 69, 33)",
      descriptionColor: "rgb(60, 100, 60)",
    },
    {
      background: "rgb(237, 243, 255)", // a light blue background
      titleColor: "rgb(20, 40, 80)",
      valueColor: "rgb(20, 40, 80)",
      descriptionColor: "rgb(60, 90, 150)",
    },
    {
      background: "rgb(255, 245, 235)", // a warm neutral background
      titleColor: "rgb(102, 51, 0)",
      valueColor: "rgb(102, 51, 0)",
      descriptionColor: "rgb(153, 102, 51)",
    },
    // Add more theme objects as needed
  ];

  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-4">
      <Card
        title="Total Users"
        value={totalUsersNum}
        symbol=""
        description="Total number of users"
        theme={themes[0]}
      />
      <Card
        title="Total Staked Amount"
        value={totalStakedAmount}
        symbol="SOL"
        description="Total sol amount staked by users"
        theme={themes[1]}
      />
      <Card
        title="Total Locked Amount"
        value={totalLockedAmount}
        symbol="SOL"
        description="55% of total staked amount - Total Claimed Amount"
        theme={themes[1]}
      />
      <Card
        title="Total Team Fee"
        value={totalTeamFeeAmount}
        symbol="SOL"
        description="30% of total staked amount"
        theme={themes[0]}
      />
      <Card
        title="Total Marketing Fee"
        value={totalMarketingFeeAmount}
        symbol="SOL"
        description="10% of total staked amount"
        theme={themes[1]}
      />
      <Card
        title="Total Dev Fee"
        value={totalDevFeeAmount}
        symbol="SOL"
        description="5% of buy/sell amount when user buy/sell"
        theme={themes[1]}
      />
      <Card
        title="Total Claimed Amount"
        value={totalClaimedAmount}
        symbol="SOL"
        description="Total amount claimed by users"
        theme={themes[2]}
      />
      {/* <Card
        title="Total Claimable Amount"
        value="50,000"
        description="Total claimable amount by users"
        theme={themes[2]}
      />
      <Card
        title="Total Profit User"
        value="50,000"
        description="Total number of users who have profited"
        theme={themes[2]}
      /> */}
      <Card
        title="Total blocked User"
        value={totalBlockedUsersNum}
        symbol=""
        description=""
        theme={themes[1]}
      />
      {/* <Card
        title="Total blocked amount"
        value="400"
        description="Total claimable amount if users aren't blocked"
        theme={themes[1]}
      /> */}
      {/* <Card
        title="blockable amount"
        value="400"
        description=""
        theme={themes[1]}
      /> */}
      {/* <Card
        title="block percent"
        value="20%"
        description="Percent of claimable amount vs locked amount"
        theme={themes[1]}
      /> */}

      {/* Continue rendering more Cards as needed */}
    </div>
  );
}
