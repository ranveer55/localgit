import React, { useState } from 'react';
const optionSaperator =' ^&^ ';
const AnswerOptions = ({ data, inputClass, callbacks }) => {
    data = data ? data.split(optionSaperator) : []
    const [op, setop] = useState(data)
    const [newInputVisible, setNewInputVisible] = useState(false)
    const [newInput, setNewInput] = useState('')
    const remove = (index) => {
        const datum = op.filter((item, i) => i !== index)
        setop(datum)
        callbacks(datum.join(optionSaperator))
    }
    const showaddNew = (index) => {
        setop([...op, ''])
        setNewInputVisible(!newInputVisible)
        setNewInput('')
    }
    const add = () => {
        if (!op.includes(newInput)) {
            const o = [...op, newInput];
            setop(o)

            callbacks(o.join(optionSaperator))
        }
        setNewInputVisible(false)
        setNewInput('')

    }
    const redStyle = {
        padding: '3px 5px',
        height: '40px',
        margin: '0 5px',
        color: 'white',
        cursor:'pointer'
    }
    const addStyle = {
        padding: '3px 5px',
        backgroundColor: 'green',
        margin: '0 5px',
        color: 'white'
    }
    const plsStyle = {
        padding: '3px 5px',
        backgroundColor: 'green',
        margin: '0 5px',
        color: 'white',
        background: '#0E584D 0% 0% no-repeat padding-box',
        border: '1px solid #707070'

    }
    const onChange = (e, i) => {
        let datum = op.map((ans,index)=>{
            if(index===i){
                // return e.target.value.replaceAll(',','')
                return e.target.value
            } else {
                return ans;
            }
        });
        setop([...datum])
        callbacks([...datum].join(optionSaperator))
    }
   
    return (
        <div>
            <b>Add Answer Options</b>
            <button onClick={showaddNew} style={plsStyle}> +</button>


            {op.map((item, i) => <div className="row" key={i}>
                <div className="col-md-3" style={{ textAlign: 'right', paddingTop: 10 }}>Option {i + 1}</div>
                <div className="col-md-7">
                    <input type="text" style={inputClass} value={item}
                        onChange={e => onChange(e, i)} />
                </div>
                <div className="col-md-2" style={{ textAlign: 'left' }}>
                    <img src="/images/delete.png" onClick={e => remove(i)} style={redStyle} alt="delete" />
                </div>
            </div>
            )}
        </div>
    )
}

export default AnswerOptions;
