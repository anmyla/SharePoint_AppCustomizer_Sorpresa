import * as React from "react";
import styles from "../../AppCustomizer.module.scss";

interface ICustomButtonProps {
    onClick: () => void;
    label: string;
}

const CustomButton: React.FC<ICustomButtonProps> = ({ onClick, label }) => {
    return <button onClick={onClick} className={styles.customButton}>{label}</button>;
};

export default CustomButton;
