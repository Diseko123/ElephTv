require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../Back end/.env") });

let express;
let nodemailer;

try {
  express = require("express");
} catch (_error) {
  express = require("../Back end/node_modules/express");
}

try {
  nodemailer = require("nodemailer");
} catch (_error) {
  nodemailer = require("../Back end/node_modules/nodemailer");
}

const app = express();
const port = Number(process.env.PORT || 5000);
const ordersPath = process.env.ORDERS_FILE_PATH
  ? path.resolve(process.env.ORDERS_FILE_PATH)
  : path.resolve(__dirname, "../Back end/data/orders.json");
const codesPath = process.env.CODES_FILE_PATH
  ? path.resolve(process.env.CODES_FILE_PATH)
  : path.resolve(__dirname, "../Back end/data/codes.json");

app.use(express.json());

function readBoolean(value, fallback) {
  if (value === undefined) return fallback;
  return ["true", "1", "yes"].includes(String(value).toLowerCase());
}

function createSmtpTransporter() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: readBoolean(process.env.SMTP_SECURE, false),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log("SMTP configured for...", process.env.SMTP_USER || process.env.FROM_EMAIL || "unknown sender");
  return transporter;
}

function getOrderId(order) {
  return order.id || order.orderId || order._id;
}

function getOrderEmail(order) {
  return order.email || order.customerEmail || order.buyerEmail || order.recipientEmail;
}

function getCustomerName(order) {
  return order.customerName || order.name || order.fullName || "ElephTv Customer";
}

function getPlan(order) {
  return order.plan || order.planName || order.planPurchased || order.package || "ElephTv subscription";
}

function getActivationCode(order) {
  return order.activationCode || order.codeDelivered || order.subscriptionCode || "";
}

function normalizePlan(planName) {
  const lowerPlan = String(planName || "").toLowerCase();

  if (lowerPlan.includes("premium")) return "Premium";
  if (lowerPlan.includes("standard")) return "Standard";
  if (lowerPlan.includes("basic")) return "Basic";
  return "Basic";
}

function normalizeStatus(code) {
  if (code.status === "Used" || code.used || code.delivered) return "Used";
  return "Available";
}

function normalizeCodeEntry(entry, fallbackPlan) {
  if (typeof entry === "string") {
    return {
      plan: normalizePlan(fallbackPlan),
      code: entry,
      status: "Available",
    };
  }

  return {
    ...entry,
    plan: normalizePlan(entry.plan || fallbackPlan),
    status: normalizeStatus(entry),
  };
}

function normalizeCodes(codes) {
  if (Array.isArray(codes)) {
    return codes.map((entry) => normalizeCodeEntry(entry, entry.plan));
  }

  return Object.entries(codes || {}).flatMap(([plan, entries]) =>
    (entries || []).map((entry) => normalizeCodeEntry(entry, plan))
  );
}

function groupCodes(codes) {
  return codes.reduce((groups, code) => {
    const plan = normalizePlan(code.plan);
    const { used, delivered, createdAt, ...cleanCode } = code;

    return {
      ...groups,
      [plan]: [...(groups[plan] || []), cleanCode],
    };
  }, {});
}

async function readJson(filePath, fallback) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

async function readOrders() {
  return readJson(ordersPath, []);
}

async function saveOrders(orders) {
  await writeJson(ordersPath, orders);
}

async function readCodes() {
  return readJson(codesPath, {});
}

async function saveCodes(codes) {
  await writeJson(codesPath, codes);
}

async function assignActivationCode(order) {
  const existingCode = getActivationCode(order);
  if (existingCode) return existingCode;

  const codesFile = await readCodes();
  const codes = normalizeCodes(codesFile);
  const plan = normalizePlan(getPlan(order));
  const codeIndex = codes.findIndex((entry) => entry.plan === plan && entry.code && entry.status === "Available");

  if (codeIndex === -1) {
    const error = new Error(`No activation codes available for ${plan}`);
    error.statusCode = 409;
    throw error;
  }

  const selectedCode = codes[codeIndex].code;
  codes[codeIndex] = {
    ...codes[codeIndex],
    status: "Used",
    deliveredAt: new Date().toISOString(),
    deliveredTo: getOrderEmail(order),
    orderReference: getOrderId(order),
  };

  await saveCodes(groupCodes(codes));
  return selectedCode;
}

async function sendActivationEmail(order) {
  const emailTo = order.email;
  const orderId = getOrderId(order);
  const customerName = getCustomerName(order);
  const plan = getPlan(order);
  const activationCode = getActivationCode(order);
  const fromEmail = process.env.FROM_EMAIL || "noreply@elephtvcode.store";

  try {
    if (!process.env.SMTP_PASS) {
      console.log("SMTP password missing");
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !emailTo) {
      throw new Error("SMTP settings or order.email are missing");
    }

    const transporter = createSmtpTransporter();

    console.log("Sending activation email to...", emailTo);

    await transporter.sendMail({
      from: `"ElephTv" <${fromEmail}>`,
      to: emailTo,
      subject: "Your ElephTv Activation Code",
      text: [
        `Customer name: ${customerName}`,
        `Order ID: ${orderId}`,
        `Plan: ${plan}`,
        `Activation code: ${activationCode}`,
        "Support: support@elephtvcode.store",
      ].join("\n"),
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#111827;">
          <h1>Your ElephTv Activation Code</h1>
          <p>Hello ${customerName},</p>
          <p>Your activation code is ready.</p>
          <ul>
            <li><strong>Order ID:</strong> ${orderId}</li>
            <li><strong>Plan:</strong> ${plan}</li>
            <li><strong>Activation code:</strong> ${activationCode}</li>
          </ul>
          <p>Need help? Contact support@elephtvcode.store.</p>
        </div>
      `,
    });

    console.log("Activation email sent");
    return true;
  } catch (error) {
    console.error("Activation email failed", error);
    return false;
  }
}

app.get("/orders", async (_req, res) => {
  try {
    const orders = await readOrders();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/codes", async (_req, res) => {
  try {
    const codes = normalizeCodes(await readCodes());
    res.json({ success: true, codes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/analytics", async (_req, res) => {
  try {
    const orders = await readOrders();
    const codes = normalizeCodes(await readCodes());

    res.json({
      success: true,
      analytics: {
        totalOrders: orders.length,
        totalCodes: codes.length,
        availableCodes: codes.filter((code) => code.status === "Available").length,
        usedCodes: codes.filter((code) => code.status === "Used").length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.patch("/orders/:orderId/deliver", async (req, res) => {
  try {
    const orders = await readOrders();
    const orderIndex = orders.findIndex((order) => getOrderId(order) === req.params.orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const activationCode = await assignActivationCode(orders[orderIndex]);

    orders[orderIndex] = {
      ...orders[orderIndex],
      email: getOrderEmail(orders[orderIndex]),
      activationCode,
      codeDelivered: activationCode,
      deliveryStatus: "Delivered",
      deliveredAt: new Date().toISOString(),
    };

    await saveOrders(orders);

    const emailSent = await sendActivationEmail(orders[orderIndex]);

    res.json({
      success: true,
      order: orders[orderIndex],
      activationCode,
      emailSent,
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`ElephTv server running on port ${port}`);
});
