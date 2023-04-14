import React, {useEffect, useState} from 'react';
import {db} from '../../firebase'
import { collection, getDocs } from "firebase/firestore";
import UserCard from "../UI/Cards/UserCard";


const Users = (props) => {

    const {isAdmin} = props
    const [users, setUsers] = useState([])

    useEffect(()=>{
        getUsers()
    },[])

    const getUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = []
        querySnapshot.forEach((doc) => users.push({id: doc.id, ...doc.data()}))
        setUsers(users)
    }



    return (
        <div className='users-container container'>
            {
                users.map(user =>
                    <UserCard
                        isAdmin = {isAdmin}
                        key={user.email}
                        user={user}
                    />
                )
            }
        </div>
    );
};

export default Users;