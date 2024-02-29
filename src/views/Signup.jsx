import React, { useState } from "react";

import { authentication } from "../firebase/firebase.config";
import { signInWithPhoneNumber } from "firebase/auth";
import { RecaptchaVerifier } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import Loader from "../components/Loader";

const defaultRegisterFormFields = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
};

const Signup = () => {
  const [registerFormFields, setRegisterFormFields] = useState(
    defaultRegisterFormFields
  );
  const [code, setCode] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [formErrors, setformErrors] = useState({});
  const [isCode, setIsCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const { name, email, password, confirmPassword, phoneNumber } =
    registerFormFields;

  const countryCode = "+91";

  const handleSubmit = (e) => {
    e.preventDefault();
    const validated = validate(registerFormFields);
    setformErrors(validated);

    if (Object.keys(validated)?.length === 0 && isCodeVerified) {
      setIsCode(false);
      setIsCodeVerified(false);
      window.recaptchaVerifier = null;
      const recaptchaElement = document.getElementById("recaptcha-container");
      recaptchaElement.innerHTML = "";

      setRegisterFormFields({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
      });
      navigate("/success");
    }
  };

  const validate = (values) => {
    const errors = {};
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const phoneregex = /^[0-9]*$/g;
    if (!values?.name) {
      errors.name = "First Name is required";
    }

    if (!values?.email) {
      errors.email = "Email is required";
    } else if (!emailregex.test(values.email)) {
      errors.email = "Email format should be 'abcd@domainname.com'";
    }

    if (!values?.password) {
      errors.password = " Password is required";
    }

    if (!values?.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Password and Confirm Password doesn't match";
    }

    if (!values?.phoneNumber) {
      errors.phoneNumber = "Mobile Number is required";
    } else if (!phoneregex.test(values.phoneNumber)) {
      errors.phoneNumber = "Only numbers are allowed";
    } else if (values?.phoneNumber.length < 10) {
      errors.phoneNumber = "Mobile Number should be 10 digits";
    } else if (values?.phoneNumber.length > 10) {
      errors.phoneNumber = "Mobile Number should be 10 digits";
    } else if (!isCodeVerified) {
      alert("Please verify your Phone number to proceed");
    }
    return errors;
  };

  const generateRecap = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      authentication,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {},
      }
    );
  };

  const handleSendCode = async () => {
    setIsCode(true);
    let phoneNum = countryCode + phoneNumber;
    generateRecap();
    let appVerifier = await window.recaptchaVerifier;
    await signInWithPhoneNumber(authentication, phoneNum, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setIsCode(true);
      })
      .catch((err) => {
        console.log(err);
        setIsCode(false);
      });
  };

  const handleVerifyCode = () => {
    setIsLoading(true);
    confirmationResult = window.confirmationResult;
    confirmationResult
      .confirm(code)
      .then((result) => {
        const user = result.user;
        setIsLoading(false);
        setIsCode(false);
        setIsCodeVerified(true);
        console.log("Otp verified");
      })
      .catch((error) => {
        setIsCodeVerified(false);
        setIsLoading(false);
        alert("Please enter correct otp");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterFormFields({ ...registerFormFields, [name]: value });
  };

  return (
    <div className="signup_main_wrapper">
      <h1>REGISTER</h1>
      <form className="signup_form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          placeholder="Name *"
          className={`input_field ${formErrors.name ? "input_error" : ""}`}
        />

        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Email *"
          className={`input_field ${formErrors.email ? "input_error" : ""}`}
        />
        <input
          type="text"
          name="password"
          value={password}
          onChange={handleChange}
          placeholder="Password *"
          className={`input_field ${formErrors.password ? "input_error" : ""}`}
        />
        <input
          type="text"
          name="confirmPassword"
          value={confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password *"
          className={`input_field ${
            formErrors.confirmPassword ? "input_error" : ""
          }`}
        />
        {isCode ? (
          <div className="input_div">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter Otp"
              className="input_field"
            />
            <button
              onClick={handleVerifyCode}
              type="button"
              className="send_btn"
            >
              {isLoading ? (
                <>
                  <Loader />
                  Verify Code
                </>
              ) : (
                "Verify Code"
              )}
            </button>
          </div>
        ) : (
          <div className="input_div">
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number *"
              className={`input_field ${
                formErrors.phoneNumber ? "input_error" : ""
              }`}
              disabled={isCodeVerified}
            />
            {!isCodeVerified ? (
              <button
                onClick={handleSendCode}
                type="button"
                className="send_btn"
              >
                Send Code
              </button>
            ) : (
              ""
            )}
          </div>
        )}
        <button type="submit" className="submit_btn">
          Submit
        </button>
      </form>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Signup;
