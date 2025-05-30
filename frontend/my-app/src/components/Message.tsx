import React from "react";

interface MessageProps {
    text: string;
    type?: "success" | "error" | "info";
}

const Message: React.FC<MessageProps> = ({text, type = 'info'}) => {
    const color = {
        success: "green",
        error: "red",
        info: "blue",
    }[type];

    return (
        <div
            style={{
                color,
                background: "white",
                boxShadow: "0 0 3px rgba(63, 63, 63, 0.5)",                
                padding: "10px 12px",
                borderRadius: "5px",
                margin: "10px 0 0 5px",
                position: "fixed",
                zIndex: "999",
                left: "0",
                top: "0px",
            }}
        >
            {text}
        </div>
    );
};

export default Message;