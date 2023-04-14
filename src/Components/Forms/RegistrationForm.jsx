import React, {useState} from 'react'
import './Forms.css'
import {Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField} from "@mui/material";
import {
    getAuth,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import {app, db} from "../../firebase";
import { setDoc, doc } from "firebase/firestore"
import {useForm} from "../../hooks/useForm";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const initState = {
    name: '',
    lastName: '',
    tel: '',
    email: '',
    password: ''
}

const fields = [
    {
        name:'name',
        label:"Iм'я",
    },
    {
        name:'lastName',
        label:"Прізвище",
    },
    {
        name:'tel',
        label:"Телефон",
    },
    {
        name:'email',
        label:"Email",
    },
]


const auth = getAuth(app);
const RegistrationForm = (props) => {

    const {changeForm, showSnack} = props

    const [form, setForm] = useState(initState)
    const [showPassword, setShow] = useState(false)

    const {validObj,checkForm, onChange} = useForm(form, initState)


    const register = async () => {
        try {
            await createUserWithEmailAndPassword(auth, form.email, form.password)
            if (auth.currentUser) {
                await setDoc(doc(db, "users", auth.currentUser.uid), {
                    name: form.name,
                    lastName: form.lastName,
                    tel: form.tel,
                    isAdmin: false,
                    email: form.email,
                });
            }
            setForm(initState)

        } catch (err) {
            if(err.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).')
                showSnack(true, 'Пароль повинен бути не коротше 6 символів')
                else{showSnack(true, 'не можна додати такого користувача')}
        }
    }


    const fillField = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
        onChange(e)
    }


    return (
        <div className='form-box shadow'>
            <h2>Зареєструватися</h2>
            {
                fields.map(field =>
                    <TextField
                        fullWidth
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        value={form[field.name]}
                        error={validObj[field.name]}
                        variant="standard"
                        onChange={fillField}
                    />
                )
            }

            <FormControl fullWidth variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Пароль</InputLabel>
                <Input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    label="Пароль"
                    value={form.password}
                    error={validObj.password}
                    variant="standard"
                    onChange={fillField}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={()=> setShow(!showPassword)}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

            <Button
                variant='outlined'
                sx={{alignSelf: 'center'}}
                onClick={()=>checkForm(register)}
            >Зареєструватися</Button>

            <p className='transition'
               onClick={()=>changeForm(true)}
            >В мене вже є акаунт</p>
        </div>
    );
};

export default RegistrationForm;