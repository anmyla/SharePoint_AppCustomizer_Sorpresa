import * as React from "react";
import styles from '../../AppCustomizer.module.scss';
import 'animate.css';

export interface IGiftElementProps {
    onClick: () => void;
}

export default class GiftElement extends React.Component<IGiftElementProps> {
    constructor(props: IGiftElementProps) {
        super(props);
    }

    public render(): JSX.Element {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const imgSrc = require('../../assets/img/egg1.png');

        return (
            <div className={styles.giftBox} id="giftBox">
                <img
                    src={imgSrc}
                    alt="Surprise!"
                    className="animate__animated animate__bounce animate__repeat-3"
                    onClick={this.props.onClick}
                />
            </div>
        );
    }

}
