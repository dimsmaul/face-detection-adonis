interface LeaveData {
  id: string;
  userId: string;
  date: string;
  time: string;
  note: string;
  attachment: string;
  createdAt: string;
  updatedAt: string;
  user: LeaveUserData;
}

interface LeaveUserData {
  id: string;
  nim: string;
  name: string;
  email: string;
  major: string;
  status: number;
  dateOfAcceptance: string;
  profile: string;
  userDataId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
}