import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyToken() {
  try {
    const cookieStore = await cookies();
    //or
    //   for plain node.js request handler
    
    //   const cookieHeader = req.headers.get("cookie") || "";
    //   const cookies = Object.fromEntries(
    //   cookieHeader.split("; ").map(c => c.split("="))
    //   );
    // const token = cookies["token"];
    const token = cookieStore.get("authToken")?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error:any) {
    return null;
  }
}
