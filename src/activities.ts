import { sleep } from "@temporalio/workflow";

export async function greet(name: string): Promise<string> {
  return `Hello, ${name} i am a first temporal in ur project! `;
}

// activities.ts
export async function makeTransaction(
  accountA: number,
  accountB: number,
  amount: number
): Promise<string> {
  
  if (accountA < amount) {
    throw new Error("Insufficient balance");
  }

  console.log(`Debiting ${amount} from A`);
  console.log(`Crediting ${amount} to B`);

  return "payment successful";
}
