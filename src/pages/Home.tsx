import React from "react";
import CardLayout from "../layouts/CardLayout";
import ReactVirtualizedTable from "../components/Table";
import axios from "axios";
import { useState, useEffect } from "react";

const Home = () => {
  const [data, setData] = React.useState<any[]>([]);
  const fetchData = React.useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5173/api/get");
      console.log("response", response);
      console.log("response.data", response.data);
      // if (response.data && Array.isArray(response.data.res)) {
      //   setData(response.data.res);
      // }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }, []);

  React.useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval); // Cleanup
  }, [fetchData]);

  return (
    <div>
      <CardLayout data={[]} />
      <ReactVirtualizedTable />
    </div>
  );
};

export default Home;
