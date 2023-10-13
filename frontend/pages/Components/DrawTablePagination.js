import React, { useEffect } from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { Tooltip } from 'react-tooltip';


import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const url = process.env.NEXT_PUBLIC_BLOCK_EXPLORER
export default function DrawTableWithPropagination({ rows, columns, columnPrint, sliceAmount }) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    useEffect(() => {
        console.log("inside", rows);
    }, [rows]);

    return (
        <Paper sx={{ width: '100%' }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Transactions</StyledTableCell>
                            {
                                columns.map(it => {
                                    return <StyledTableCell align="center" key={it}>{it}</StyledTableCell>
                                })
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : rows
                        ).map((row) => (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell component="th" scope="row" bac='0x555555' width="35%">
                                    <a className="text-sky-600" href={`${url}/tx/${row.txHash}`}>
                                        {row.txHash.slice(0, sliceAmount)}...
                                    </a>
                                    {row.confirmed &&
                                            <a id="anchor"><ThumbUpOffAltIcon/>
                                            <Tooltip
                                                anchorSelect="#anchor"
                                                content="Transaction Confirmed!!"
                                            />
                                            </a>
                                    }
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    <a className="text-sky-600" href={`${url}/token/${row.collection}`}> {row.collection.slice(0, sliceAmount)}... </a>
                                </StyledTableCell>
                                {
                                    columnPrint.map(it => {
                                        return it === "recipient" ?
                                            <StyledTableCell align="center" >{
                                                <a className="text-sky-600" href={`${url}/address/${it}`}> {row[it].slice(0, sliceAmount)}... </a>
                                            }</StyledTableCell>
                                            :
                                            <StyledTableCell align="center" >{row[it]}</StyledTableCell>
                                    })}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}