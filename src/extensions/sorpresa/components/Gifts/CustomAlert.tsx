import * as React from 'react';
import AlertButton from './Button';

interface CustomAlertProps {
  userName: string;
  onSave: () => void;
}

interface CustomAlertState {
  message: string;
  buttonText: string;
}

export default class CustomAlert extends React.Component<CustomAlertProps, CustomAlertState> {
  constructor(props: CustomAlertProps) {
    super(props);


    this.state = {
      message: `Congratulations ${this.props.userName}, you just found one of those hidden gifts!`,
      buttonText: 'OK',
    };


    this.handleClick = this.handleClick.bind(this);
  }


  handleClick(): void {
    if (this.state.buttonText === 'OK') {
      this.setState({
        message: "We've recorded your details to the winners list!",
        buttonText: 'Close',
      });
    } else {

      this.props.onSave();
    }
  }


  public render(): JSX.Element {
    return (
      <div
        id="customAlert"
        style={{
          display: 'block',
          backgroundColor: '#f8f8f8',
          padding: '20px',
          border: '1px solid #ccc',
        }}
      >
        <p id="customAlertMessage">{this.state.message}</p>
        {/* Render AlertButton with dynamic button text */}
        <AlertButton title={this.state.buttonText} onSave={this.handleClick} />
      </div>
    );
  }
}
