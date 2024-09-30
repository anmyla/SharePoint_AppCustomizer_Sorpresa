import * as React from "react";
import CustomButton from "./CustomButton";

interface ICustomAlertProps {
    winner: string;
    onSave: () => void;
    onConfirm: () => void;
}

const CustomAlert: React.FC<ICustomAlertProps> = ({ winner, onSave, onConfirm }) => {
    return (
        <div className="custom-alert">
            <h2>Winner: {winner}</h2>
            <CustomButton onClick={onConfirm} label="Save Winner" />
            <button onClick={onSave}>Close</button>
        </div>
    );
};

export default CustomAlert;
