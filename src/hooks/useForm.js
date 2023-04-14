import {useEffect, useState} from "react";

export const useForm = (form, model, dir=false) => {
    const [isValid, setValid] = useState(dir)
    const [validObj, setValidObj] = useState({})
    const [refresh, setRefresh] = useState(true)

    const length = Object.values(form).find(el => Array.isArray(el))?.length || 0

    useEffect(()=>{
        // Создание базового обьекта
        setValidObj( Object.assign({},  ...Object.keys(form).map(el =>{
            if(Array.isArray(form[el])){
                return {[el] : form[el].map(field => {
                        const newFields = Object.assign({}, ...Object.keys(field).map(boolField => ({[boolField]: dir})))
                        return newFields
                    })}
            }
            return {[el]: dir}
        } )))
    },[length,refresh])


    const resetValidation = () => {
        setRefresh(!refresh)
    }
    const onChange = (e, groupName, ind) => {
        if(groupName){
            if(e.target.value){
                validObj[groupName][ind] = {...validObj[groupName][ind], [e.target.name] : dir }
                setValidObj({...validObj})
            }
            else{
                validObj[groupName][ind] = {...validObj[groupName][ind], [e.target.name] : !dir }
                setValidObj({...validObj})
            }
        }
        else{
           if(Object.keys(model).includes(e.target.name)){
                if(e.target.value){
                    setValidObj({...validObj, [e.target.name]: dir })
                }
                else {setValidObj({...validObj, [e.target.name]: !dir })}
            }
        }
    }

    const checkForm = (sendForm=()=>{}) => {
        // Заполнение обьекта согласно схемы
        Object.assign(validObj, ...Object.keys(model).map(el => {
            if (Array.isArray(form[el])) {
                return {
                    [el]: form[el].map((arrEl, i) => {
                        const newFields = Object.assign(validObj[el][i], ...Object.keys(model[el][0]).map(subField => {
                            return !!form[el][i][subField] ? {[subField]: dir} : {[subField]: !dir}
                        }))
                        return newFields
                    })
                }
            } else {
                return !!form[el] ? {[el]: dir} : {[el]: !dir}
            }
            return {[el]: dir}
        }))


        //Общая проверка по схеме
        let newVal = isValid
        dir ?
        newVal = Object.values(validObj).every(el => {
            if(Array.isArray(el)){
                return el.every(subElem => {
                    return  Object.values(subElem).every(bool =>{
                        return bool
                    } )
                })
            }
            return el
        })
            :
        newVal = !Object.values(validObj).some(el => {
            if(Array.isArray(el)){
                return el.some(subElem => {
                    return  Object.values(subElem).some(bool =>{
                        return bool
                    } )
                })
            }
            return el
        })
        if(newVal){
            sendForm()
        }
        setValidObj({...validObj})
        setValid(newVal)

    }

    return {isValid, validObj, checkForm, onChange, resetValidation}

}