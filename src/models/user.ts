import bcrypt from "bcrypt";

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export class User implements IUser {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: IUser) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || "user";
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  async hashPassword(): Promise<void> {
    const saltRounds = 5;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  toJSON() {
    const { password, ...userData } = this;
    return userData;
  }
}
