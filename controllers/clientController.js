// here you will import data/db js files and using it you will implement the client functions here
const { razorpay,  webhook_secret } = require("../config/razorpay");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const { PassThrough } = require("stream");

const Data = require("../models/data");
const myemail = process.env.EMAIL;
const appPassword = process.env.APP_PASSWORD;

homePage = (req, res, next) => {
  res.render("homepage1");
};
// ...existing code...
bookTicket = async (req, res, next) => {
  // Example: get user email from query or session
  let iden;
  try {
    iden = req.body["order_id"];
  } catch (err) {
    iden = null;
    console.log(err);
  }
  console.log("Identifier received:", iden);
  let formData;
  if (iden) {
    // Find the latest booking for this email
    formData = await Data.findOne({ razorpay_order_id: iden });
    console.log("Form Data:", formData);
  } else {
    formData = {
      razorpay_order_id: "",
      Numoftickets: 0,
      Name: [],
      RollNo: [],
      Email: "",
      Date: "",
    };
  }

  res.render("BOOKING", {
    formData: formData,
  });
};
// ...existing code...
paydone = (req, res, next) => {
  const iden = req.params["order_id"];
  res.render("success", { order_id: iden });
};

download = async (req, res, next) => {
  const doc = new PDFDocument();
  const passthrough = new PassThrough();
  const chunks = [];

  // 1. Collect PDF chunks for email

  const iden = req.params["order_id"];
  if (iden) {
    const saveData = await Data.findOne({ razorpay_order_id: iden });
    if (saveData && saveData.status === "paid") {
      passthrough.on("data", (chunk) => chunks.push(chunk));
      passthrough.on("end", async () => {
        const pdfBuffer = Buffer.concat(chunks);

        // Send email with PDF attachment
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: myemail,
            pass: appPassword,
          },
        });
        await transporter.sendMail({
          from: myemail,
          to: `${saveData.Email}`,
          subject: "Payment Slip",
          text: "Please find your payment slip attached below for the fest ticket booking.",
          attachments: [
            {
              filename: "document.pdf",
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        });

      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=fest_payment_slip.pdf");

      doc.pipe(res);
      doc.pipe(passthrough);
      // Draw main rounded background box with light color
      doc
        .save()
        .roundedRect(40, 40, 520, 600, 20) // reduced height from 680 → 640
        .fillOpacity(0.05)
        .fill("#3399cc")
        .restore()
        .roundedRect(40, 40, 520, 640, 20)
        .lineWidth(2)
        .stroke("#3399cc");

      // Title Section
      doc
        .font("Helvetica-Bold")
        .fontSize(32)
        .fillColor("#020744")
        .text("FEST PAYMENT SLIP", 0, 60, {
          align: "center",
          underline: true,
          lineGap: 8,
        });

      // Horizontal accent line
      doc
        .moveTo(60, 110)
        .lineTo(540, 110)
        .lineWidth(1.5)
        .strokeColor("#3399cc")
        .stroke();

      // Payment Details Section
      doc.font("Helvetica").fontSize(14).fillColor("#222");
      const startY = 140;
      let y = startY;
      const lineGap = 30;

      // helper function
      function drawDetail(label, value) {
        doc.font("Helvetica-Bold").fillColor("#020744").text(label, 70, y);
        doc.font("Helvetica").fillColor("#333").text(value, 220, y);
        y += lineGap;
      }

      drawDetail("Number of Tickets:", saveData.Numoftickets);
      drawDetail("Name:", saveData.Name.join(", "));
      drawDetail("Roll Numbers:", saveData.RollNo.join(", "));
      drawDetail("Email:", saveData.Email);
      drawDetail("Date:", saveData.Date);

      // add a little extra space before Amount Paid
      y += 8; // <-- this adds just a small gap

      drawDetail("Amount Paid:", `Rs.${saveData.amount}`);
      drawDetail("Payment ID:", saveData.payment_id);
      drawDetail("Order ID:", saveData.razorpay_order_id);

      // Highlighted amount box
      doc
        .save()
        .roundedRect(65, y + 10, 450, 50, 10)
        .fillOpacity(0.1)
        .fill("#020744")
        .restore();

      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .fillColor("#020744")
        .text(`Total Paid: Rs.${saveData.amount}`, 80, y + 25);

      // Footer (make sure it fits on same page)
      doc
        .fontSize(18)
        .fillColor("#555")
        .text("Thank you for your payment!", 0, 700, { align: "center" });

      doc.end();
    }
  }
};

createOrder = async (req, res, next) => {
  const existingOrderId = req.body["order_id"]; // Hidden field from form

  if (existingOrderId) {
    // Try to find and update the existing order
    const sData = await Data.findOne({ razorpay_order_id: existingOrderId });
    if (sData) {
      // Update details
      sData.Numoftickets = parseInt(req.body["numTickets"], 10);
      const numTickets = sData.Numoftickets;
      let names = [];
      let rollNos = [];
      for (let i = 1; i <= numTickets; i++) {
        names.push(req.body[`name${i}`]);
        rollNos.push(req.body[`roll${i}`]);
      }
      sData.Name = names;
      sData.RollNo = rollNos;
      sData.Email = req.body["email"];

      let totalAmount = 0;
      if (numTickets == 1) {
        totalAmount = 300;
      } else if (numTickets == 5) {
        totalAmount = 1200;
      } else if (numTickets == 8) {
        totalAmount = 1680;
      } else if (numTickets == 10) {
        totalAmount = 1800;
      }
      sData.Date = new Date().toString();
      sData.amount = totalAmount;
      await sData.save();

      res.render("payment", {
        key_id: razorpay.key_id,
        order_id: sData.razorpay_order_id,
        amount: sData.amount, 
        Name: sData.Name,
        RollNo: sData.RollNo,
        Email: sData.Email,
        Numoftickets: sData.Numoftickets,
      });
    }
  } else {
    const email = req.body["email"];
    const numTickets = parseInt(req.body["numTickets"], 10);
    let names = [];
    let rollNos = [];
    for (let i = 1; i <= numTickets; i++) {
      names.push(req.body[`name${i}`]);
      rollNos.push(req.body[`roll${i}`]);
    }

    const now = new Date();
    const date = now.toString();

    let totalAmount = 0;
    if (numTickets == 1) {
      totalAmount = 300;
    } else if (numTickets == 5) {
      totalAmount = 1200;
    } else if (numTickets == 8) {
      totalAmount = 1680;
    } else if (numTickets == 10) {
      totalAmount = 1800;
    }

    const rzpOrder = await razorpay.orders
      .create({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: Date.now().toString(),
      })
      .catch((err) => {
        console.log("Razorpay Order Creation Error:", err);
      });
    // Check if rzpOrder is undefined
    if (!rzpOrder) {
      return res
        .status(500)
        .send("Failed to create Razorpay order. Please try again.");
    }
    const lData = new Data({
      status: "pending",
      razorpay_order_id: rzpOrder.id,
      amount: totalAmount,
      Numoftickets: numTickets,
      Name: names,
      RollNo: rollNos,
      Email: email,
      Date: date,
    });

    // razorpay ka code

    await lData
      .save()
      .then(() => {
        console.log("Data Saved");
      })
      .catch((err) => {
        console.log(err);
      });

    res.render("payment", {
      key_id: razorpay.key_id,
      order_id: rzpOrder.id,
      amount: lData.amount, 
      Name: lData.Name,
      RollNo: lData.RollNo,
      Email: lData.Email,
      Numoftickets: lData.Numoftickets,
    });
  }


};

// Step 2: Razorpay Webhook -> Verify payment
webhookHandler = async (req, res) => {
  console.log("Webhook received:", req.body);
  // 1. Verify webhook signature
  const shasum = crypto.createHmac("sha256", webhook_secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    return res.status(400).send("Invalid signature");
  }

  // 2. Extract payment info
  const paymentEntity = req.body.payload.payment.entity;

  const razorpayOrderId = paymentEntity.order_id;
  const amountPaid = paymentEntity.amount; // in paise
  const paymentStatus = paymentEntity.status;
  // 3. Look up order in DB
  const order = await Data.findOne({ razorpay_order_id: razorpayOrderId });
  if (!order) {
    return res.status(404).send("Order not found");
  }
  // 4. Verify amount matches
  if (order.amount * 100 !== amountPaid) {

    return res.status(400).send("Amount mismatch");
  }
  if (paymentStatus !== "captured") {
    console.error("Payment not captured:", paymentStatus);

    await Data.findOneAndDelete(order).catch((err) => {
      console.log(err);
    });
    return res.status(400).send("Payment not captured");
  }
  // 5. Mark as paid
  order.status = "paid";
  order.payment_id = paymentEntity.id;
  await order.save();


  res.status(200).send("OK");
};


exports.homePage = homePage;
exports.bookTicket = bookTicket;
exports.download = download;
exports.paydone = paydone;
exports.createOrder = createOrder;
exports.webhookHandler = webhookHandler;
