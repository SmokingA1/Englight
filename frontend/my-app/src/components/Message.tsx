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
                boxShadow: "0 0 3px rgba(63, 63, 63, 0.5)",                
                padding: "10px 12px",
                borderRadius: "5px",
                marginTop: "10px",
                position: "fixed",
                left: "50%",
                top: "0px",
                transform: "translateX(-50%)",
            }}
        >
            {text}
        </div>
    );
};

export default Message;