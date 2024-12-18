import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { removeAuthToken } from "../slice/authSlice";
import { CiSearch } from "react-icons/ci";
import { FaBell, FaUserAlt } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";

function UserNavbar() {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const notificationSocketRef = useRef(null);

    // WebSocket for notifications
    useEffect(() => {
        const connectNotificationSocket = () => {
            if (user?.username) {
                notificationSocketRef.current = new WebSocket(
                    `ws://localhost:8001/ws/notifications/${user.username}/`
                );

                notificationSocketRef.current.onopen = () =>
                    console.log("WebSocket connected");

                notificationSocketRef.current.onmessage = (event) => {
                    const notificationData = JSON.parse(event.data);
                    setNotifications((prev) => [notificationData, ...prev]);
                    setUnreadCount((prev) => prev + 1);

                    // Show browser notification
                    if (
                        "Notification" in window &&
                        Notification.permission === "granted"
                    ) {
                        new Notification(notificationData.sender_name, {
                            body: notificationData.message,
                        });
                    }
                };

                notificationSocketRef.current.onerror = (error) =>
                    console.error("WebSocket error:", error);

                notificationSocketRef.current.onclose = () => {
                    console.log("WebSocket disconnected");
                    setTimeout(connectNotificationSocket, 5000); // Reconnect
                };
            }
        };

        if ("Notification" in window) {
            Notification.requestPermission();
        }

        connectNotificationSocket();

        return () => {
            notificationSocketRef.current?.close();
        };
    }, [user?.username]);

    // Fetch initial notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/chat/notifications/");
                setNotifications(response.data);
                setUnreadCount(response.data.filter((n) => !n.is_read).length);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        if (user) fetchNotifications();
    }, [user]);

    const markNotificationAsRead = async (notificationId) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/chat/notifications/${notificationId}/read/`);
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === notificationId
                        ? { ...notif, is_read: true }
                        : notif
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const clearAllNotifications = async () => {
        try {
            await axios.post("http://127.0.0.1:8000/chat/notifications/clear/");
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error("Error clearing notifications:", error);
        }
    };

    const logout = () => {
        dispatch(removeAuthToken());
        nav("/login");
    };

    return (
        <header className="w-full flex items-center justify-between px-6 py-4 border-b bg-white text-black">
            <div className="font-bold text-lg">CHIT CHAT</div>
            <nav className="hidden md:flex space-x-6 text-lg font-medium">
                <a href="/userhome" className="hover:text-gray-400 transition-colors">
                    Home
                </a>
                <a href="/uservideo" className="hover:text-gray-400 transition-colors">
                    Reels
                </a>
                <a href="/groupchat" className="hover:text-gray-400 transition-colors">
                    Community
                </a>
                <a href="/userchat" className="hover:text-gray-400 transition-colors">
                    Messaging
                </a>
                <a href="#" className="hover:text-gray-400 transition-colors">
                    Jobs
                </a>
            </nav>
            <div className="flex items-center space-x-4">
                <CiSearch className="text-black hover:text-gray-400 transition-colors" />
                <IoNotificationsOutline
                    className="text-2xl cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                        {unreadCount}
                    </span>
                )}
                <FaUserAlt
                    className="text-black hover:text-gray-400 transition-colors"
                    onClick={() => nav("/useredit")}
                />
            </div>
            <button
                className="text-black px-4 py-2 rounded-md hover:bg-gray-700 hover:text-white text-lg transition-colors"
                onClick={logout}
            >
                Sign out
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg">
                    <div className="flex justify-between p-3 border-b">
                        <h3 className="font-semibold">Notifications</h3>
                        {notifications.length > 0 && (
                            <button
                                onClick={clearAllNotifications}
                                className="text-sm text-red-500"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-3 border-b ${
                                        !notif.is_read ? "bg-blue-50" : "bg-white"
                                    }`}
                                >
                                    <p className="text-sm font-medium">
                                        {notif.sender_name}
                                    </p>
                                    <p className="text-xs">{notif.message}</p>
                                    <button
                                        onClick={() => markNotificationAsRead(notif.id)}
                                        className="text-xs text-blue-500"
                                    >
                                        Mark as Read
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

export default UserNavbar;
