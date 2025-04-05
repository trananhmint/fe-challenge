import React, { useEffect, useState } from 'react'
import { deleteAUserAPI, getAUserAPI, getUsersAPI, updateAUserAPI } from '../service/mockapi';
import { GoPencil } from "react-icons/go";
import { RiDeleteBin7Line } from "react-icons/ri";
import { IoFilter } from "react-icons/io5";
import { FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";
import { formatDate, formatDateTime, formatMoney } from '../util/format';
import ConfirmDelModal from './confirm-del-modal';
import EditUserModal from './edit-user-modal';


const TableUser = () => {

    const styleTh = 'flex justify-between items-center'

    const [users, setUsers] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<any>(null);
    const [asc, setAsc] = useState(true);

    const [isDelModalOpen, setIsDelModalOpen] = useState(false);
    const [selectedDelUserId, setSelectedDelUserId] = useState<string | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const sortString = (asc: boolean, type: string) => {
        setAsc(!asc);
        const sorted = asc ? [...users].sort((a: any, b: any) => a[type].localeCompare(b[type])) : [...users].sort((a: any, b: any) => b[type].localeCompare(a[type]));
        setUsers(sorted);
    }
    const sortNumber = (asc: boolean, type: string) => {
        setAsc(!asc);
        const sorted = [...users].sort((a: any, b: any) => {
            return asc ? a[type] - b[type] : b[type] - a[type];
        });
        setUsers(sorted);
    };




    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsersAPI();
            console.log(typeof response[0].id, 'response');
            response ? setUsers(response) : setAlert('System Error!');
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }
    const fetchGetAUser = async (id: string) => {
        setLoading(true);
        try {
            const response = await getAUserAPI(id);
            return response;
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }
    const fetchUpdateAUser = async (id: string, user?: any) => {
        setLoading(true);
        try {
            await updateAUserAPI(id, user);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }

    }
    const fetchDelAUser = async (id: string | null) => {
        if (!id) return;
        setLoading(true);
        try {
            await deleteAUserAPI(id);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        if (!selectedDelUserId) return;
        await fetchDelAUser(selectedDelUserId);
        setSelectedDelUserId(null)
        await fetchUsers();
        console.log("Deleted!");
    };
    const handleSaveUser = async (updatedUser: any) => {
        await fetchUpdateAUser(updatedUser.id, updatedUser);
        fetchUsers();
    };

    useEffect(() => {
        fetchUsers();
    }, [])

    const statusButton = (status: boolean) => {
        const text = status ? "Active" : "Inactive";
        return <button className='px-2 py-1 rounded-full border text-[#2c2c2c]'>{text}</button>
    }

    const sortTh = (name: string, type: string, string: boolean) => {
        if (string) {
            return (
                <th >
                    <div className={`${styleTh}`} >
                        {name}
                        <button onClick={() => sortString(asc, type)}>
                            {asc ? <FaSortAlphaUp size={14} /> : <FaSortAlphaDown size={14} />}
                        </button>
                    </div>
                </th>
            )
        } else {
            return (
                <th >
                    <div className={`${styleTh}`} >
                        {name}
                        <button onClick={() => sortNumber(asc, type)}>
                            {asc ? <FaSortAlphaUp size={14} /> : <FaSortAlphaDown size={14} />}
                        </button>
                    </div>
                </th>
            )
        }

    }


    return (
        <table className="w-full table-auto  border-spacing-2 text-start">
            <thead className='bg-[#fefefe] '>
                <tr >
                    {/* <th className={``}>
                        <div className={`${styleTh}`} >
                            Name
                            <button onClick={() => sort(asc, 'name')}>
                                {asc ? <FaSortAlphaUp size={14} /> : <FaSortAlphaDown size={14} />}
                            </button>
                        </div>
                    </th> */}
                    {sortTh('Name', 'name', true)}
                    {sortTh('Balance', 'balance', false)}
                    {sortTh('Email', 'email', true)}
                    <th className='text-center'>Registration</th>
                    <th className='text-center'>STATUS</th>
                    <th className='text-center'>ACTION</th>
                </tr>
            </thead>
            <tbody className='bg-[#f7f9fa]'>
                {users?.map((user: any) => {
                    return (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{formatMoney(user.balance)}</td>
                            <td className='hover:underline'><a href={`mailto:${user.email}`}>{user.email}</a></td>
                            <td className="relative group cursor-pointer text-center">
                                {formatDate(user.registerAt)}
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                                    bg-gray-800 text-white text-sm px-2 py-1 rounded 
                                    opacity-0 group-hover:opacity-100 transition-opacity 
                                    whitespace-nowrap z-10"
                                >
                                    {formatDateTime(user.registerAt)}
                                </span>
                            </td>
                            <td className='text-center justify-center'>{statusButton(user.active)}</td>
                            <td className='flex gap-2 items-center justify-center'>
                                <button
                                    className='rounded-md'
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setIsEditModalOpen(true);
                                    }}
                                >
                                    <GoPencil />
                                </button>

                                <button className='rounded-md'
                                    onClick={() => {
                                        setSelectedDelUserId(user.id);
                                        setIsDelModalOpen(true);
                                    }}
                                >
                                    <RiDeleteBin7Line />
                                </button>
                            </td>

                        </tr>
                    )

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
    )
}

export default TableUser