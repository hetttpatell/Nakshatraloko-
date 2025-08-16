import React from 'react';       

function Input({
    type, 
    label, 
    value , 
    onChange,
    className
}, ...props){

    return(
        <>
        <div className='mb-4'>
            <input
                type = {type}
                label = {label}
                value={value}
                onChange={onChange}
                className={`border p-2 rounded w-full ${className}`}
                {...props}
            >
                
            </input>
        </div>
        </>
    )
}
export default Input;