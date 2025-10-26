import React from 'react';

function Button({
    type = "button",
    children,
    onClick,
    Classname ="",
    ...props
}){

    return(
        <>
            <button
                type = {type}
                className={`rounded-xl ${Classname}`}
                onClick={onClick}
                {...props}
            >
                {children}
            </button>
        </>
    )
}

export default Button;