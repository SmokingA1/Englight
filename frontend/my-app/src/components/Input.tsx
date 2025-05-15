import React from "react";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

const Input: React.FC<InputProps> = ({label, ...props} ) => {


    return (
        // <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <>
            {label && <label htmlFor={props.id}>{label}</label>}
            <input {...props}/>
        </>
        // </div>
    )
}

export default Input