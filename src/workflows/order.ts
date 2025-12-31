import {
  defineSignal,
  defineQuery,
  setHandler,
  condition,
  proxyActivities,
  sleep
} from "@temporalio/workflow";

import type * as activities from "../activities/order/activities";

type Begin = "start" | "reserve" | "processpayment" | "confirm";

const reserveSignal = defineSignal("reserve");
const paymentSignal = defineSignal("payment");
const confirmSignal = defineSignal("confirm");
const getstatus = defineQuery<Begin>("getstatus");

const {
  reservedactivities,
  proceedpayment,
  confirmbooking,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "10 seconds",
  retry:{
    maximumInterval:"5 seconds",
    maximumAttempts:2
  }
});

export async function orderprocessing(): Promise<string> {
  let reserved = false;
  let paid = false;
  let confirmed = false;
  let status: Begin = "start";

  setHandler(getstatus, () => status);

  setHandler(reserveSignal, () => {
    reserved = true;
    status = "reserve";
  });

  setHandler(paymentSignal, () => {
    paid = true;
    status = "processpayment";
  });

  //GET A Random 4 digit vAlue
  const Random = Math.random()*20000
   console.log(Random)
  if(Random<1000){
    confirmed=true;
    status="confirm"
  }
  await condition(() => reserved);
  await sleep("10 second")
  await reservedactivities();
  console.log("124")

  await condition(() => paid);
  await proceedpayment();
  console.log("124")

  await condition(() => confirmed);
  await confirmbooking();

  return "Process completed successfully";
}
