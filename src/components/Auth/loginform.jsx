import React, { useState } from 'react';
import { useLogin } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import registerImg from '../../assets/images/register.jpg';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../../slice/authSlice';


function Loginform() {
    const [formdata, setFormdata] = useState({ email: "", password: "" });
    const { mutate: loginUser, isLoading } = useLogin();
    const nav = useNavigate();

    const submit = (e) => {
        e.preventDefault();
        loginUser(formdata, {
            onSuccess: () => {
                nav('/userhome');
            }
        });
    };
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
            console.log(data, 'ddddddd-rrrrrrrrrrrrddddddddd');
            nav('/userhome');
        } else {
            console.log('Login failed');
        }
    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-between">
            <header className="w-full flex items-center justify-between px-6 py-1.5 border-b-2">
                <div className="flex items-center space-x-2 p-3">
                    <div className="font-bold text-lg">CHIT CHAT</div>
                </div>
                <button className="text-black border px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white transition-colors" onClick={() => nav('/')}>Sign up</button>
            </header>

            <main className="flex flex-col items-center flex-grow">
                <h1 className="text-4xl font-sans font-semibold text-green-600 mb-2">Welcome Back to ChitChat</h1>

                <div className="flex flex-col md:flex-row">
                    <div className="mb-8 p-8 w-3/5 flex justify-center items-center">
                        <img src={registerImg} className="w-10/12" alt="Chatting people illustration" />
                    </div>

                    <div className="flex flex-col items-center space-y-4 w-full md:w-5/12 h-1/2 ">
                        <p className="text-lg px-5 mt-8">
                            Log in to connect with your friends and stay updated. By logging in, you agree to our <a href="#" className="underline">Terms of Use</a> and acknowledge our <a href="#" className="underline">Privacy Policy</a>.
                        </p>
                        <div className="mt-12 " >
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
                                <button type="submit" className="bg-black text-white rounded-md px-4 py-1 w-64">
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </button>
                                <br />
                            </form>
                            <button className="bg-black text-white rounded-md px-4 py-1 w-64" onClick={() => nav("/")}>
                                Forget to Sign in?
                            </button>

                            <div className="h-[100%] w-[100%]">
                                <br />
                                <GoogleLogin
                                    onSuccess={handleLogin}
                                    onError={() => console.log('Login Failed')}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center w-full mt-0 text-gray-600 border-t-2 p-4">
                <p className="text-4xl font-semibold">Stay in the Moment with ChitChat</p>
                    <p className="mt-2 text-lg">Where real conversations spark and connections thrive. Join the chatter and let your voice be heard!</p>
                </div>
            </main>
        </div>
    );
}

export default Loginform;
