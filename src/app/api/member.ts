import axios from "axios";
import { handleConvertStringToNumber } from "../modules/common/helper/department.helper";
import { getDepartment } from "./department";
import { user } from '../stores/sliceMemberInfor/index'

import { FormLogin } from '../../app/modules/FormLogin'

export const getListAccount = async (values: FormLogin) => {
  const accounts = await axios.get(
    `http://localhost:3004/users?email=${values.email}`
  );
  return accounts;
};

export const getListMember = async () => {
  const members = await axios.get("http://localhost:3004/users");
  return members;
};

export const deleteMember = async (id: number) => {
  const idMember = await axios.delete(`http://localhost:3004/users/${id}`);
  return idMember;
};

export const editMember = async (id: number) => {
  const dataMember = await axios.get(`http://localhost:3004/users/${id}`);
  return dataMember;
};

export const addMember = async (values: user) => {
  const ListDataDepart = await getDepartment();
  const addMember = await axios.post("http://localhost:3004/users", {
    ...values,
    age: parseInt(values.age as string),
    departId: handleConvertStringToNumber(values.departId, ListDataDepart.data),
  });
  return addMember;
};

export const updateMember = async (values: user, id: number) => {
  const ListDataDepart = await getDepartment();
  const addMember = await axios.put(`http://localhost:3004/users/${id}`, {
    ...values,
    age: parseInt(values.age as string),
    departId: handleConvertStringToNumber(values.departId, ListDataDepart.data),
  });
  return addMember;
};


export const filterMembers = async (search: string) => {
  const filteredList = await axios.get(`http://localhost:3004/users?name_like=${search}`)
  return filteredList;
};

// http://localhost:3004/users?_sort=name&_order=desc:giam asc:tang
export const sortUsers = async (key: string, type: string) => {
  const listUsers = await axios.get(`http://localhost:3004/users?_sort=${key}&_order=${type}`)
  return listUsers;
};

export const getColumns = async () => {
  const listColumn = await axios.get(`http://localhost:3004/column`)
  return listColumn;
};
