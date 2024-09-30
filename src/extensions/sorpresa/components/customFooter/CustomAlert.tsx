import * as React from "react";
import CustomButton from "./CustomButton";
import styles from "../../AppCustomizer.module.scss";

interface ICustomAlertProps {
    winner: string;
    onConfirm: () => void;
}

const CustomAlert: React.FC<ICustomAlertProps> = ({ winner, onConfirm }) => {
    return (
        <div className={styles.customAlert}>
            <h2>Congratulations!</h2>
            <h3>{winner}</h3>
            <CustomButton onClick={onConfirm} label="Save and close" />
        </div>
    );
};

export default CustomAlert;
