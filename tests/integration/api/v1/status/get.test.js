test("GET to /api/v1/status should returns 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  console.log(response);
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);
  expect(responseBody.update_at).toBeDefined();

  const parsedUpdateAt = new Date(responseBody.update_at).toISOString();
  expect(responseBody.update_at).toEqual(parsedUpdateAt);

  expect(responseBody.database.version_db).toBe("17.4");
  expect(typeof responseBody.database.max_connections_db).toBe("number");
  expect(responseBody.database.max_connections_db).toEqual(100);
  expect(typeof responseBody.database.current_connections_db).toBe("number");
});
