/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  deleteAUserAPI,
  //   getAUserAPI,
  getUsersAPI,
  updateAUserAPI,
} from "../service/mockapi";
import { GoPencil } from "react-icons/go";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaSortAlphaDown, FaSortAlphaUp, FaSortNumericUp, FaSortNumericDown } from "react-icons/fa";
import { formatDate, formatDateTime, formatMoney } from "../util/format";
import ConfirmDelModal from "./confirm-del-modal";
import EditUserModal from "./edit-user-modal";
import Pagination from "./pagination";
import Spinner from "./spinner";

const TableUser = () => {
  const styleTh = "flex items-center gap-3";


  const [users, setUsers] = useState<any>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [alert, setAlert] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [asc, setAsc] = useState(true);

  const [isDelModalOpen, setIsDelModalOpen] = useState(false);
  const [selectedDelUserId, setSelectedDelUserId] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userStatus, setUserStatus] = useState<string>("All");
  const [theme, setTheme] = useState<string>("light");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const themeStyle = theme === "dark" ? { backgroundColor: "#2c2c2c", color: "white" } : { backgroundColor: "white", color: "#2c2c2c" };
  const themeButtonStyle = theme === "dark" ? { backgroundColor: "white", color: "#2c2c2c" } : { backgroundColor: "#2c2c2c", color: "white" };

  const sortString = (asc: boolean, type: string) => {
    setAsc(!asc);
    const sorted = asc
      ? [...users].sort((a: any, b: any) => a[type].localeCompare(b[type]))
      : [...users].sort((a: any, b: any) => b[type].localeCompare(a[type]));
    setUsers(sorted);
  };
  const sortNumber = (asc: boolean, type: string) => {
    setAsc(!asc);
    const sorted = [...users].sort((a: any, b: any) => {
      return asc ? a[type] - b[type] : b[type] - a[type];
    });
    setUsers(sorted);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsersAPI();
      // console.log(response, "response");
      setTotalUsers(response.length);
      response ? setUsers(response) : setAlert("System Error!");
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpdateAUser = async (id: string, user?: any) => {
    setIsLoading(true);
    try {
      await updateAUserAPI(id, user);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchDelAUser = async (id: string | null) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await deleteAUserAPI(id);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDelUserId) return;
    await fetchDelAUser(selectedDelUserId);
    setSelectedDelUserId(null);
    await fetchUsers();
    console.log("Deleted!");
  };
  const handleSaveUser = async (updatedUser: any) => {
    await fetchUpdateAUser(updatedUser.id, updatedUser);
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  ///Filtering by status
  const handleChangeStatus = (status: string) => {
    setUserStatus(status);
  };

  const filterUsers = users.filter((user: any) => {
    if (userStatus === "All") {
      return true;
    } else if (userStatus === "Active") {
      return user.active === true;
    } else {
      return user.active === false;
    }
  });


  const statusButton = (status: boolean) => {
    const text = status ? "Active" : "Inactive";
    return (
      <button
        className={`px-4 py-2 rounded-full border font-semibold text-base`}
        style={
          themeButtonStyle
        }
      >
        {text}
      </button>
    );
  };

  const sortTh = (name: string, type: string, string: boolean) => {
    return (
      <th
        style={themeStyle}
      >
        <div className={`${styleTh} ${type === "registerAt" ? "justify-center" : ""}`}>
          {name}
          {
            string ? (
              <button className="cursor-pointer" onClick={() => sortString(asc, type)}>
                {asc ? (
                  <FaSortAlphaUp size={14} />
                ) : (
                  <FaSortAlphaDown size={14} />
                )}
              </button>
            ) : (
              <button className="cursor-pointer" onClick={() => sortNumber(asc, type)}>
                {asc ? (
                  <FaSortAlphaUp size={14} />
                ) : (
                  <FaSortAlphaDown size={14} />
                )}
              </button>
            )
          }

        </div>
      </th>
    );
  };

  //Pagination
  const totalPages = Math.ceil(filterUsers.length / itemsPerPage);
  const currentUsers = filterUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {isLoading === false ? (
        <div className="w-full max-w-4xl rounded-lg shadow-lg p-5"
          style={themeStyle}
        >
          <div className={`w-full h-full flex flex-col gap-4`}>
            <div className="w-full h-full flex justify-between items-center px-4">
              <div className="flex items-center gap-2">
                <h2>Theme: </h2>
                <button
                  type="button"
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none border`}
                  style={themeButtonStyle}
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform 
                      ${theme === "dark" ? "translate-x-6" : "translate-x-1"}
                    `}
                    style={themeStyle}
                  />
                </button>
              </div>

              <select
                className="border border-solid border-gray-500 rounded-md px-1 py-1 w-max h-max"
                onClick={(e) =>
                  handleChangeStatus((e.target as HTMLSelectElement).value)
                }
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <table className="w-full table-auto border-separate border-spacing-y-4 text-start ">
              <thead
                className={`bg-[#fefefe] ${theme === "dark"
                  ? "bg-[#2c2c2c] text-[#fefefe]"
                  : "bg-[#fefefe] text-[#2c2c2c]"
                  }`}
              >
                <tr>
                  {sortTh("Name", "name", true)}
                  {sortTh("Balance ($)", "balance", false)}
                  {sortTh("Email", "email", true)}
                  {sortTh("Date", "registerAt", false)}
                  {/* <th
                    className={`text-center ${theme === "dark"
                      ? "bg-[#2c2c2c] text-[#fefefe]"
                      : "bg-[#fefefe] text-[#2c2c2c]"
                      }`}
                  >
                    Registration
                  </th> */}
                  <th
                    className={`text-center ${theme === "dark"
                      ? "bg-[#2c2c2c] text-[#fefefe]"
                      : "bg-[#fefefe] text-[#2c2c2c]"
                      }`}
                  >
                    STATUS
                  </th>
                  <th
                    className={`text-center ${theme === "dark"
                      ? "bg-[#2c2c2c] text-[#fefefe]"
                      : "bg-[#fefefe] text-[#2c2c2c]"
                      }`}
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody
                className={`bg-[#f7f9fa] ${theme === "dark" ? "text-[#fefefe] bg-[#2c2c2c]" : ""
                  } `}
              >
                {currentUsers?.map((user: any) => {
                  return (
                    <tr key={user.id}>
                      <td
                        className={`border-b last:border-none border-gray-300 px-3 py-2 ${theme === "dark"
                          ? "bg-[#2c2c2c] text-[#fefefe] "
                          : "bg-[#fefefe] text-[#2c2c2c]"
                          }`}
                      >
                        {user.name}
                      </td>
                      <td
                        className={`border-b last:border-none border-gray-300 px-3 py-2 }`}
                        style={themeStyle}
                      >
                        {formatMoney(user.balance)}
                      </td>
                      <td
                        className={`hover:underline border-b last:border-none border-gray-300 px-3 py-2 }`}
                        style={themeStyle}
                      >
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </td>
                      <td
                        className={`relative group cursor-pointer text-center border-b last:border-none border-gray-300 px-3 py-2  }`}
                        style={themeStyle}
                      >
                        {formatDate(user.registerAt)}
                        <span
                          className={`absolute bottom-full  
                                                bg-gray-800 text-white text-sm rounded 
                                                opacity-0 group-hover:opacity-100 transition-opacity 
                                                whitespace-nowrap z-10  border-b last:border-none border-gray-300 px-3 py-2 ${theme === "dark"
                              ? "bg-[#2c2c2c] text-[#fefefe]"
                              : ""
                            }`}
                        >
                          {formatDateTime(user.registerAt)}
                        </span>
                      </td>
                      <td
                        className={`text-center justify-center border-b last:border-none border-gray-300 px-3 py-2  }`}
                        style={themeStyle}
                      >
                        {statusButton(user.active)}
                      </td>
                      <td
                        className={`h-full flex gap-5 items-center justify-center p-5  border-gray-300  $`}
                        style={themeStyle}
                      >
                        <button
                          className="rounded-md"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <GoPencil />
                        </button>

                        <button
                          className="rounded-md"
                          onClick={() => {
                            setSelectedDelUserId(user.id);
                            setIsDelModalOpen(true);
                          }}
                        >
                          <RiDeleteBin7Line />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <ConfirmDelModal
                  isOpen={isDelModalOpen}
                  onClose={() => {
                    setIsDelModalOpen(false);
                    setSelectedDelUserId(null);
                  }}
                  onConfirm={handleDelete}
                />
                <EditUserModal
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  onSave={handleSaveUser}
                  user={selectedUser}
                />
              </tbody>
            </table>
            <Pagination
              totalItems={totalUsers}
              totalPages={totalPages}
              currentPage={currentPage}
              setPage={setCurrentPage}
              itemsPerPage={currentUsers?.length}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        </div>
      ) : (
        <Spinner isLoading={isLoading} />
      )}
    </>
  );
};

export default TableUser;
