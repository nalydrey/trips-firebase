import React, {useEffect, useState} from 'react';
import TripCard from "../UI/Cards/TripCard";
import {Backdrop, Box, CircularProgress, Fab, Modal, TextField, Tooltip} from "@mui/material";
import {Add} from '@mui/icons-material'
import ModalWindow from "../UI/ModalWindow/ModalWindow";
import { collection, getDocs } from "firebase/firestore";
import {db} from "../../firebase";


const Trips = (props) => {

    const {isAdmin} = props

    const [trips, setTrips] = useState([])
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(null)

    useEffect(()=>{
        getAllTrips()
    },[])

    const getAllTrips = async () => {
        const querySnapshot = await getDocs(collection(db, "trips"));
        const allTrips = []
        querySnapshot.forEach((doc) => {
            allTrips.push({id: doc.id, ...doc.data()});
        });
        setTrips(allTrips)
    }

    const deleteCard = (tripId) => {
        setTrips(trips.filter(trip=> trip.id !== tripId))
    }

    const editCard = (data) => {
        setOpen(true)
        setData(data)
    }

    const cardEdited = (data) => {
        setTrips(trips.map(trip => trip.id === data.id ? data : trip))
    }

    const addNewTrip = () => {
        setOpen(true)
        setData(null)
    }


    return (
        <div className='users-container container'>
            {isAdmin &&
            <Tooltip title="Додати новий маршрут">
                <Fab
                    color="primary"
                    sx={{position: 'fixed', right: 10, bottom: 10}}
                    onClick={addNewTrip}
                >
                    <Add/>
                </Fab>
            </Tooltip>}

            {
                trips.map(trip =>
                    <TripCard
                        key={trip.id}
                        isAdmin={isAdmin}
                        trip={trip}
                        deleteCard={deleteCard}
                        editCard={editCard}
                    />)
            }


            <ModalWindow
                data={data}
                isOpen = {open}
                onClose = {setOpen}
                addNewTrip = {(trip)=>setTrips([...trips, trip])}
                editCard = {cardEdited}
            />


        </div>
    );
};

export default Trips;