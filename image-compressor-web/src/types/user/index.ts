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
