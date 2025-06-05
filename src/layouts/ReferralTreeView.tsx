import React, { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import BigNumber from "bignumber.js";

// Helper: Convert lamports to SOL
const calculateSol = (lamports) => {
  return new BigNumber(lamports).div(LAMPORTS_PER_SOL).toFixed(4);
};

// Build a referral tree and track each wallet
const buildReferralTree = (users) => {
  const userMap = new Map();

  // Add real users
  users.forEach((user) => {
    userMap.set(user.user, { ...user, children: [] });
  });

  // Add missing referral parents as placeholder nodes
  users.forEach((user) => {
    if (user.referral && !userMap.has(user.referral)) {
      userMap.set(user.referral, {
        user: user.referral,
        referral: null,
        referralFeeAmount: 0,
        children: [],
        isPlaceholder: true,
      });
    }
  });

  // Link children to parents
  userMap.forEach((user) => {
    if (user.referral && userMap.has(user.referral)) {
      userMap.get(user.referral).children.push(user);
    }
  });

  // Return root nodes (wallets with no referrer or unlisted referrer)
  const roots = [];
  userMap.forEach((user) => {
    if (!user.referral || !userMap.has(user.referral)) {
      roots.push(user);
    }
  });

  return roots;
};

// Recursive tree view
const TextTree = ({ nodes, prefix = "" }) => {
  return (
    <>
      {nodes.map((node, index) => {
        const isLast = index === nodes.length - 1;
        const branch = isLast ? "└── " : "├── ";
        const newPrefix = prefix + (isLast ? "    " : "│   ");

        const earnedLamports = node.children.reduce(
          (sum, child) => sum + parseInt(child.referralFeeAmount || 0),
          0
        );

        const earnedSol = calculateSol(earnedLamports);
        const feeSol = calculateSol(node.referralFeeAmount || 0);
        const invitedCount = node.children.length;

        const label = `[${node.user}]  ➤  Earned: ${earnedSol} SOL | Fee Paid: ${feeSol} SOL | Invited: ${invitedCount}`;

        return (
          <div key={node.user}>
            <div
              style={{
                fontFamily: "monospace",
                whiteSpace: "pre",
                color: node.isPlaceholder
                  ? "#f59e0b"
                  : invitedCount > 0
                  ? "#22c55e"
                  : "#a1a1aa",
              }}
              title={node.user}
            >
              {prefix + branch + label}
            </div>
            {invitedCount > 0 && (
              <TextTree nodes={node.children} prefix={newPrefix} />
            )}
          </div>
        );
      })}
    </>
  );
};

const ReferralTreeView = () => {
  const [referralData, setReferralData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://backend.banditminer.com/api/user/referral/get"
        // "http://localhost:8083/api/u/ser/referral/get"
      );
      if (res?.data) {
        setReferralData(res.data);
      }
    } catch (err) {
      console.error("Error fetching referral data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const tree = buildReferralTree(referralData);

  const totalInvited = referralData.filter((u) => u.referral).length;
  const totalPaid = referralData.reduce(
    (sum, u) => sum + parseInt(u.referralFeeAmount || 0),
    0
  );

  return (
    <div className="p-4 bg-black text-green-400 rounded-lg shadow-md max-h-screen overflow-auto">
      <div className="text-white mb-4">
        <h2 className="text-xl font-bold mb-2">Referral Tree</h2>
        <h3>
          Earn a 5% commission in SOL on the initial purchase made by anyone who
          uses your referral link.
        </h3>
        <h3>Total Invited Users: {totalInvited}</h3>
        <h3>Total Paid Fee: {calculateSol(totalPaid)} SOL</h3>
      </div>
      <TextTree nodes={tree} />
    </div>
  );
};

export default ReferralTreeView;
