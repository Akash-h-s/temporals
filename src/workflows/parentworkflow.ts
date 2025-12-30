import {
  startChild,
  defineSignal,
  setHandler,
} from "@temporalio/workflow";
import { payment, debit, credit } from "./payment";
import { childinventory, addcart, booked } from "./inventory";

// Signals the CLIENT will send
export const payDebit = defineSignal("payDebit");
export const payCredit = defineSignal("payCredit");
export const inventoryAdd = defineSignal("inventoryAdd");
export const inventoryBook = defineSignal("inventoryBook");

export async function orderWorkflow(): Promise<string> {

  // Start payment child
  const paymentHandle = await startChild(payment, {
    workflowId: "payment-child",
  });

  // Forward payment signals
  setHandler(payDebit, async () => {
    await paymentHandle.signal(debit);
  });

  setHandler(payCredit, async () => {
    await paymentHandle.signal(credit);
  });

  // Wait until payment finishes
  await paymentHandle.result();

  // Start inventory child
  const inventoryHandle = await startChild(childinventory, {
    workflowId: "inventory-child",
  });

  // Forward inventory signals
  setHandler(inventoryAdd, async () => {
    await inventoryHandle.signal(addcart);
  });

  setHandler(inventoryBook, async () => {
    await inventoryHandle.signal(booked);
  });

  // Wait until inventory finishes
  await inventoryHandle.result();

  return "Order completed successfully";
}
