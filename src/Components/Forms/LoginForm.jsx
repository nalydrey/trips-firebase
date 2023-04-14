import React, {useState} from 'react';
import {
    Button,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField
} from "@mui/material";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider  } from "firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {useForm} from "../../hooks/useForm";
import {Visibility, VisibilityOff} from "@mui/icons-material";


const initialState = {
    email: '',
    password: ''
}

const provider = new GoogleAuthProvider();

const auth = getAuth();
const LoginForm = (props) => {

    const {changeForm, showSnack} = props


    const [form, setForm] = useState(initialState)
    const [showPassword, setShow] = useState(false)

    const {validObj,checkForm, onChange} = useForm(form, initialState)
    const fillField = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
        onChange(e)
    }

    const login =async () => {
        try{
            await signInWithEmailAndPassword(auth, form.email, form.password)
            if(auth.currentUser){
                setForm(initialState)
            }
        }
        catch(err){
            showSnack(true, 'неправильний email чи пароль')
        }
    }


    const loginWithGoogle = async () => {
        try{
            const result = await signInWithPopup(auth, provider)
            GoogleAuthProvider.credentialFromResult(result)
            if(auth.currentUser){
                const name = auth.currentUser.displayName.split(' ')
                    await setDoc(doc(db, "users", auth.currentUser.uid), {
                        name: name[0],
                        lastName: name[1],
                        tel: '',
                        isAdmin: false,
                        email: auth.currentUser.email,
                    });
            }
        }
        catch(error){
            console.log(error.message)
        }
    }

    return (
        <div className='form-box shadow'>
            <h2>Війти</h2>
        <TextField
            fullWidth
            name='email'
            label="Email"
            value={form.email}
            error={validObj.email}
            variant="standard"
            onChange={fillField}
        />


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
            onClick={()=>checkForm(login)}
        >Увійти</Button>
        <Button
            variant='outlined'
            sx={{alignSelf: 'center'}}
            onClick={loginWithGoogle}
        >Увійти за допомогою GOOGLE</Button>
        <p className='transition'
           onClick={()=>changeForm(false)}
        >В мене немає акаунту</p>
        </div>
    );
};

export default LoginForm;