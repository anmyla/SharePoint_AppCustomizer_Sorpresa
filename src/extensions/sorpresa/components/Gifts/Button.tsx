import * as React from "react";

interface AlertButtonProps {
    title: string;
    onSave: () => void;
}

export default class AlertButton extends React.Component<AlertButtonProps> {
    render(): JSX.Element {
        return (
            <button type="button" onClick={this.props.onSave}>
                {this.props.title}
            </button>
        );
    }
}
