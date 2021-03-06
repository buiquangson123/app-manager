import { Fragment, useCallback, useEffect, useState } from "react"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import Pagination from "@mui/material/Pagination";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from "@mui/material/Checkbox";
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { handleConvertNumberToString } from './common/helper/department.helper'
import { selectedRow, user } from '../stores/sliceMemberInfor/index'
import { handleCurrentPage } from "./pagination/pagination.component";
import { useDispatch } from "react-redux";
import { sortUsers } from "../api/member";

interface ListDepart {
    id: number,
    name_depart: string
}

interface ISortedColumn {
    type: string, 
    value: string
}

interface MainTable {
    loading: boolean,
    stateAccount: user,
    stateInfor: user[],
    stateSelected: number[],
    listDepart: ListDepart,
    sortedColumn: ISortedColumn,
    handleAddUser: () => void,
    handleDeleteUser: (id:number) => void,
    handleEditUser: (id:number) => void,
    setSortColumn: (type: string, value: string) => void
}

let PageSize = 3;

const MainTable = ({
    loading,
    stateAccount,
    stateInfor,
    stateSelected,
    listDepart,
    handleAddUser,
    handleDeleteUser,
    handleEditUser,
    setSortColumn,
    sortedColumn
}: MainTable) => {
    const dispatch = useDispatch();
    const [pageSize, setPageSize] = useState(PageSize);
    
    const [stateInforUpdate, setSateInforUpdate] = useState<user[]>(stateInfor);
    const [currentTableData, setCurrentTableData] = useState<user[]>(
        handleCurrentPage(parseInt(localStorage.getItem("currentPage") as string) || 1, stateInforUpdate, pageSize)
    );
    const [page, setPage] = useState(parseInt(localStorage.getItem("currentPage") as string) || 1)

    useEffect(() => {
        setSateInforUpdate(stateInfor);
        const getCurrPage = parseInt(localStorage.getItem("currentPage") as string);
        if (Math.ceil(stateInfor.length / pageSize) < getCurrPage) setPage(getCurrPage - 1) //delete all last page => active button page-1
        if (getCurrPage && Math.ceil(stateInfor.length / pageSize) >= getCurrPage) {
            return setCurrentTableData(handleCurrentPage(getCurrPage, stateInfor, pageSize));
        } else {
            setPage(Math.ceil(stateInfor.length / pageSize))
            return setCurrentTableData(handleCurrentPage(Math.ceil(stateInfor.length / pageSize), stateInfor, pageSize));
        }
    }, [stateInfor, pageSize]);

    const handlePagination = (
        e: React.ChangeEvent<unknown>,
        currPage: number
    ) => {
        localStorage.setItem("currentPage", currPage as any);
        setCurrentTableData(handleCurrentPage(currPage, stateInforUpdate, pageSize));
        setPage(currPage as any)
    };


    const handleChange = (event: SelectChangeEvent) => {
        setPageSize(event.target.value as any);
    };

    const [amoutSelected, setAmountSelected] = useState(false)
    const [isOneOfSelected, setIsOneOfSelected] = useState(false)
    const isSelected = (id: number) => stateSelected.includes(id);

    const handleChangeSelected = async(id: number) => {
        await dispatch(selectedRow({id: id, type: "one"}))
    }
    
    
    const handleSelectedAll = () => {
        setAmountSelected(true)
        stateInfor.map((user) => {
            dispatch(selectedRow({ id: user.id, type: "all", isCheck: amoutSelected }))
        })
    }
    
    useEffect(() => {
        if (stateSelected.length === stateInfor.length) {
            setAmountSelected(true)
        } else if (!!stateSelected.length && stateSelected.length !== stateInfor.length){
            setAmountSelected(false)
            setIsOneOfSelected(true)
        } else {
            setIsOneOfSelected(false)
            setAmountSelected(false)
        }
    }, [stateSelected]) 


    const sortColumn = useCallback((value: string, type: string) => async () => {
            // const direction = (!sortedColumn || sortedColumn.dataKey !== column.dataKey)
            //   ? 'desc' : (sortedColumn.type === 'desc' ? 'asc' : 'desc');
        console.log("111")
        const sortAPI = await sortUsers(value, type)
            // setColumn(sortAPI.data)
        setCurrentTableData(handleCurrentPage(parseInt(localStorage.getItem("currentPage") as string), sortAPI.data, pageSize))
    },[sortedColumn])
    

    const handleSort = (value: string, type: string) => {
        setSortColumn(value, type)
        sortColumn(value, type)
        // const handleAPI = async() => {
        //     const sortAPI = await sortUsers(value, type)
        //     console.log(sortAPI.data)
        //     setCurrentTableData(handleCurrentPage(parseInt(localStorage.getItem("currentPage") as string), sortAPI.data, pageSize))
        // }
        // handleAPI()
    }


    return (
        <Fragment>
            {loading && <div className="loader m-auto"></div> }
            {!loading && stateAccount.id >= 0 && listDepart && !!stateInfor.length && !!stateInfor.length && currentTableData.length && (
                <div className="Container-body mt-5">
                    <div className="flex justify-between">
                    {stateAccount.role === "admin" && <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddUser}
                        style={{ maxWidth: '80px', maxHeight: '45px', }}
                    >
                        Add
                    </Button>}
                    
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small">PageSize</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={pageSize as any}
                            label="PageSize"
                            onChange={handleChange}
                        >
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                        </Select>
                    </FormControl>
                    </div>
                    <TableContainer component={Paper} className="mt-3">
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell >
                                        <Checkbox 
                                            onChange={handleSelectedAll} 
                                            checked={amoutSelected}
                                            icon={!amoutSelected ? isOneOfSelected ? <IndeterminateCheckBoxIcon /> : <CheckBoxOutlineBlankOutlinedIcon />  : <CheckBoxIcon /> }
                                        />
                                    </TableCell>
                                   
                                    <TableCell >
                                        <span>H??? v?? t??n</span>
                                    <button onClick={() => handleSort("name", "asc")}>
                                            <img
                                                // src={`sort${sortedColumn && sortedColumn?.type
                                                //     && column.dataKey === sortedColumn.dataKey
                                                //     ? sortedColumn.type === 'asc'
                                                //         ? '-asc'
                                                //         : '-desc'
                                                //     : '-primary-36'
                                                //     }.svg`}
                                                src={`sort-primary-36.svg`}
                                                alt='Sort' />
                                        </button>
                                    </TableCell>
                                    
                                    <TableCell >
                                        <span>?????a ch???</span>
                                        <button onClick={() => handleSort("address", "desc")}>
                                            <img
                                                src={`sort-asc.svg`}
                                                alt='Sort' />
                                        </button>
                                    </TableCell>
                                    <TableCell >
                                        Tu???i
                                    </TableCell>
                                    <TableCell >
                                        S??? ??i???n tho???i
                                    </TableCell>
                                    <TableCell >
                                        Email
                                    </TableCell>
                                    
                                    <TableCell >
                                        Ph??ng ban
                                    </TableCell>
                                    {stateAccount.role === "admin" && (
                                        <TableCell >T??y ch???n</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentTableData.map((user) => {
                                    const isCheckSelected = isSelected(user.id)
                                    return (
                                        <TableRow
                                        key={`${user.name}-${user.id}`}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                        >
                                            <TableCell padding="checkbox" align="center">
                                                <Checkbox 
                                                    checked={isCheckSelected}
                                                    onChange={() => handleChangeSelected(user.id)}
                                                />
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {user.name} - {user.id}
                                            </TableCell>
                                            <TableCell align="left">{user.address}</TableCell>
                                            <TableCell align="left">{user.age}</TableCell>
                                            <TableCell align="left">{user.telephone}</TableCell>
                                            <TableCell align="left">{user.email}</TableCell>

                                            <TableCell align="left" className="">
                                                {handleConvertNumberToString(
                                                    user.departId,
                                                    listDepart
                                                ).map((item:string, index:number) => (
                                                    <span key={index} className="inline-block ml-1 px-2 py-1 bg-[#faebd7] rounded-[4px] text-[#d2691e] mb-1 text-center">{item}</span>
                                                ))}
                                            </TableCell>
                                            {stateAccount.role === "admin" && (
                                                <TableCell align="left">
                                                    <Stack direction="row" spacing={2}>
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<DeleteIcon />}
                                                            onClick={() => handleDeleteUser(user.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            endIcon={<EditIcon />}
                                                            onClick={() => handleEditUser(user.id)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </Stack>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )})}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Pagination
                        className="flex justify-center my-6"
                        page={page}
                        count={Math.ceil(stateInfor.length / pageSize)}
                        onChange={(e: React.ChangeEvent<unknown>, currPage: number) =>
                            handlePagination(e, currPage)
                        }
                    />
                    {/* custom hook pagination
                        <Pagination 
                            onPageChange={(page:any) => setCurrentPage(page)}
                            totalCount={stateInfor.length}
                            siblingCount={1}
                            currentPage={currentPage}
                            pageSize={PageSize}
                        ></Pagination> */}
                </div>
            )
            }
        </Fragment>
    )
}

export default MainTable