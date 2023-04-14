import React, {useState} from 'react';
import LoginForm from "./Forms/LoginForm";
import RegistrationForm from "./Forms/RegistrationForm";
import {Snackbar} from "@mui/material";
import {Alert} from "@mui/lab";

const Form = () => {

    const [isLogin, setLogin] = useState(true)

    const [open, setOpen] = useState(false)
    const [text, setText] = useState('')

    const show = (bool, text) => {
        console.log(bool, text)
        setText(text)
        setOpen(bool)
    }

    return (
        <>
            {
                isLogin ?
                <LoginForm changeForm={setLogin} showSnack={show}/>
                :
                <RegistrationForm changeForm={setLogin} showSnack={show}/>
            }
            <Snackbar open={open} autoHideDuration={6000} onClose={()=>setOpen(false)}>
                <Alert onClose={()=>setOpen(false)} severity="info" sx={{ width: '100%' }}>
                    {text}
                </Alert>
            </Snackbar>
        </>

    );
};

export default Form;