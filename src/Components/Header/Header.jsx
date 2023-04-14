import React, { useState} from 'react'
import './Header.scss'
import {Button, MenuItem} from "@mui/material";
import Menu from '@mui/material/Menu';
import {getAuth, signOut} from "firebase/auth"
import Burger from "../UI/Burger/Burger";
import {app} from "../../firebase";
import {useNavigate} from "react-router-dom";

const auth = getAuth(app)
const Header = (props) => {

    const {changeRole, name='', isAdmin, id} = props

    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false)


    const exit = () => {
        signOut(auth)
    }

    const handleClose = () => {
        setOpen(false)
        setAnchorEl(null)
    }

    const handleOpen = (e) => {
        setAnchorEl(e.target
        )
        setOpen(true)
    }

    const toPage = (pageName) => {
        navigate(pageName)
        setOpen(false)
    }



    return (
        <header className='header shadow'>
            {id &&
                <>
                    <Burger
                        onClick = {handleOpen}
                        isOpen = {open}
                    />
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {isAdmin ?
                        <MenuItem
                            onClick={()=>{changeRole(false); handleClose() }}
                        >
                            Зробити себе користувачем</MenuItem>
                        :
                        <MenuItem
                            onClick={()=>{changeRole(true); handleClose() }}
                        >
                            Зробити себе адміном</MenuItem>}
                        <MenuItem
                            onClick={()=>toPage('/')}>
                            Користувачі</MenuItem>
                        <MenuItem
                            onClick={()=>toPage('trips')}>
                            Маршрути</MenuItem>
                    </Menu>
                    <h2>{name}</h2>

                    <Button
                        onClick = {exit}
                    >Вихід</Button>
                </>

            }

        </header>
    );
};

export default Header;