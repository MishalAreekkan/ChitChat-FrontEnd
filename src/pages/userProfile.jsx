import React from 'react';
import { useSelector } from 'react-redux';
import facebookImg from '../assets/images/facebook.png';
import twitterImg from '../assets/images/twitter.png';
import instagramImg from '../assets/images/instagram.png'
import { useChat, useProfile } from '../api/userside';

function UserProfile() {
    const baseUrl = "http://127.0.0.1:8000/"
    const user = useSelector(state => state.auth.user);
    const chatMutation = useChat();
    const {data:profile}=useProfile()
    console.log(profile,'pppppppppppppppppppppp');
    
    const [showModal, setShowModal] = React.useState(false);
    const [userInput, setUserInput] = React.useState('');
    const [response, setResponse] = React.useState('');
    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const result = await chatMutation.mutateAsync(userInput);
            setResponse(result.response);
            setUserInput('');
        } catch (error) {
            setResponse("Sorry, there was an error. Please try again.");
        }
    };


    return (
        <div className='w-full h-full overflow-auto p-1'>
            <div className="w-full rounded-lg shadow-md border-2 border-gray mb-5">

                <div className="w-full p-2 flex justify-normal relative">
                    <img
                        className="w-20 h-20 rounded-full z-10"
                        src={user?.picture?.startsWith('http') ? user.picture : `${baseUrl}${user.picture}`}

                        alt="Profile"
                    />
                    <div className="absolute inset-x-0 bottom-10 min-h-0.5 bg-gray-400" />
                </div>

                <div className="w-full text-center mt-2">
                    <h2 className="text-lg font-semibold text-black">{user?.username}</h2>
                    <div className="mt-1">
                        <p className="text-md">Followers {profile?.following_count}</p>
                        <p className="text-md">Following {profile?.followers_count}</p>
                    </div>
                </div>

                <div className="w-full border-t border-gray-300 text-center">
                    <h3 className="text-black font-semibold text-sm">Social Profile</h3>
                    <ul className="mt-2 space-y-2">
                        <li>
                            <a href="#" className="flex items-center space-x-2 text-gray-600 text-sm hover:text-gray-800">
                                <img src={instagramImg} alt="Instagram" className="w-5 h-5 rounded-lg" />
                                <span>Instagram</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center space-x-2 text-gray-600 text-sm hover:text-gray-800">
                                <img src={twitterImg} alt="Twitter" className="w-5 h-5 rounded-lg" />
                                <span>Twitter</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center space-x-2 text-gray-600 text-sm hover:text-gray-800">
                                <img src={facebookImg} alt="Facebook" className="w-5 h-5 rounded-lg" />
                                <span>Facebook</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <div className="border-2 border-gray-300 rounded-lg p-4 shadow-md border-r-2">
                    <h2 className="text-lg font-bold flex items-center justify-center">
                        Meet your companion High-Five!
                    </h2>
                    <p className="text-sm flex items-center justify-center mb-4">
                        Your personal chat companion in ChitChat. Need help, advice, or just want to chat?
                        High-Five is here to keep the conversation going and make your experience smoother and more fun!
                    </p>

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-green-100 w-full font-semibold py-2 px-4 rounded-lg hover:bg-green-200"
                        >
                            Ask High-Five!
                        </button>

                        {showModal ? (
                            <>
                                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                                <h3 className="text-3xl font-semibold">Ask High-Five</h3>
                                                <button
                                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                    onClick={() => setShowModal(false)}
                                                    aria-label="Close Modal"
                                                >
                                                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                                                </button>
                                            </div>

                                            <div className="relative p-6 flex-auto">
                                                <input
                                                    className="my-4 text-blueGray-500 text-lg leading-relaxed border rounded-lg p-2 w-full"
                                                    placeholder="Type your message..."
                                                    value={userInput}
                                                    onChange={handleInputChange}
                                                    aria-label="User input"
                                                />
                                            </div>

                                            <div className="p-6 flex-auto max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                                                {response ? (
                                                    <p className="text-gray-700">{response}</p>
                                                ) : (
                                                    <p className="text-gray-500">High-Five will respond here...</p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                                <button
                                                    className="bg-black text-white font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button"
                                                    onClick={handleSubmit}
                                                >
                                                    Send
                                                </button>
                                                <button
                                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                            </>
                        ) : null}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default UserProfile;
