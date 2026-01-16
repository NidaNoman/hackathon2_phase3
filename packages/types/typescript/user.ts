export interface User {
  id: number;
  username: string;
  // password_hash should not be exposed to the frontend
}

export interface UserInDB extends User {
  password_hash: string;
}

export interface UserCreate {
  username: string;
  password: string;
}
