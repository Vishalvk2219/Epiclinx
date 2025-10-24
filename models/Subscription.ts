import { model, models, Schema } from "mongoose"

export interface ISubscription extends Document{
    email:String
    plan:string
    currency:string
    recurringInterval:string
    trial:number
    sessionClientSecret:string
    stripeSessionId:string
    status: "paid" | "pending" | "trial"
}

const subscriptionSchema = new Schema({
    email:{type:String,required:true},
    plan:{type:String,required:true},
    currency:{type:String,required:true},
    recurringInterval:{type:String,required:true},
    trial:{type:String,default:0},
    sessionClientSecret:{type:String,required:true},
    stripeSessionId:{type:String},
    status:{type:String,enum:["Paid","Pending","Trial"],default:"Pending"}

})


const subscriptionModel = models.Subscription || model("Subscription",subscriptionSchema)
export default subscriptionModel;