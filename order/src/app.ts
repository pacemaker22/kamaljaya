import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser } from "@kjbuku/common";
import { createOrderRouter } from "./routes/create-order";
import { cancelOrderRouter } from "./routes/cancel-order";
import { deliverOrderRouter } from "./routes/deliver-order";
import { getOrderRouter } from "./routes/get-order";
import { showAllOrderRouter } from "./routes/show-all-order";
import { showMyOrderRouter } from "./routes/show-my-order";
import { showProdukRouter } from "./routes/show-produk";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
	cookieSession({
		signed: false,
	})
);
app.use(currentUser);

app.use(createOrderRouter);
app.use(cancelOrderRouter);
app.use(deliverOrderRouter);
app.use(getOrderRouter);
app.use(showAllOrderRouter);
app.use(showMyOrderRouter);
app.use(showProdukRouter);


app.all("*", async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
