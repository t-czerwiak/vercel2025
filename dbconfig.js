export const config = {
  host: "ep-bold-bar-acqwvoay-pooler.sa-east-1.aws.neon.tech",
  database: "neondb",
  user: "neondb_owner",
  password: "npg_wfHJestI1kO8",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
};

import Sequelize from "sequelize";

export const sequelize = new Sequelize(process.env.DB_URL, {dialect: "postgres"});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
}

catch (error) {
  console.error("Unable to connect to the database:", error);
}

await sequelize.close();