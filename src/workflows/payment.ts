import { defineQuery,defineSignal,setHandler,condition } from "@temporalio/workflow";

type mode= "amount" | "debited_amount" | "credited_account"

export const debit=defineSignal("debit")
export const credit=defineSignal("credit")

const getstatus=defineQuery<mode>("getstatus")

export async function payment() {
    let status:mode="amount"

    setHandler(debit,()=>{
        status="debited_amount"
        console.log("debited from the account")
    })

    setHandler(credit,()=>{
        status="credited_account",
        console.log("amount is credited to the account")
    })

    setHandler(getstatus,()=>status)

    await condition(()=>status==="credited_account")

    return "payment sucessfull"
}