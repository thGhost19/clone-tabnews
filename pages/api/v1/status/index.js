import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  try {
    const databaseName = process.env.POSTGRES_DB;
    const versionResult = await database.query("SHOW server_version;");
    const maxConnectionsResult = await database.query("SHOW max_connections;");
    const currentconnectionsResult = await database.query({
      text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });

    const maxConnectionsTrated = Number(
      maxConnectionsResult.rows[0].max_connections,
    );
    const currentConnectionsTrated = Number(
      currentconnectionsResult.rows[0].count,
    );

    response.status(200).json({
      update_at: updateAt,
      database: {
        version_db: versionResult.rows[0].server_version,
        max_connections_db: maxConnectionsTrated,
        current_connections_db: currentConnectionsTrated,
      },
    });
  } catch (error) {
    console.error("Erro ao consultar o banco:", error);
    response.status(500).json({
      error: "Erro ao consultar informações do banco de dados",
    });
  }
}

export default status;
