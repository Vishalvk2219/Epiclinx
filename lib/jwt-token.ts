import jwt from "jsonwebtoken"

export function createJWTtoken(id:string|number,email:string,role:string,expire?:string){

    const payload = {
        id:id.toString(),
        email:email,
        role:role,
        time:Date.now()
    }

    const options: jwt.SignOptions = {}
    if (expire){
        options.expiresIn = expire
    }
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        options
    )

    return token
}