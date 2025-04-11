import store from '@/features/strore';
import { io, Socket } from 'socket.io-client';

let socket: Socket | undefined;

export const connectSocket = (): Socket => {
	if (!socket) {
		socket = io('https://crm.solutionprovider.com.bd', {
			path: '/socket.io',
			// ,'http://192.168.0.103:5000'
			// 'http://192.168.68.117:5000',
			// 'https://crm.solutionprovider.com.bd'
			reconnectionDelay: 1000,
			reconnection: true,
			reconnectionAttempts: 10,
			transports: ['websocket'],
			agent: false,
			upgrade: false,
			rejectUnauthorized: false,
		});

		// Retrieve the current user ID from the global store
		const state = store.getState();
		const userId = state.auth.user?._id;
		if (userId) {
			socket.emit('register-user', userId);
		}
	}
	return socket;
};

export const getSocket = (): Socket => connectSocket();