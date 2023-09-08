import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  TablePagination,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { BASE_URL } from "../../resource/constants";
import axios from "axios";
import "./allTransactionList.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#b5ddf7",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const StyledTableRowBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`, // Add border
  boxShadow: theme.shadows[1], // Add box shadow
}));

export default function AllTransactionPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [transactions, setTransactions] = React.useState([]);
  const [totalNoOftransaction, setTotalNoOfTransaction] = React.useState(10);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const token = localStorage.getItem("Wallet__token");
    const headers = { Authorization: token };

    let url =
      BASE_URL +
      "/wallet/all-transactions?page=" +
      page +
      "&size=" +
      rowsPerPage;
    setLoading(true);
    axios.get(url, { headers }).then((response) => {
      setTransactions(response.data.transactions);
      setTotalNoOfTransaction(response.data.totalItems);
      setLoading(false);
    });
  }, [page, rowsPerPage, totalNoOftransaction]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <TableContainer
      sx={{ marginTop: 1, paddingLeft: 1, paddingRight: 1 }}
      component={Paper}
    >
      <h3> All Transactions</h3>
      {loading ? (
        <CircularProgress sx={{ margin: "auto" }} />
      ) : !isMobile ? (
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Transaction Id</StyledTableCell>
              <StyledTableCell align="left">Amount</StyledTableCell>
              <StyledTableCell align="right"> Transaction Type</StyledTableCell>
              <StyledTableCell align="right">From</StyledTableCell>
              <StyledTableCell align="right">To</StyledTableCell>
              <StyledTableCell align="right">Transaction Date</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <StyledTableRow key={transaction.transactionId}>
                <StyledTableCell component="th" scope="row">
                  {transaction.transactionId}
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  style={{ color: transaction.amount > 0 ? "green" : "red" }}
                >
                  {" "}
                  <CurrencyRupeeIcon fontSize="small" />
                  {Math.abs(transaction.amount)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {transaction.transactionType}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {transaction.sender}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {transaction.receiver}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {new Date(transaction.transactionDate).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Box>
          {transactions.map((transaction) => (
            <StyledTableRowBox key={transaction.transactionId}>
              <Typography
                variant="body1"
                component="div"
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
              >
                <strong>Transaction Id:</strong>
                <Typography
                  variant="body1"
                  sx={{ textAlign: "right", whiteSpace: "nowrap" }}
                >
                  {transaction.transactionId}
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
              >
                <strong>Amount:</strong>
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "right",
                    color: transaction.amount > 0 ? "green" : "red",
                  }}
                >
                  <CurrencyRupeeIcon fontSize="small" />
                  {Math.abs(transaction.amount)}
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
              >
                <strong>Transaction Type:</strong>
                <Typography variant="body1" sx={{ textAlign: "right" }}>
                  {transaction.transactionType}
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
              >
                <strong>From:</strong>
                <Typography variant="body1" sx={{ textAlign: "right" }}>
                  {transaction.sender}
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
              >
                <strong>To:</strong>
                <Typography variant="body1" sx={{ textAlign: "right" }}>
                  {transaction.receiver}
                </Typography>
              </Typography>
              <Typography
                variant="body1"
                component="div"
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
              >
                <strong>Transaction Date:</strong>
                <Typography variant="body1" sx={{ textAlign: "right" }}>
                  {new Date(transaction.transactionDate).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </Typography>
              </Typography>
            </StyledTableRowBox>
          ))}
        </Box>
      )}
      <TablePagination
        component="div"
        count={totalNoOftransaction}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
