import { createClient, type Client } from "@libsql/client";

declare global {
  var __libsqlClient: Client | undefined;
}

function buildClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) {
    throw new Error("TURSO_DATABASE_URL is not set");
  }
  return createClient({ url, authToken });
}

export const db: Client = global.__libsqlClient ?? buildClient();

if (process.env.NODE_ENV !== "production") {
  global.__libsqlClient = db;
}
