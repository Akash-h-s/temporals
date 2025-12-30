import { Client, Connection } from "@temporalio/client";
import { loadClientConnectConfig } from "@temporalio/envconfig";

async function run() {
  const config = loadClientConnectConfig();
  const connection = await Connection.connect(config.connectionOptions);
  const client = new Client({ connection });

  // 1️⃣ Start ONLY the PARENT workflow
  const parentHandle = await client.workflow.start("orderWorkflow", {
  taskQueue: "hello-world",
  workflowId: "order-1",
});

console.log("Parent started");

// PAYMENT
await parentHandle.signal("payDebit");
console.log("Payment debited");

await parentHandle.signal("payCredit");
console.log("Payment credited");

// INVENTORY
await parentHandle.signal("inventoryAdd");
console.log("Item added");

await parentHandle.signal("inventoryBook");
console.log("Item booked");

// Final result
console.log(await parentHandle.result());

}

run().catch(console.error);
