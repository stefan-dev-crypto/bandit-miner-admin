import * as React from "react";
import { Card } from "../components/Card";

export default function CardLayout({ data }) {
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
    <div className="grid grid-cols-5 gap-x-6 gap-y-4">
      <Card
        title="Total Users"
        value="1000"
        description="Total number of users"
        theme={themes[0]}
      />
      <Card
        title="Total Staked Amount"
        value="100,000"
        description="Total sol amount staked by users"
        theme={themes[1]}
      />
      <Card
        title="Total Locked Amount"
        value="100,000"
        description="55% of total staked amount - Total Claimed Amount"
        theme={themes[1]}
      />
      <Card
        title="Total Team Fee"
        value="50,0"
        description="30% of total staked amount"
        theme={themes[0]}
      />
      <Card
        title="Total Marketing Fee"
        value="1,500"
        description="10% of total staked amount"
        theme={themes[1]}
      />
      <Card
        title="Total Dev Fee"
        value="1,500"
        description="5% of buy/sell amount when user buy/sell"
        theme={themes[1]}
      />
      <Card
        title="Total Claimed Amount"
        value="50,000"
        description="Total amount claimed by users"
        theme={themes[2]}
      />
      <Card
        title="Total Claimable Amount"
        value="50,000"
        description="Total claimable amount by users"
        theme={themes[2]}
      />
      {/* You can reuse themes or create additional ones for each card */}
      <Card
        title="Total Profit User"
        value="50,000"
        description="Total number of users who have profited"
        theme={themes[2]}
      />
      <Card
        title="Total blocked user"
        value="400"
        description=""
        theme={themes[1]}
      />
      <Card
        title="Total blocked amount"
        value="400"
        description="Total claimable amount if users aren't blocked"
        theme={themes[1]}
      />
      <Card
        title="blockable amount"
        value="400"
        description=""
        theme={themes[1]}
      />
      <Card
        title="block percent"
        value="20%"
        description="Percent of claimable amount vs locked amount"
        theme={themes[1]}
      />

      {/* Continue rendering more Cards as needed */}
    </div>
  );
}
