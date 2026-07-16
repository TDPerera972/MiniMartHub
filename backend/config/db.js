const dns = require("node:dns");
const mongoose = require("mongoose");

const configureDnsServers = () => {
  const dnsServers = process.env.MONGO_DNS_SERVERS;

  if (!dnsServers) {
    return;
  }

  const servers = dnsServers
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (servers.length > 0) {
    dns.setServers(servers);
    console.log(`Using custom MongoDB DNS servers: ${servers.join(", ")}`);
  }
};

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from the environment.");
  }

  configureDnsServers();

  try {
    const connection = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
