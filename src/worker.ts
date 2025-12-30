// worker.ts
import { Worker } from "@temporalio/worker";

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows"), // folder
    taskQueue: "hello-world",
  });

  await worker.run();
}

run();
