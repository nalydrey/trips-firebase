import React, {useState} from 'react'
import './Cards.scss'
import {FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import { doc, setDoc, deleteDoc  } from "firebase/firestore";
import {db, app} from "../../../firebase";
import {getAuth} from 'firebase/auth'
import {useForm} from "../../../hooks/useForm";

const roles = [
    'водій',
    'пасажир',
    'диспетчер'
]

const init = {
    tel: '',
    age: ''
}

const auth = getAuth(app)

const UserCard = (props) => {

    const {isAdmin} = props
    const {id, name, lastName, tel, email, role, age} = props.user

    const [roleIm, setRole] = useState(role)
    const [field, setField] = useState({tel: tel || init.tel, age: age||init.age})

    const {validObj, checkForm, onChange, resetValidation} = useForm(field, init)
    const changeRole = (e) => {
        setRole(e.target.value)
        const userRef = doc(db, 'users', id);
        setDoc(userRef, { role: e.target.value }, { merge: true });
    }

    const changeData = (e) => {
        if(e.target.value){
        const userRef = doc(db, 'users', id);
        setDoc(userRef, { [e.target.name]: e.target.value }, { merge: true });
        }
    }

    const changeField = (e) => {
        setField({...field, [e.target.name]: e.target.value})
        onChange(e)
    }

    return (
        <div className='card__wrap'>
            <div className='card shadow'>
                <ul>
                    <li>
                        <p>Ім'я</p>
                        <p>{name}</p>
                    </li>
                    <li>
                        <p>Прізвище</p>
                        <p>{lastName}</p>
                    </li>
                    <li>
                        <p>Телефон</p>
                        {auth.currentUser?.uid ===id ?
                            <TextField
                                sx={{width: 190} }
                                label="Tel"
                                name={'tel'}
                                size={"small"}
                                variant='standard'
                                value={field.tel}
                                error={validObj.tel}
                                onBlur={changeData}
                                onChange={changeField}
                            />
                            :
                            <p>{tel ? tel : 'не введено'}</p>
                        }
                    </li>
                    <li>
                        <p>Вік</p>
                        {auth.currentUser?.uid ===id ?
                            <TextField
                                sx={{width: 140} }
                                label="Age"
                                name={'age'}
                                size={"small"}
                                type={"number"}
                                variant='standard'
                                value={field.age}
                                error={validObj.age}
                                onBlur={changeData}
                                onChange={changeField}
                            />
                            :
                            <p>{age ? age : 'не введено'}</p>
                        }
                    </li>
                    <li>
                        <p>Email</p>
                        <p>{email}</p>
                    </li>
                    <li>
                        <p>Роль</p>
                        {isAdmin ?
                            <FormControl sx={{width: 140} } size="small"
                            >
                                {/*<InputLabel>Виробник</InputLabel>*/}
                                <Select
                                    name="role"
                                    // error={validObj.manufacture}
                                    value={roleIm||''}
                                    onChange={changeRole}
                                >
                                    {roles.map((el) => <MenuItem key={el} value={el}>{el}</MenuItem>)}
                                </Select>
                            </FormControl>
                            :
                            <p>{roleIm ? roleIm : 'не обрано'}</p>
                        }
                    </li>
                </ul>
            </div>
        </div>

    );
};

export default UserCard;