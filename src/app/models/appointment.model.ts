export interface AppointmentData {
    id: string;
    title: string;
    type: string;
    start: Date;
    end: Date;
    guests: string;
    location: string;
    description: string;
    videoConference: boolean;
  }