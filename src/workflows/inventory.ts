import { setHandler,defineSignal,defineQuery,condition} from "@temporalio/workflow";
type inventory = "start"| "addcart" | "booked"

export const addcart=defineSignal("addcart")
export const booked=defineSignal("booked")
const getstatus=defineQuery<inventory>("getstatus")

export async function childinventory() {
    let status:inventory="start"

    setHandler(addcart,()=>{
        if(status==="start")
            status="addcart"
    })

    setHandler(booked,()=>{
        if(status==="addcart")
            status="booked"
    })

    setHandler(getstatus,()=>status)

    await condition(()=>status==="booked")
    return "item booked sucessfully"
    
}