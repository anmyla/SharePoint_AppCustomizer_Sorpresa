import * as React from "react";

interface ICustomButtonProps {
    onClick: () => void;
    label: string;
}

const CustomButton: React.FC<ICustomButtonProps> = ({ onClick, label }) => {
    return <button onClick={onClick}>{label}</button>;
};

export default CustomButton;
