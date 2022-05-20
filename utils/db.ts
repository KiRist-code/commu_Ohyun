import knex, { Knex } from "knex";

let cachedDBConnection: Knex | undefined;

export const connectDB = () => {
  if (cachedDBConnection) {
    console.log("Already have cache!");
    return cachedDBConnection;
  }

  console.log("Making New Connection. . .");

  const DB: Knex = knex({
    client: "mysql",
    connection: {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "board",
      password: process.env.DB_PASSWORD || "",
      port: Number(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || "ohyun",
    },
  });

  cachedDBConnection = DB;
  return cachedDBConnection;
};
