import { Client, Connection } from "@temporalio/client";
import { loadClientConnectConfig } from "@temporalio/envconfig";
import { sleep } from "@temporalio/workflow";

async function run() {
  const config = loadClientConnectConfig();
  const connection = await Connection.connect(config.connectionOptions);
  const client = new Client({ connection });

  const orderdetails=await client.workflow.start("paymentWithRetries",{
    taskQueue: "order",
    args:[3000,true,true],
    workflowId:"orderdetails"

  })
  await orderdetails.signal("inventoryAvailable", true);
  
  console.log(await orderdetails.result())
//   const parentHandle = await client.workflow.start("orderWorkflow", {
//   taskQueue: "hello-world",
//   workflowId: "order-1",
// });

// console.log("Parent started");

// await parentHandle.signal("payDebit");
// console.log("Payment debited");

// await parentHandle.signal("payCredit");
// console.log("Payment credited");
// await parentHandle.signal("inventoryAdd");
// console.log("Item added");

// await parentHandle.signal("inventoryBook");
// console.log("Item booked");
// console.log(await parentHandle.result());

}

run().catch(console.error);
