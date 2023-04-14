import React, {useEffect, useState} from 'react';
import {Button, Modal, Stack, TextField} from "@mui/material";
import './ModalWindow.scss'
import { collection, addDoc,setDoc, doc, getDoc,updateDoc, increment } from "firebase/firestore";
import {db} from "../../../firebase";
import {LoadingButton} from "@mui/lab";
import {useForm} from "../../../hooks/useForm";


const fields = [
    {
        name: 'number',
        label: 'Номер авто',
        type: 'text'
    },
    {
        name: 'from',
        label: 'Відправлення з',
        type: 'text'
    },
    {
        name: 'destination',
        label: 'Місце призначення',
        type: 'text'
    },
    {
        name: 'passQty',
        label: 'Кількість пасажирів',
        type: 'number'
    },
]

const init = {
    number: '',
    from: '',
    destination: '',
    passQty: ''
}




const ModalWindow = (props) => {

    const {data=null, isOpen, onClose, addNewTrip=() => {}, editCard=()=>{} } = props
    const [form, setForm] = useState(data || init)
    const [isLoading, setLoading] = useState(false)
    const [isEdit, setEdit] = useState(false)

    const {validObj, checkForm, onChange, resetValidation} = useForm(form, init)
    const changeField = (e) => {
        setForm({...form, [e.target.name] : e.target.value})
        onChange(e)
    }

    useEffect(()=>{
        if(data){
            setForm({...data})
            setEdit(true)
        }
        else setEdit(false)
    },[data])

    const closeWindow = () => {
        onClose(false)
        setForm(init)
        resetValidation()
    }

    const sendTrip = async () => {
        try{
            setLoading(true)
            const countRef = doc(db, "counters", "tripCount");
            await updateDoc(countRef, {counter: increment(1)})
            const counter = (await getDoc(countRef)).data()
            const docRef = await addDoc(collection(db, "trips"), {...form, ...counter});
            const trip = doc(db, "trips", docRef.id);
            const docSnap = await getDoc(trip);
            addNewTrip({...docSnap.data(), id: docRef.id})
            closeWindow()
            setLoading(false)
        }
        catch (err){
            setLoading(false)
        }

    }

    const editTrip = async () => {
        try{
            setLoading(true)
            const id = form.id
            delete form.id
            await updateDoc(doc(db, "trips", id), form)
            editCard({id, ...form})
            closeWindow()
            setLoading(false)
        }
        catch (err){
            console.log(err)
            setLoading(false)
        }
    }



    return (
        <Modal
            open={isOpen}
            onClose={closeWindow}
        >
            <div className='modal shadow'>
                <h2>Створити новий маршрут</h2>
                {fields.map(field =>
                    <TextField
                        key={field.name}
                        fullWidth
                        label={field.label}
                        name={field.name}
                        size={"small"}
                        type={field.type}
                        error={validObj[field.name]}
                        value={form[field.name]}
                        onChange={changeField}
                    />
                )}
                {isLoading ?
                    <LoadingButton
                        loading
                        color='primary'
                    >
                        Submit
                    </LoadingButton>
                    :
                    isEdit ?
                    <Button
                        onClick={()=>checkForm(editTrip)}
                    >Редагувати маршрут</Button>
                        :
                    <Button
                        onClick={()=>checkForm(sendTrip)}
                    >Додати маршрут</Button>

                }



            </div>
        </Modal>
    );
};

export default ModalWindow;