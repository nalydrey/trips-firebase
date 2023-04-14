import React, {useState} from 'react'
import './Burger.scss'

const Burger = (props) => {

    const {isOpen=false, onClick=()=>{}} = props

    return (
        <div
            className={`burger ${isOpen ? 'burger--open': 'burger--close'}`}
            onClick={onClick}
        >
            <span className='burger__top'/>
        </div>
    );
};

export default Burger;