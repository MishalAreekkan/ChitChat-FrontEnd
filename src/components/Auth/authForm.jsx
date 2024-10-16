import React, { useState } from 'react';
import { useRegister } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import registerImg from '../../assets/images/register.jpg';
import googleImg from '../../assets/images/google.png';
import facebookImg from '../../assets/images/facebook.png';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../../slice/authSlice';
// import { FacebookLogin } from 'react-facebook-login';
import { IoMdPhonePortrait } from "react-icons/io";

function AuthForm() {
  const [formdata, setFormdata] = useState({ email: "", password: "", password2: "" });
  const { mutate: register, isLoading, isError } = useRegister();
  const [visible, setVisible] = useState(false);
  //   const [user, setUser] = useState(() =>
  //     localStorage.getItem('authToken') ? jwtDecode(localStorage.getItem('authToken')) : null
  // );
  const nav = useNavigate();
  const dispatch = useDispatch()
  const handleLogin = async (credentialResponse) => {
    const { credential } = credentialResponse;
    const response = await fetch('http://localhost:8000/api/auth/google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: credential }),
    });

    const data = await response.json();
    console.log(data, response.status, 'rrrrrrrr')
    if (response.status == 200) {
      console.log(data, 'dddddddddddddddd');
      dispatch(setAuthToken(data))
      // localStorage.setItem('accessToken', data.access);
      // localStorage.setItem('refreshToken', data.refresh);
      console.log(data, 'ddddddd-rrrrrrrrrrrrddddddddd');
      // setUser(jwtDecode(data.access));
      nav('/userhome');
    } else {
      console.log('Login failed');
    }
  };
  // const handleFacebookLogin = (response) => {
  //   console.log(response);
  // };



  const submit = (e) => {
    e.preventDefault();
    register(formdata, {
      onSuccess: () => {
        nav('/login');
      },
      onError: (error) => {
        console.error("Registration failed:", error);
        alert("Registration failed: " + error.response.data); // Display error message
      }
    });
  };
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-between">
        <header className="w-full flex items-center justify-between px-6 py-1.5 border-b-2 ">
          <div className="flex items-center space-x-2 p-3">
            <div className="font-bold text-lg">CHIT CHAT</div>
          </div>
          <button className="text-black border px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white transition-colors" onClick={() => nav('/login')}>Sign in</button>
        </header>

        <main className="flex flex-col items-center flex-grow mt-6">
          <h1 className="text-4xl font-sans font-semibold text-green-600 mb-2 ">Your people are chatting here</h1>
          <div className="flex flex-col md:flex-row m-0">
            <div className="mb-8 p-8 w-3/5 flex justify-center items-center">
              <img src={registerImg} className="w-10/12" alt="Chatting people illustration" />
            </div>

            <div className="flex flex-col items-center space-y-4 w-full md:w-5/12 h-1/2 mt-10  ">
              <p className="text-lg px-5 mt-1">
                Create an account or sign in. By continuing, you agree to our
                <a href="#" className="underline">Terms of Use</a> and acknowledge our
                <a href="#" className="underline">Privacy Policy</a>.
                We're serving up trusted insights so you'll have the goods you need to succeed.
              </p>

              {!visible ? (
                <>


                  <button className="flex items-center space-x-2 bg-white border  border-gray-300 rounded-md px-4 py-1 h-[40px] w-[40%]">
                    <img src={facebookImg} alt="Facebook" className="w-5 h-5" />
                    <span>Continue with Facebook</span>
                  </button>

                  {/* <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-1 h-[40px] w-[60%]">
                    <GoogleLogin
                      onSuccess={handleLogin}
                      onError={() => console.log('Login Failed')}
                      style={{ width: '100%', height: '100%' }} // This applies custom dimensions directly
                    />
                  </button> */}

                  <div>

                    {/* <FacebookLogin 
      buttonStyle={{padding:"6px"}}  
      appId="946726573608245"  
      autoLoad={false}  
      fields="name,email,picture"  
      callback={handleFacebookLogin}/> */}

                    <div className="h-[100%] w-[100%]">
                      <GoogleLogin
                        onSuccess={handleLogin}
                        onError={() => console.log('Login Failed')}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>


                  </div>

                  <button className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-1  h-[40px] w-[40%]">
                  <IoMdPhonePortrait />
                    <span>Continue with Phone</span>
                  </button>

                  <div className="flex text-center items-center h-1">or</div>

                  <button
                    onClick={() => setVisible(true)}
                    className="bg-black text-white rounded-md px-4 py-1 w-64"
                  >
                    Continue with Email
                  </button>
                </>
              ) : (
                <>
                <form onSubmit={submit} className="flex flex-col space-y-2">
                  <input
                    type="email"
                    value={formdata.email}
                    onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
                    placeholder="Email"
                    required
                    className="border border-gray-300 rounded-md px-4 py-1 w-64"
                    />
                  <input
                    type="password"
                    value={formdata.password}
                    onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
                    placeholder="Password"
                    required
                    className="border border-gray-300 rounded-md px-4 py-1 w-64"
                    />
                  <input
                    type="password"
                    value={formdata.password2}
                    onChange={(e) => setFormdata({ ...formdata, password2: e.target.value })}
                    placeholder="Confirm password"
                    required
                    className="border border-gray-300 rounded-md px-4 py-1 w-64"
                    />
                  <button type="submit" className="bg-black text-white rounded-md px-4 py-1 w-64">
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </form>
                <button onClick={() => setVisible(false)}>back</button>
                    </>
              )}
            </div>
          </div>

          <div className="text-center w-full mt-0 text-gray-600 border-t-2 p-4">
            <p className="text-4xl  font-semibold">Stay in the Moment with ChitChat</p>
            <p className="mt-2 text-md">Where real conversations spark and connections thrive. Share, explore, and chat away with a community that’s always buzzing. Join the chatter and let your voice be heard!</p>
          </div>
        </main>
      </div>
    </>
  );
}

export default AuthForm;
