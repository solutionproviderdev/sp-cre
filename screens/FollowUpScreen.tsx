import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, AppState, Alert } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import ReminderCard from '@/components/follow-up/RemainderCard';
import CallLog from 'react-native-call-log';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const FollowUpScreen = () => {
	const [callInProgress, setCallInProgress] = useState(false);
	// Store the number that's dialed
	const [calledNumber, setCalledNumber] = useState<string | null>(null);

	// Dummy reminders and counts here...
	const dummyReminders = [
		{
			id: 1,
			reminder: {
				status: 'Pending',
				name: 'John Doe',
				phone: ['+8801329709895', '+8801712379753'],
				address: {
					address: '123 Main St',
					area: 'Downtown',
					district: 'Central',
					division: 'Metro',
				},
				creName: {
					nameAsPerNID: 'Jane Smith',
					profilePicture: 'https://via.placeholder.com/28',
				},
			},
			latestReminder: { status: 'Pending' },
			lastComment: {
				commentBy: {
					nameAsPerNID: 'Alice',
					profilePicture: 'https://via.placeholder.com/24',
				},
				comment: 'Please follow up with the client by tomorrow.',
			},
			formattedDate: '09/15/2025',
			formattedTime: '10:30 AM',
			commentTimestamp: '5 mins ago',
		},
		{
			id: 2,
			reminder: {
				status: 'Complete',
				name: 'Emily Davis',
				phone: ['+1122334455'],
				address: {
					address: '456 South St',
					area: 'Suburban',
					district: 'West',
					division: 'Metro',
				},
				creName: {
					nameAsPerNID: 'Robert Brown',
					profilePicture: 'https://via.placeholder.com/28',
				},
			},
			latestReminder: { status: 'Complete' },
			lastComment: {
				commentBy: {
					nameAsPerNID: 'David',
					profilePicture: 'https://via.placeholder.com/24',
				},
				comment: 'Great job on completing the follow-up.',
			},
			formattedDate: '09/14/2025',
			formattedTime: '11:00 AM',
			commentTimestamp: '10 mins ago',
		},
		{
			id: 3,
			reminder: {
				status: 'Late',
				name: 'Michael Johnson',
				phone: ['+1987654321'],
				address: {
					address: '789 East Ave',
					area: 'Uptown',
					district: 'North',
					division: 'Metro',
				},
				creName: {
					nameAsPerNID: 'Laura Wilson',
					profilePicture: 'https://via.placeholder.com/28',
				},
			},
			latestReminder: { status: 'Late' },
			lastComment: {
				commentBy: {
					nameAsPerNID: 'Karen',
					profilePicture: 'https://via.placeholder.com/24',
				},
				comment: 'Client seems to be unavailable. Please reach out later.',
			},
			formattedDate: '09/16/2025',
			formattedTime: '09:15 AM',
			commentTimestamp: '2 hours ago',
		},
		{
			id: 4,
			reminder: {
				status: 'Missed',
				name: 'Patricia Lee',
				phone: ['+1414141414'],
				address: {
					address: '321 West St',
					area: 'Midtown',
					district: 'East',
					division: 'Metro',
				},
				creName: {
					nameAsPerNID: 'Steven Clark',
					profilePicture: 'https://via.placeholder.com/28',
				},
			},
			latestReminder: { status: 'Missed' },
			lastComment: {
				commentBy: {
					nameAsPerNID: 'George',
					profilePicture: 'https://via.placeholder.com/24',
				},
				comment: 'Follow up call missed, please try again soon.',
			},
			formattedDate: '09/17/2025',
			formattedTime: '03:00 PM',
			commentTimestamp: '30 mins ago',
		},
		{
			id: 5,
			reminder: {
				status: 'Pending',
				name: 'Robert King',
				phone: ['+5555555555', '+6666666666'],
				address: {
					address: '987 North Blvd',
					area: 'Central',
					district: 'South',
					division: 'Metro',
				},
				creName: {
					nameAsPerNID: 'Emily Turner',
					profilePicture: 'https://via.placeholder.com/28',
				},
			},
			latestReminder: { status: 'Pending' },
			lastComment: {
				commentBy: {
					nameAsPerNID: 'Olivia',
					profilePicture: 'https://via.placeholder.com/24',
				},
				comment: 'Waiting for client feedback. Follow up if no response by end of day.',
			},
			formattedDate: '09/18/2025',
			formattedTime: '01:45 PM',
			commentTimestamp: 'Just now',
		},
	];

	const pendingCount = 5;
	const missedCount = 3;
	const completeCount = 8;
	const lateCompleteCount = 2;
	const totalCount = pendingCount + missedCount + completeCount + lateCompleteCount;
	const followUpsLeft = pendingCount + missedCount + lateCompleteCount;

	const formattedDate = '09/15/2025';
	const formattedTime = '10:30 AM';
	const commentTimestamp = '5 mins ago';

	const getStatusColor = (status: string) => {
		if (status === 'Late') return '#f44336';
		if (status === 'Pending') return '#ff9800';
		return '#2196f3';
	};

	const handleSearch = () => {
		console.log('Search pressed');
	};

	// Listen for AppState changes: When returning from call screen verify and fetch call logs
	useEffect(() => {
		const subscription = AppState.addEventListener('change', async (nextState) => {
			if (nextState === 'active' && callInProgress) {
				Alert.alert(
					'Follow up',
					'Did you complete the follow-up call?',
					[
						{
							text: 'No',
							onPress: () => {
								console.log('Follow up not completed');
								setCallInProgress(false);
								setCalledNumber(null);
							},
							style: 'cancel',
						},
						// Inside your Alert "Yes" callback:
						{
							text: 'Yes',
							onPress: async () => {
								console.log('Follow up completed');
								try {
									// Request the runtime permission for READ_CALL_LOG
									const permissionResult = await request(PERMISSIONS.ANDROID.READ_CALL_LOG);
									if (permissionResult === RESULTS.GRANTED) {
										// Load all call logs
										const logs = await CallLog.loadAll();
										// Filter logs only for the dialed number
										const filteredLogs = logs.filter(log => log.phoneNumber === calledNumber);
										if (filteredLogs.length > 0) {
											// Sort logs descending by timestamp (latest first)
											const latestLog = filteredLogs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp))[0];

											// Format timestamp to 12-hour time format
											const callDate = new Date(Number(latestLog.timestamp));
											const formattedTime = callDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

											// Convert duration (assumed to be in seconds) to minutes and seconds
											const durationInSeconds = parseInt(latestLog.duration, 10);
											const minutes = Math.floor(durationInSeconds / 60);
											const seconds = durationInSeconds % 60;
											const formattedDuration = `${minutes} min ${seconds} sec`;

											console.log(`Number: ${latestLog.phoneNumber}`);
											console.log(`Call Time: ${formattedTime}`);
											console.log(`Call Type: ${latestLog.type}`);
											console.log(`Duration: ${formattedDuration}`);
										} else {
											console.log('No call logs found for this number.');
										}
									} else {
										console.log('READ_CALL_LOG permission not granted');
									}
								} catch (err) {
									console.error('Error fetching call logs:', err);
								} finally {
									setCallInProgress(false);
									setCalledNumber(null);
								}
							},
						},
					]
				);
			}
		});
		return () => {
			subscription.remove();
		};
	}, [callInProgress, calledNumber]);

	// Pie chart data for demonstration
	const data = [
		{ name: 'Pending', value: pendingCount, color: 'orange', legendFontColor: '#7F7F7F', legendFontSize: 10 },
		{ name: 'Missed', value: missedCount, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 10 },
		{ name: 'Complete', value: completeCount, color: 'green', legendFontColor: '#7F7F7F', legendFontSize: 10 },
		{ name: 'Late', value: lateCompleteCount, color: 'blue', legendFontColor: '#7F7F7F', legendFontSize: 10 },
	];

	const chartConfig = {
		backgroundGradientFrom: "#fff",
		backgroundGradientTo: "#fff",
		color: (opacity = 0.3) => `rgba(0, 0, 0, ${opacity})`,
		strokeWidth: 2,
		decimalPlaces: 0,
	};

	return (
		<ScrollView contentContainerStyle={{ padding: 16 }} className="bg-gray-100">
			{/* Summary Section */}
			<View className="flex-row justify-between mb-4">
				<View className="flex-1 justify-center">
					<Text className="text-xl font-bold">Total: {totalCount}</Text>
					<Text className="text-xl font-bold">Complete: {completeCount}</Text>
					<Text className="text-xl font-bold">Follow-Ups: {followUpsLeft}</Text>
				</View>
				<View className="justify-center items-center">
					<PieChart
						data={data}
						width={150}
						height={150}
						chartConfig={chartConfig}
						accessor="value"
						backgroundColor="transparent"
						paddingLeft="30"
					/>
				</View>
			</View>

			{/* Filters */}
			<View className="flex-row justify-between mb-4">
				<TouchableOpacity className="flex-2 bg-white border border-gray-300 rounded-lg p-3 mr-1 items-center">
					<Text className="text-gray-600 text-center">Select Date Range</Text>
				</TouchableOpacity>
				<TouchableOpacity className="flex-1 bg-white border border-gray-300 rounded-lg p-3 mx-1 items-center">
					<Text className="text-gray-600 text-center">Select CRE</Text>
				</TouchableOpacity>
				<TouchableOpacity className="flex-1 bg-white border border-gray-300 rounded-lg p-3 ml-1 items-center">
					<Text className="text-gray-600 text-center">Select Sales</Text>
				</TouchableOpacity>
			</View>

			{/* Search Button */}
			<View className="mb-4">
				<TouchableOpacity onPress={handleSearch} style={{ backgroundColor: "#046289" }} className="rounded-lg p-4 items-center">
					<Text className="text-white font-bold text-lg">Search</Text>
				</TouchableOpacity>
			</View>

			{/* Reminder Cards Section */}
			<View className="flex-col flex-wrap justify-between gap-4">
				{dummyReminders.map((item) => (
					<ReminderCard
						key={item.id}
						reminder={item.reminder}
						latestReminder={item.latestReminder}
						lastComment={item.lastComment}
						formattedDate={item.formattedDate}
						formattedTime={item.formattedTime}
						commentTimestamp={item.commentTimestamp}
						getStatusColor={getStatusColor}
						onCallInitiated={() => {
							// Set call flag and store the number that is being called
							setCallInProgress(true);
							setCalledNumber(item.reminder.phone[0]);
						}}
					/>
				))}
			</View>
		</ScrollView>
	);
};

export default FollowUpScreen;
