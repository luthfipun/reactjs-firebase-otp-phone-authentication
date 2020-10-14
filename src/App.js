import { Button, Card, Col, Divider, Form, Input, message, Row } from 'antd';
import 'antd/dist/antd.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import React, { Component } from 'react';

 // Replace with real firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPxvdqU5ud7JBthcbWLJMRs_XL1j8EmCY",
    authDomain: "fir-otp-demo-e414f.firebaseapp.com",
    databaseURL: "https://fir-otp-demo-e414f.firebaseio.com",
    projectId: "fir-otp-demo-e414f",
    storageBucket: "fir-otp-demo-e414f.appspot.com",
    messagingSenderId: "389597311804",
    appId: "1:389597311804:web:ce701eb314ec31daf9e439"
}

firebase.initializeApp(firebaseConfig)

class App extends Component {

  state = {
    phone: '',
    isAction: false,
    code: '',
    verificationId: '',
    isLoading: false
  }

  componentDidMount() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container",
    {
       size:"invisible"
    });
  }

  onsubmit = () => {
    const { phone } = this.state

    if (!phone) {
      message.warn("Phone number is empty")
      return
    }

    this.setState({isLoading: true})

    const phoneNumber = this.state.phone;
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(confirmResult => {
        this.setState({verificationId: confirmResult.verificationId, isAction: true})
        window.confirmationResult = confirmResult;
        message.success("Code sent")
        this.setState({isLoading: false})
      })
      .catch(error => {
        message.error(error)
        this.setState({isLoading: false})
      });
  }

  onconfirm = () => {
    const {code} = this.state

    if (!code) {
      message.warn("Code is empty")
      return
    }

    this.setState({isLoading: true})

    window.confirmationResult.confirm(code).then(function(result){
      console.log(result)
      message.success("Sign in successfully")
      this.setState({isLoading: false})
    })
    .catch((error) => {
      console.log(error)
      if (error.code !== undefined) {
          message.error("Code is wrong")
      }
      this.setState({isLoading: false})
    })
  }

  render() {

    const {isAction, phone, code, isLoading} = this.state

    const viewSignIn = (
      <div>
        <h1>Sign In</h1>
        <Divider />
        <Form layout="vertical">
          <Form.Item label="Phone Number">
            <Input 
              id="recaptcha-container" 
              onChange={(e) => this.setState({phone: e.target.value})}
              value={phone}
              placeholder="Phone number with country code" />
          </Form.Item>
          <Form.Item>
            <Button
              loading={isLoading}
              onClick={() => this.onsubmit()} 
              type="primary">Sign In</Button>
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
            <Input 
              id="recaptcha-container" 
              onChange={(e) => this.setState({code: e.target.value})} 
              value={code}
              placeholder="6-digit verification code" />
          </Form.Item>
          <Form.Item>
            <Button 
              loading={isLoading}
              type="primary" 
              onClick={() => this.onconfirm()}>Confirmation</Button>
          </Form.Item>
        </Form>
      </div>
    )

    return (
        <>
          <Row align="middle" justify="center">
            <Col xs={24} md={5}>
              <Card>
                {
                  isAction ? viewVerification : viewSignIn
                }
              </Card>
            </Col>
          </Row>
        </>
    )
  }
}

export default App;
