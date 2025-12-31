// activities/paymentActivities.ts
export async function chargeCard(amount: number): Promise<void> {
  if (amount <= 500) {
    throw new Error("Insufficient amount");
  }
  console.log("Payment charged");
}

export async function reserveInventory(itemsAvailable: boolean): Promise<void> {
  if (!itemsAvailable) {
    throw new Error("Inventory not available");
  }
  console.log("Inventory reserved");
}

export async function shipOrder(locationValid: boolean): Promise<void> {
  if (!locationValid) {
    throw new Error("Invalid shipping location");
  }
  console.log("Order shipped");
}

export async function refundPayment(): Promise<void> {
  console.log("Payment refunded");
}
