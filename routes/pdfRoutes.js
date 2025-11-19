const express = require("express");
const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

const router = express.Router();

/* ------------------------------------------------------
   GENERATE PDF INVOICE FOR ORDER
------------------------------------------------------ */
router.get("/invoice/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    // PDF setup
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    // Invoice Header
    doc.fontSize(22).text("Sana Tailor – Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice ID: ${order._id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.moveDown();

    // User Info
    doc.fontSize(16).text("Customer Details", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12)
      .text(`Name: ${order.userName}`)
      .text(`Phone: ${order.userPhone}`)
      .moveDown();

    // Service
    doc.fontSize(16).text("Service Details", { underline: true });
    doc.fontSize(12).text(`Service: ${order.service}`).moveDown();

    // Measurements
    doc.fontSize(16).text("Measurements", { underline: true });
    doc.fontSize(12);

    const m = typeof order.measurements === "string"
      ? JSON.parse(order.measurements)
      : order.measurements;

    Object.keys(m).forEach(k => {
      doc.text(`${k}: ${m[k]}`);
    });

    doc.moveDown();

    // Address
    doc.fontSize(16).text("Delivery Address", { underline: true });
    doc.fontSize(12);

    if (order.address) {
      doc.text(order.address.name);
      doc.text(`${order.address.house}, ${order.address.area}`);
      doc.text(`${order.address.city} - ${order.address.pin}`);
    } else {
      doc.text("No address added.");
    }

    doc.moveDown();

    // Done
    doc.fontSize(14).text("Thank you for choosing Sana Tailor!", {
      align: "center",
    });

    doc.end();
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "PDF generation failed" });
  }
});

module.exports = router;
