import React, { useState } from 'react'
import { NavLink } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./mix.css"
import { registerUser } from './Redux/features/LoginRedux';
import { useDispatch } from 'react-redux';

const Register = () => {

    const [passShow, setPassShow] = useState(false);
    const [cpassShow, setCPassShow] = useState(false);
    const dispatch = useDispatch()

    const [inpval, setInpval] = useState({
        fname: "",
        email: "",
        password: "",
        cpassword: ""
    });


    const setVal = (e) => {
        const { name, value } = e.target;

        setInpval(() => {
            return {
                ...inpval,
                [name]: value
            }
        })
    };

    const addUserdata = async (e) => {
        e.preventDefault();
    
        const { fname, email, password, cpassword } = inpval;
    
        // Validate input fields
        if (fname === '') {
          toast.warning('Name is required!', {
            position: 'top-center',
          });
          return;
        }
        if (email === '') {
          toast.error('Email is required!', {
            position: 'top-center',
          });
          return;
        }
        if (!email.includes('@')) {
          toast.warning('Invalid email format!', {
            position: 'top-center',
          });
          return;
        }
        if (password === '') {
          toast.error('Password is required!', {
            position: 'top-center',
          });
          return;
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters!', {
            position: 'top-center',
          });
          return;
        }
        if (cpassword === '') {
          toast.error('Confirm password is required!', {
            position: 'top-center',
          });
          return;
        }
        if (cpassword.length < 6) {
          toast.error('Confirm password must be at least 6 characters!', {
            position: 'top-center',
          });
          return;
        }
        if (password !== cpassword) {
          toast.error('Password and Confirm Password do not match!', {
            position: 'top-center',
          });
          return;
        }
    
        // Dispatch registerUser action
        try {
          await dispatch(registerUser({ fname, email, password, cpassword }));
           
          setInpval({
            fname: '',
            email: '',
            password: '',
            cpassword: '',
          });
        } catch (error) {
          console.error('Error registering user:', error);
        }
      };
    
    return (
        <>
            <section>
                <div className="form_data">
                    <div className="form_heading">
                        <h1>Sign Up</h1>
                        <p style={{ textAlign: "center" }}>We are glad that you will be using Project Cloud to manage <br />
                            your tasks! We hope that you will get like it.</p>
                    </div>

                    <form>
                        <div className="form_input">
                            <label htmlFor="fname">Name</label>
                            <input type="text" onChange={setVal} value={inpval.fname} name="fname" id="fname" placeholder='Enter Your Name' />
                        </div>
                        <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input type="email" onChange={setVal} value={inpval.email} name="email" id="email" placeholder='Enter Your Email Address' />
                        </div>
                        <div className="form_input">
                            <label htmlFor="password">Password</label>
                            <div className="two">
                                <input type={!passShow ? "password" : "text"} value={inpval.password} onChange={setVal} name="password" id="password" placeholder='Enter Your password' />
                                <div className="showpass" onClick={() => setPassShow(!passShow)}>
                                    {!passShow ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>

                        <div className="form_input">
                            <label htmlFor="password">Confirm Password</label>
                            <div className="two">
                                <input type={!cpassShow ? "password" : "text"} value={inpval.cpassword} onChange={setVal} name="cpassword" id="cpassword" placeholder='Confirm password' />
                                <div className="showpass" onClick={() => setCPassShow(!cpassShow)}>
                                    {!cpassShow ? "Show" : "Hide"}
                                </div>
                            </div>
                        </div>

                        <button className='btn' onClick={addUserdata}>Sign Up</button>
                        <p>Already have an account? <NavLink to="/">Log In</NavLink></p>
                    </form>
                    <ToastContainer />
                </div>
            </section>
        </>
    )
}

export default Register