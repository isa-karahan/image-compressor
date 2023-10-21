export type CreateUser = {
  name: string;
  surname: string;
  email: string;
  birthDate: Date | string;
  gender: number;
  occupation: number;
};

export type User = CreateUser & {
  rowKey: string;
  partitionKey: string;
  timestamp: Date;
};

export const professions = [
  "Doctor",
  "Engineer",
  "Teacher",
  "Lawyer",
  "Artist",
  "Chef",
  "Scientist",
  "Nurse",
  "Architect",
  "Writer",
  "PoliceOfficer",
  "Firefighter",
  "Farmer",
  "Designer",
  "Accountant",
  "Athlete",
  "Musician",
  "Actor",
  "Other",
];
