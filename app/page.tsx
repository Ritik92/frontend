"use client";
import React, { useEffect, useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    wsRef.current = socket;

    socket.onopen = () => socket.send(JSON.stringify({ type: 'initialize' }));

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'userList' && data.users) {
        setUsers(data.users);
      } else if (data.type === 'ping' && data.senderId) {
        toast(`User-${data.senderId} has pinged you!`);
      } else if (data.type === 'userId' && data.userId) {
        setUserId(data.userId);
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Sign in
        </button>
      </div>
    )
  }

  const sendPing = (target) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && target !== userId) {
      wsRef.current.send(JSON.stringify({ type: 'ping', target, content: 'Ping!', senderId: userId }));
      toast(`You pinged ${target === 'all' ? 'all users' : `User-${target}`}!`);
    }
  };

  return (
    <div className="container">
      <h1>Real-Time Ping Notification System</h1>
      <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">
        Sign out
      </button>
      <p>Your User ID: {userId}</p>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user} className="user-box">
            <span>{`User-${user}`}</span>
            <button onClick={() => sendPing(user)} className="ping-button">Ping</button>
          </div>
        ))}
      </div>
      <button onClick={() => sendPing('all')} className="ping-all-button">Send notification to all</button>
      <ToastContainer />
    </div>
  );
}