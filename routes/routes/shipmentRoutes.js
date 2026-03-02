import express from "express";
import { PrismaClient } from "@prisma/client";
import { generateTrackingCode } from "../utils/tracking.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { receiverName, destination } = req.body;
  const shipment = await prisma.shipment.create({
    data: {
      trackingCode: generateTrackingCode(),
      receiverName,
      destination,
    },
  });
  res.json(shipment);
});

router.get("/track/:code", async (req, res) => {
  const shipment = await prisma.shipment.findUnique({ where: { trackingCode: req.params.code } });
  if (!shipment) return res.status(404).json({ message: "Not found" });
  res.json(shipment);
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  const updated = await prisma.shipment.update({ where: { id: req.params.id }, data: { status } });
  res.json(updated);
});

export default router;
