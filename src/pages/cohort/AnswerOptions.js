import React, {useState } from 'react';

const AnswerOptions =({data,inputClass,callbacks}) =>{
    data =data ? data.split(',') :[]
    const [op, setop] =useState(data)
    const [newInputVisible, setNewInputVisible] =useState(false)
    const [newInput, setNewInput] =useState('')
    const remove =(index) =>{
        const datum =op.filter((item,i)=>i!==index)
        setop(datum)
        callbacks(datum.toString())
    }
    const showaddNew =(index) =>{
       setNewInputVisible(!newInputVisible)
       setNewInput('')
    }
    const add =() =>{
        if(!op.includes(newInput)){
            const o=[...op, newInput];
            setop(o)
           
            callbacks(o.toString())
        }
        setNewInputVisible(false)
        setNewInput('')
       
    }
    const redStyle={padding: '3px 5px',
        backgroundColor: 'red',
        margin: '0 5px',
        color: 'white'
    }
    const addStyle={padding: '3px 5px',
        backgroundColor: 'green',
        margin: '0 5px',
        color: 'white'
    }
    const plsStyle ={padding: '3px 5px',
        backgroundColor: 'green',
        margin: '0 5px',
        color: 'white'
        
    }
    return (
        <>
        <button onClick={showaddNew} style={plsStyle}> +</button>
        {newInputVisible && <>
        <input type="text"style={inputClass} value={newInput} placeholder="Add new Option" 
        onChange={e=>setNewInput(e.target.value.replaceAll(',',''))} />
        <button onClick={add}  style={addStyle}>Add</button>
        </>}
        <ol style={{listStyle:'number'}}>
        {op.map((item,i)=><li key={`${item}${i}`}>
        {item} <button onClick={e=>remove(i)}  style={redStyle}>X</button>
        </li>
        
        )}
        </ol>
        </>
    )
}

export default AnswerOptions;
