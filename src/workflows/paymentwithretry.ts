// workflows/paymentWithRetry.ts
import { proxyActivities,defineSignal} from "@temporalio/workflow";
import type * as activities from "../activities/order/activities";
const inventoryAvailableSignal = defineSignal<[boolean]>("inventoryAvailable");
const {
  chargeCard,
  reserveInventory,
  shipOrder,
  refundPayment,
} = proxyActivities<typeof activities>({
  startToCloseTimeout: "10 seconds",
  retry: {
    maximumAttempts: 3, 
    initialInterval: "10 seconds",
  },
});

export async function paymentWithRetries(
  amount: number,
  itemsAvailable: boolean,
  locationValid: boolean
): Promise<string> {
  let paymentCharged = false;
  try {
    await chargeCard(amount);
    paymentCharged = true;

  
    await reserveInventory(itemsAvailable);

   
    await shipOrder(locationValid);

    return "Order completed successfully";

  } catch (err) {
    if (paymentCharged) {
      await refundPayment();
    }
    throw err;
  }
}
