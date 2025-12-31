// worker.ts
import { Worker } from "@temporalio/worker";
import * as activities from "./activities/order/activities";

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows/paymentwithretry"), 
    activities,
    taskQueue: "order",
  });

  await worker.run();
}
run();
