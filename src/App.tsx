import { useEffect, useState } from "react";
import "./styles/index.css";
import { test, user } from "./app/stores/sliceMemberInfor/index";
import { useSelector, useDispatch, TypedUseSelectorHook } from "react-redux";
import { updateStateUser, deleteUser } from "./app/stores/sliceMemberInfor/index";
import FormAddUser from "./app/modules/common/component/FormAddUser";
import FormEditUser from "./app/modules/common/component/FormEditUser";
import { getListMember, deleteMember, editMember } from "./app/api/member";
import { department, getDepartment } from "./app/api/department";
import MainTable from './app/modules/MainTable'
import Header from './app/modules/Header'
import NavBar from "./app/modules/NavBar";
import { AppDispatch, RootState } from "./app/stores";
import Overlay from "./app/modules/overlay/overlay.template";

function App() {
  const [listDepart, setListDepart] = useState<department[]>();
  const [loading, setLoading] = useState<boolean>(true);

  const [edit, setEdit] = useState<boolean>(false);
  const [add, setAdd] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [editUser, setEditUser] = useState<user>();
  const [showOverlay, setShowOverlay] = useState<boolean>(false)

  const dispatch = useDispatch();
  const stateInfor: user[] = useSelector((state: any) => state.infor.users);
  const stateLogin = useSelector((state: any) => state.login.account)
  const stateAccount = checkStateAccount() || {}
  

  //Start useAppDispatch , useAppSelector

  // const useAppDispatch = () => useDispatch<AppDispatch>()
  // const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

  // const stateNew = useAppSelector((state) => state.infor.users)
  // const dispatch1 = useAppDispatch()

  // console.log("useAppSelector stateNew: ", stateNew)
  // console.log("useAppSelector stateNew: ", dispatch1(test()))

  // End useAppDispatch , useAppSelector

  function checkStateAccount() {
    if (stateLogin.length > 0) return stateLogin
    return JSON.parse(localStorage.getItem("Account") as string)
  }

  useEffect(() => {
    setLoading(true);
    const handleAPI = async () => {
      const listMember = await getListMember();
      const listDepartment = await getDepartment();
      if (listMember.data.length > 0) {
        setLoading(false);
        dispatch(updateStateUser(listMember.data));
      }

      if (listDepartment.data.length > 0) {
        setListDepart(listDepartment.data);
      }
    };
    handleAPI();
  }, []);

  const handleAddUser = () => {
    if (edit) setEdit(!edit);
    setAdd(!add)
    setShowOverlay(!showOverlay)
  };

  const handleDeleteUser = async (id: number) => {
    setShowDelete(!showDelete)
    if (!showOverlay) {
      setShowOverlay(!showOverlay)
      localStorage.setItem("idDelete", id as any)
    } else {
      const idUser = await deleteMember(id);
      if (idUser !== null || idUser !== undefined || idUser !== "")
        dispatch(deleteUser(id));
    }
  };

  const handleEditUser = async (id: number) => {
    const dataMember = await editMember(id);
    if (dataMember) setEditUser(dataMember.data);
    setEdit(!edit);
    setShowOverlay(!showOverlay)
  };

  const handleSubmitDelete = () => {
    if (localStorage.getItem("idDelete") !== null) handleDeleteUser(parseInt(localStorage.getItem("idDelete") as any))
    setShowOverlay(!showOverlay)
    if (!showOverlay) localStorage.removeItem("idDelete")
    setShowDelete(false)
  }

  const handleCloseOverlay = () => {
    setShowOverlay(false)
    if (add) setAdd(!add)
    if (showDelete) setShowDelete(!showDelete)
    if (edit) setEdit(!edit)
  }

  return (
    <div className="App">
      <NavBar stateAccount={stateAccount}></NavBar>

      <div className="Container ml-[300px] px-6 mt-3">

        <Header stateAccount={stateAccount}></Header>

        {listDepart && <MainTable 
          loading = {loading}
          stateAccount={stateAccount}
          stateInfor ={stateInfor}
          listDepart={listDepart as any}
          handleAddUser = {handleAddUser}
          handleDeleteUser = {handleDeleteUser}
          handleEditUser = {handleEditUser}
        ></MainTable>}
      </div>


      <Overlay 
        showOverlay={showOverlay} 
        setShowOverlay={setShowOverlay} 
        handleDeleteUser={handleDeleteUser} 
        listDepart={listDepart as department[]}
        add={add}
        setAdd={setAdd}
        showDelete={showDelete}
        setShowDelete={setShowDelete}
        edit={edit}
        setEdit={setEdit}
      >
        { add && 
          <div className="relative w-[600px] m-auto h-[800px] rounded-lg shadow-md bg-white mt-[70px] overflow-y-auto">
            <div
              className="absolute top-0 right-0 text-[24px] mr-[10px] mt-[4px] cursor-pointer"
              onClick={() => handleCloseOverlay()}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
            <FormAddUser
              listDepart={listDepart}
              showOverlay={showOverlay} 
              setShowOverlay={setShowOverlay} 
              setAdd={setAdd}
            ></FormAddUser> 
          </div>
        }
        {showDelete && 
          <div className="relative w-[450px] m-auto h-[300px] rounded-lg shadow-md bg-white mt-[300px]">
            <div
              className="absolute top-0 right-0 text-[24px] mr-[10px] mt-[4px] cursor-pointer"
              onClick={() => handleCloseOverlay()}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="pt-20 flex justify-center">
              <span className="text-black text-[20px] font-semibold">
                Bạn có muốn xóa hay không?
              </span>
            </div>
            <div className="mt-[50px] flex justify-center space-x-4">
              <button
                className="w-[160px] h-[40px] rounded-md shadow-md border hover:bg-slate-200 "
                onClick={() => handleCloseOverlay()}
              >
                Hủy bỏ
              </button>
              <button
                className="w-[160px] h-[40px] bg-blue-500 rounded-md shadow-md border hover:bg-[#6090de]"
                onClick={() => handleSubmitDelete()}
              >
                Đồng ý
              </button>
            </div>
          </div>
        }

        { edit && 
          <div className="relative w-[600px] m-auto h-[800px] rounded-lg shadow-md bg-white mt-[70px] overflow-y-auto">
            <div
              className="absolute top-0 right-0 text-[24px] mr-[10px] mt-[4px] cursor-pointer"
              onClick={() => handleCloseOverlay()}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
            {editUser && <FormEditUser
              edit={edit}
              editUser={editUser}
              setEdit={setEdit}
              listDepart={listDepart}
              showOverlay={showOverlay} 
              setShowOverlay={setShowOverlay}
            ></FormEditUser>}
          </div>
        }
      </Overlay> 
    </div>
  );
}

export default App;
