import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./NatsWrapper";
import { ProdukCreatedListener } from "./events/listeners/ProdukCreatedListener";
import { ProdukUpdatedListener } from "./events/listeners/ProdukUpdatedListener";
import { ExpirationCompletedListener } from "./events/listeners/ExpirationCompletedListener";
import { PembayaranCreatedListener } from "./events/listeners/PembayaranCreatedListener";
import { ProdukDeletedListener } from "./events/listeners/ProdukDeletedListener";

const start = async () => {
  console.log("Starting...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY harus diisi");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI harus diisi");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID harus diisi");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL harus diisi");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID harus diisi");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("Koneksi ke NATS terputus!!!!");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new ProdukCreatedListener(natsWrapper.client).listen();
    new ProdukUpdatedListener(natsWrapper.client).listen();
    new ProdukDeletedListener(natsWrapper.client).listen();
    new ExpirationCompletedListener(natsWrapper.client).listen();
    new PembayaranCreatedListener(natsWrapper.client).listen();


    await mongoose.connect(process.env.MONGO_URI);
<<<<<<< HEAD
    console.log("Terhubung ke mongoDB!!!");
=======
    console.log("Terhubung ke mongoDB!!!");
>>>>>>> 4333aa7621410e0c0c24f91b9265042bffc529d4
  } catch (err) {
    console.error(err);
  }
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server Produk terhubung ke: ${port}`);
  });
};

start();
