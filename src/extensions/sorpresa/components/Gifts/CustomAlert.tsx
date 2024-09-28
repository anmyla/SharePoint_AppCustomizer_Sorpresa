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

    // Initialize the state
    this.state = {
      message: `Congratulations ${this.props.userName}, you just found one of those hidden gifts!`,
      buttonText: 'OK',
    };

    // Bind the handleClick method
    this.handleClick = this.handleClick.bind(this);
  }

  // Handle the button click event
  handleClick(): void {
    if (this.state.buttonText === 'OK') {
      // Update state when the button text is 'OK'
      this.setState({
        message: "We've recorded your details to the winners list!",
        buttonText: 'Close',
      });
    } else {
      // Call the onSave callback prop when button text is 'Close'
      this.props.onSave();
    }
  }

  // Render the JSX
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
        <AlertButton title={this.state.buttonText} onSave={this.handleClick} />
      </div>
    );
  }
}
