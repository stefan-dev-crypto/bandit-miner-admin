import React, { useEffect, useState } from "react";
import axios from "axios";
import { BigNumber } from "bignumber.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function StakingTable() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingUser, setEditingUser] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editLimitPercent, setEditLimitPercent] = useState("");

  const calculateSol = (lamports) => {
    return new BigNumber(lamports).div(LAMPORTS_PER_SOL).toFixed(4);
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("https://backend.banditminer.com/api/user/staking/get");
      // const res = await axios.get("http://localhost:8083/api/user/staking/get");
      if (res.data === undefined || res.data === null) {
        setData([]);
      } else {
        setData(res.data);
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

  const updateStatus = async (user, status, limitPercent = null) => {
    try {
      const res = await axios.post(
        "https://backend.banditminer.com/api/user/staking/update",
        {
          user,
          status,
          limitPercent,
        }
      );
      if (res.data.success) {
        setData((prev) =>
          prev.map((item) =>
            item.user === user
              ? { ...item, status: status, limitPercent: limitPercent }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleStatusChange = async (user, currentStatus) => {
    let nextStatus = "allowed";
    if (currentStatus === "allowed") nextStatus = "limited";
    if (currentStatus === "limited") nextStatus = "blocked";
    if (currentStatus == "blocked") nextStatus = "allowed";

    await updateStatus(user, nextStatus);
  };

  const handleLimitPercentChange = (user, value) => {
    const sanitizedValue = parseInt(value);
    if (isNaN(sanitizedValue)) return;

    setData((prev) =>
      prev.map((item) =>
        item.user === user ? { ...item, limitPercent: sanitizedValue } : item
      )
    );

    updateStatus(user, "limited", sanitizedValue);
  };

  const handleSort = () => {
    const sorted = [...data].sort((a, b) =>
      sortOrder === "asc"
        ? a.userStakedAmount - b.userStakedAmount
        : b.userStakedAmount - a.userStakedAmount
    );
    setData(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredData = data.filter((item) =>
    item.user.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const calculateClaimedPercent = (claimed, locked) => {
    const claimedBNLamports = new BigNumber(claimed);
    const lockedBNLamports = new BigNumber(locked);
    if (lockedBNLamports.toNumber() === 0) return 0;
    return claimedBNLamports.div(lockedBNLamports).multipliedBy(100).toFixed(2);
  };

  const handleEdit = (item) => {
    setEditingUser(item.user);
    setEditStatus(item.status);
    setEditLimitPercent(item.limitPercent || 0);
  };

  const handleApply = async () => {
    await updateStatus(
      editingUser,
      editStatus,
      editStatus === "limited" ? editLimitPercent : null
    );
    setEditingUser(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search wallet..."
          className="border p-2 rounded w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div>
          <label className="mr-2">Rows per page:</label>
          <select
            className="border p-1 rounded"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Wallet Address</th>
            <th className="px-4 py-2 cursor-pointer" onClick={handleSort}>
              Staked Amount ⬍
            </th>
            <th className="px-4 py-2">Locked Amount</th>
            <th className="px-4 py-2">Claimed Amount</th>
            <th className="px-4 py-2">Claimed Percent</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Limited Percent</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.user}>
              <td className="border px-4 py-2">{item.user}</td>
              <td className="border px-4 py-2">
                {calculateSol(item.userStakedAmount)}
              </td>
              <td className="border px-4 py-2">
                {calculateSol(item.userLockedAmount)}
              </td>
              <td className="border px-4 py-2">
                {calculateSol(item.userClaimedAmount)}
              </td>

              <td className="border px-4 py-2">
                {calculateClaimedPercent(
                  item.userClaimedAmount,
                  item.userLockedAmount
                )}
                %
              </td>
              <td className="border px-4 py-2">
                {editingUser === item.user ? (
                  <select
                    className="border px-2 py-1"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option value="allowed">Allowed</option>
                    <option value="limited">Limited</option>
                    <option value="blocked">Blocked</option>
                  </select>
                ) : (
                  <span
                    className={`py-1 px-3 text-white rounded ${
                      item.status === "allowed"
                        ? "bg-green-600"
                        : item.status === "blocked"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                )}
              </td>
              <td className="border px-4 py-2">
                {editingUser === item.user && editStatus === "limited" ? (
                  <>
                    <input
                      type="number"
                      className="border px-2 py-1 w-20"
                      value={editLimitPercent}
                      onChange={(e) =>
                        setEditLimitPercent(parseInt(e.target.value))
                      }
                      min="1"
                      max="100"
                    />
                    %
                  </>
                ) : item.status === "limited" ? (
                  `${item.limitPercent || 0}%`
                ) : (
                  "-%"
                )}
              </td>
              <td className="border px-4 py-2">
                {editingUser === item.user ? (
                  <button
                    onClick={handleApply}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Apply
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-gray-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
