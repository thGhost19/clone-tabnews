import migrateRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  try {
    if (request.method === "GET") {
      const pendingMigrations = await migrateRunner(defaultMigrationOptions);
      return response.status(200).json(pendingMigrations);
    } else if (request.method === "POST") {
      const migratedMigrations = await migrateRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    } else {
      return response.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error running migrations:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  } finally {
    await dbClient.end();
  }
}
