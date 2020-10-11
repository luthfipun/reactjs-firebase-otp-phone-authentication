import React, { Component } from 'react';
import * as firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import "firebase/auth";
import 'antd/dist/antd.css';
import { Button, Card, Row, Col, Form, InputNumber, Input, Divider, message } from 'antd';


const firebaseConfig = {
    apiKey: "AIzaSyAPxvdqU5ud7JBthcbWLJMRs_XL1j8EmCY",
    authDomain: "fir-otp-demo-e414f.firebaseapp.com",
    databaseURL: "https://fir-otp-demo-e414f.firebaseio.com",
    projectId: "fir-otp-demo-e414f",
    storageBucket: "fir-otp-demo-e414f.appspot.com",
    messagingSenderId: "389597311804",
    appId: "1:389597311804:web:ce701eb314ec31daf9e439"
};

firebase.initializeApp(firebaseConfig);

// const uiConfig = {
//   signInSuccessUrl: "http://localhost:3000/",
//   signInOptions: [firebase.auth.PhoneAuthProvider.PROVIDER_ID],
//   tosUrl: "http://localhost:3000/"
// };

// const ui = new firebaseui.auth.AuthUI(firebase.auth());
// ui.start("#firebase-container", uiConfig)

class App extends Component {

  state = {
    phone: '',
    isAction: false,
    code: 0,
    verificationId: ''
  }

  componentDidMount() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container",
    {
       size:"invisible"
        // other options
    });
  }

  onsubmit = () => {
    const { phone } = this.state

    if (!phone) {
      message.warn("Phone number is empty")
      return
    }

    const phoneNumber = this.state.phone;
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(confirmResult => {
        this.setState({verificationId: confirmResult.verificationId, isAction: true})
        window.confirmationResult = confirmResult;
        message.success("Code sent")
      })
      .catch(error => {
        message.error(error)
      });
  }

  onconfirm = () => {
    const {verificationId, phone, code} = this.state

    if (!code) {
      message.warn("Code is empty")
      return
    }

    window.confirmationResult.confirm(code).then(function(result){
      console.log(result)
      message.success("Sign in successfully")
    })
    .catch((error) => {
      console.log(error)
      message.error("Code is wrong")
    })
  }

  render() {

    const {isAction, phone, code} = this.state

    const viewSignIn = (
      <div>
        <h1>Sign In</h1>
        <Divider />
        <Form layout="vertical">
          <Form.Item label="Phone Number">
            <Input id="recaptcha-container" onChange={(e) => this.setState({phone: e.target.value})} value={phone} />
          </Form.Item>
          <Form.Item>
            <Button onClick={() => this.onsubmit()} type="primary">Sign In</Button>
          </Form.Item>
        </Form>
      </div>
    )
    
    const viewVerification = (
      <div>
        <h1>Verification</h1>
        <Divider />
        <Form layout="vertical">
          <Form.Item label="Verification Code">
            <Input id="recaptcha-container" onChange={(e) => this.setState({code: e.target.value})} value={code} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => this.onconfirm()}>Confirmation</Button>
          </Form.Item>
        </Form>
      </div>
    )

    return (
      <Row align="middle" justify="center">
          <Col xs={24} md={5}>
            <Card>
              {
                isAction ? viewVerification : viewSignIn
              }
            </Card>
          </Col>
        </Row>
    )
  }
}

export default App;
