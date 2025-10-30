import jwt from '@tsndr/cloudflare-worker-jwt';
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
    const isValid = jwt.verify(token, process.env.JWT_SECRET as string);
    if(!isValid){
      return null
    }
    const decoded = jwt.decode(token)
    return decoded?.payload || null;
  } catch (error:any) {
    return null;
  }
}
