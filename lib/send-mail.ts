import nodemailer from "nodemailer"


export interface MailOptions{
    to:string,
    subject:string,
    html:string
}

const transporter =  nodemailer.createTransport(
    {
        service:"gmail",
        auth:
        {
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    }
)

export const sendMail = async ({to,subject,html}:MailOptions)=>{
    await transporter.sendMail({
        from:`Epiclinx <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    })
}