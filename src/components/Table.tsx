import * as React from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso } from "react-virtuoso";
import TableSortLabel from "@mui/material/TableSortLabel";

const columns = [
  { width: 200, label: "User Wallet", dataKey: "user" },
  {
    width: 200,
    label: "Staked Sol Amount",
    dataKey: "stakedAmount",
    numeric: true,
  },
  {
    width: 200,
    label: "Locked Sol Amount",
    dataKey: "lockedAmount",
    numeric: true,
  },
  {
    width: 250,
    label: "Claimed SOL Amount",
    dataKey: "claimedAmount",
    numeric: true,
  },
  {
    width: 250,
    label: "Claimable SOL Amount",
    dataKey: "claimableAmount",
    numeric: true,
  },
  { width: 100, label: "Miners", dataKey: "miners", numeric: true },
  {
    width: 250,
    label: "Claimable Percent(%)",
    dataKey: "claimablePercent",
    numeric: true,
  },
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: React.forwardRef((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

export default function ReactVirtualizedTable() {
  const [sortBy, setSortBy] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState("asc");
  const [data, setData] = React.useState([]);

  const handleSort = (columnKey) => {
    const isAsc = sortBy === columnKey && sortDirection === "asc";
    const direction = isAsc ? "desc" : "asc";
    setSortBy(columnKey);
    setSortDirection(direction);

    const sorted = [...data].sort((a, b) => {
      if (a[columnKey] < b[columnKey]) return direction === "asc" ? -1 : 1;
      if (a[columnKey] > b[columnKey]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setData(sorted);
  };

  const fixedHeaderContent = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric ? "right" : "left"}
          style={{ width: column.width }}
          sx={{ backgroundColor: "background.paper" }}
          sortDirection={sortBy === column.dataKey ? sortDirection : false}
        >
          <TableSortLabel
            active={sortBy === column.dataKey}
            direction={sortBy === column.dataKey ? sortDirection : "asc"}
            onClick={() => handleSort(column.dataKey)}
          >
            {column.label}
          </TableSortLabel>
        </TableCell>
      ))}
    </TableRow>
  );

  const rowContent = (_index, row) => (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric ? "right" : "left"}
        >
          {column.dataKey === "beanRewards"
            ? parseFloat(row[column.dataKey]).toFixed(4) // Format SOL with 4 decimals
            : row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );

  return (
    <div className="pt-10">
      {/* <div className="bg-gray-50 pt-10"></div> */}
      <Paper
        style={{
          height: 500,
          width: "100%",
          overflowX: "auto",
          minWidth: 1000,
        }}
      >
        <TableVirtuoso
          data={data}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
    </div>
  );
}
