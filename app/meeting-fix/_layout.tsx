import { Stack, useSegments } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { MeetingProvider } from './MeetingContext';

import StepIndicator from 'react-native-step-indicator';

const labels = ["Address", "Fix a New Meeting", "Project Info"];
const customStyles = {
    stepIndicatorSize: 30,
    currentStepIndicatorSize: 35,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#046289',
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: '#046289',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#046289',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#046289',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#046289',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#046289',
};



export default function MeetingSetLayout() {
    const segments = useSegments() as string[];

    // Determine current step based on the current segment
    let currentStep = 0;
    if (segments.includes('fix-new-meeting')) {
        currentStep = 1;
    } else if (segments.includes('project-info')) {
        currentStep = 2;
    }
    return (
        <View className="flex-1">
            {/* Step Indicator at the top */}
            <View className="mt-9">
                <StepIndicator
                    customStyles={customStyles}
                    currentPosition={currentStep}
                    labels={labels}
                    stepCount={labels.length}
                />
            </View>
            <MeetingProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="address" />
                    <Stack.Screen name="fix-new-meeting" />
                    <Stack.Screen name="project-info" />

                </Stack>
            </MeetingProvider>

        </View>
    );
}
