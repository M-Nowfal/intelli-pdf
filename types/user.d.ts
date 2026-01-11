interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}