import React from 'react'
import './Cards.scss'
import {IconButton, TextField} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import { doc, deleteDoc } from "firebase/firestore";
import {db} from "../../../firebase";


const TripCard = (props) => {

    const {deleteCard=()=>{},
           editCard=()=>{},
           isAdmin = false
    } = props
    const {id, counter, number, from, destination, passQty } = props.trip

    const deleteTrip = async () => {
        await deleteDoc(doc(db, "trips", id))
        deleteCard(id)
    }

    const editTrip = () => {
        editCard(props.trip)
    }


    return (
        <div className='card__wrap'>
            <div className='card shadow'>
                <h4>Подорож № {counter}</h4>
                <ul>
                    <li>
                        <p>Номер авто</p>
                        <p>{number}</p>
                    </li>
                    <li>
                        <p>Відправка з</p>
                        <p>{from}</p>
                    </li>
                    <li>
                        <p>Місце призначення</p>
                        <p>{destination}</p>
                    </li>
                    <li>
                        <p>Кількість пасажирів</p>
                        <p>{passQty}</p>
                    </li>
                </ul>
                {isAdmin &&
                    <div className='card__actions'>
                        <IconButton
                            color='primary'
                            onClick={editTrip}
                        >
                            <Edit />
                        </IconButton>
                        <IconButton
                            color='secondary'
                            onClick={deleteTrip}
                        >
                            <Delete />
                        </IconButton>
                    </div>}
            </div>
        </div>

    );
};

export default TripCard;