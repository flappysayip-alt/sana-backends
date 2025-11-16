const express = require("express");
const router = express.Router();
const multer = require("multer");
const PDFDocument = require("pdfkit");
const path = require("path");
const Order = require("../models/Order");
const fs = require("fs");

/* ------------------ FILE UPLOAD STORAGE ------------------ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* ------------------ 1. CREATE ORDER ------------------ */
router.post(
  "/create",
  upload.single("designPhoto"),
  async (req, res) => {
    try {
      const {
        userName,
        userPhone,
        service,
        measurements,
        address
      } = req.body;

      const newOrder = new Order({
        userName,
        userPhone,
        service,
        measurements: JSON.parse(measurements),
        address: JSON.parse(address),
        designPhoto: req.file ? req.file.filename : null
      });

      await newOrder.save();

      res.json({ success: true, orderId: newOrder._id });
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: "Order save failed" });
    }
  }
);

/* ------------------ 2. GET USER ORDERS ------------------ */
router.get("/user/:phone", async (req, res) => {
  try {
    const orders = await Order.find({ userPhone: req.params.phone })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user orders" });
  }
});

/* ------------------ 3. GET ALL ORDERS (ADMIN) ------------------ */
router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error fetching all orders" });
  }
});

/* ------------------ 4. GENERATE PDF INVOICE ------------------ */
router.get("/invoice/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    /* ---------------- HEADER ---------------- */
    doc.fontSize(22).text("Sana Tailor – Invoice", { align: "center" });
    doc.moveDown();

    /* ---------------- ORDER DETAILS ---------------- */
    doc.fontSize(15).text(`Order ID: ${order._id}`);
    doc.text(`Service: ${order.service}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.moveDown();

    /* ---------------- CUSTOMER ---------------- */
    doc.fontSize(16).text("Customer Details:");
    doc.fontSize(13).text(`Name: ${order.userName}`);
    doc.text(`Phone: ${order.userPhone}`);
    doc.moveDown();

    /* ---------------- ADDRESS ---------------- */
    doc.fontSize(16).text("Address:");
    if (order.address) {
      let a = order.address;
      doc.fontSize(13).text(`${a.name}`);
      doc.text(`${a.house}, ${a.area}`);
      doc.text(`${a.city} - ${a.pin}`);
    } else {
      doc.fontSize(13).text("No address provided");
    }
    doc.moveDown();

    /* ---------------- MEASUREMENTS ---------------- */
    doc.fontSize(16).text("Measurements:");
    for (let key in order.measurements) {
      doc.fontSize(13).text(`${key}: ${order.measurements[key]}`);
    }

    doc.end();
  } catch (err) {
    console.log(err);
    res.status(500).send("PDF generation failed");
  }
});

module.exports = router;
