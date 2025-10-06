import jwt from "jsonwebtoken";
//will be used in controllers to generate token when user logs in or registers


export const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
}