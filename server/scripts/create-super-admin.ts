// Usage: bun run create-super-admin
// Creates a super admin account. There is intentionally no HTTP endpoint for this.
import { connectMongo, disconnectMongo } from "../db/mongoose";
import { SuperAdmin } from "../models/SuperAdmin";
import { isLoginEmailTaken } from "../services/account.service";
import { hashPassword } from "../services/auth.service";

const MIN_PASSWORD = 12;

function ask(question: string): string {
  const answer = prompt(question)?.trim() ?? "";
  if (!answer) {
    console.error("A value is required.");
    process.exit(1);
  }
  return answer;
}

const nomComplet = ask("Full name (nomComplet):");
const email = ask("Email:").toLowerCase();
const password = ask(`Password (min ${MIN_PASSWORD} characters):`);

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Invalid email address.");
  process.exit(1);
}
if (password.length < MIN_PASSWORD || password.length > 128) {
  console.error(`Password must be between ${MIN_PASSWORD} and 128 characters.`);
  process.exit(1);
}

await connectMongo();
try {
  await SuperAdmin.createIndexes();
  if (await isLoginEmailTaken(email)) {
    console.error("An account with this email already exists.");
    process.exitCode = 1;
  } else {
    const superAdmin = await SuperAdmin.create({ nomComplet, email, motDePasseHash: await hashPassword(password) });
    console.log(`Super admin created: ${superAdmin.email} (id ${superAdmin.id})`);
  }
} finally {
  await disconnectMongo();
}
