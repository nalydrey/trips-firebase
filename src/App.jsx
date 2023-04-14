import './App.css';
import {useEffect, useState} from "react";
import { doc, getDoc, updateDoc} from "firebase/firestore"
import Header from "./Components/Header/Header";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {app, db} from "./firebase";
import {Route, Routes, useNavigate} from "react-router-dom";
import Form from "./Components/Form";
import Users from "./Components/Pages/Users";
import Trips from "./Components/Pages/Trips";
import {Backdrop, CircularProgress} from "@mui/material";
import {sendToTelegram} from "./telegram";



const auth = getAuth(app);
function App() {

    const navigate = useNavigate()

    const [user, setUser] = useState({})
    const [isLoading, setLoading] = useState(false)
    const [isAdmin, setAdmin] = useState(false)

    useEffect(()=> {
        setLoading(true)
        sendToTelegram('Ваш сайт відвідали')
    onAuthStateChanged(auth, (user) => {
        if(user){
            getDoc(doc(db, 'users', auth.currentUser.uid))
                .then(user=>{
                    setUser({...user.data(), id: auth.currentUser.uid})
                    navigate('/')
                    setAdmin(user.data().isAdmin)
                    setLoading(false)
                })
        }
        else{
            setUser(user)
            navigate('register')
            setLoading(false)
        }
    })
    }, [])

    const changeRole =async (bool) => {
        setAdmin(bool)
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {isAdmin: bool} )
    }

  return (
    <div className="App">
        <Header
            id={user?.id}
            name={user?.name}
            isAdmin={isAdmin}
            changeRole={changeRole}
        />
        <main className='container'>
            <Routes>
                <Route path='/' element = {<Users isAdmin={isAdmin}/>}/>
                <Route path='/register'  element={<Form isLoading={isLoading}/>} />
                <Route path='/trips'  element={<Trips isAdmin={isAdmin}/>} />
            </Routes>
        </main>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>

    </div>

  );
}

export default App;
