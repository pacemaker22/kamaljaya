import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@kjbuku/common";
import { stripe } from "../stripe";

import { Order } from "../models/order";
import { natsWrapper } from "../NatsWrapper";
import { Pembayaran } from '../models/pembayaran'
import { PembayaranCreatedPublisher } from "../events/publishers/PembayaranCreatedPublisher";

const router = express.Router();

router.post(
  "/api/pembayaran",
  requireAuth,
  [
    body("token").not().isEmpty(),
    body("orderId")
      .not()
      .isEmpty()
      .isMongoId()
      .withMessage("Invalid MongoDB ObjectId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Dibatalkan) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    if (order.metodePembayaran === "paypal") {
      const pembayaran = Pembayaran.build({
        orderId,
        stripeId: token,
      });

      await pembayaran.save();

      await new PembayaranCreatedPublisher(natsWrapper.client).publish({
        id: pembayaran.id,
        orderId: pembayaran.orderId,
        stripeId: pembayaran.stripeId,
      });

      res.status(201).send(pembayaran);
    }

    const charge = await stripe.charges.create({
      currency: "Rp",
      amount: order.hargaTotal * 100,
      source: token,
    });

    if (!charge.id) {
      throw new Error("Pembayaran gagal untuk diproses");
    }

    const pembayaran = Pembayaran.build({
      orderId,
      stripeId: charge.id,
    });

    await pembayaran.save();

    await new PembayaranCreatedPublisher(natsWrapper.client).publish({
      id: pembayaran.id,
      orderId: pembayaran.orderId,
      stripeId: pembayaran.stripeId,
    });

    res.status(201).send(pembayaran);
  }
);

export { router as createPembayaranRouter };
