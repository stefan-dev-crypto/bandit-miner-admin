import * as React from "react";
import { ReactVirtualizedTable } from "../components/Table";
import { Card } from "../components/Card";

export const AdminLayout = () => {
  return (
    <div>
      <Card />
      <ReactVirtualizedTable />
    </div>
  );
};
