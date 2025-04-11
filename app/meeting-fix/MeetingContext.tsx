import React, { createContext, useState, ReactNode } from 'react';

export interface MeetingData {
  address?: {
    division: string;
    district: string;
    area: string;
    address: string;
  };
  date?: string;
  slot?: string;
  salesExecutive?: string;
  projectInfo?: {
    name: string;
    phone: string[];
    projectLocation: string;
    projectStatus: {
      status: string;
      subStatus: string;
    };
    requirements: string[];
    visitCharge: number;
    comment: string;
  };
  // Additional fields as needed.
}

interface MeetingContextProps {
  meetingData: MeetingData;
  setMeetingData: React.Dispatch<React.SetStateAction<MeetingData>>;
}

export const MeetingContext = createContext<MeetingContextProps>({
  meetingData: {},
  setMeetingData: () => { },
});

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  const [meetingData, setMeetingData] = useState<MeetingData>({});

  return (
    <MeetingContext.Provider value={{ meetingData, setMeetingData }}>
      {children}
    </MeetingContext.Provider>
  );
};
