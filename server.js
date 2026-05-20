const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/assets", express.static("assets"));

app.post("/createOrder", async (req, res) => {
  const { amount, customer_id, customer_phone, customer_name, customer_email } =
    req.body;

  const payload = {
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id,
      customer_phone: customer_phone,
      customer_name: customer_name || "",
      customer_email: customer_email || "",
    },
    order_meta: {
      return_url:
        "https://pg-integration.onrender.com/return?order_id={order_id}",
      // payment_methods: "cash",
    },


    products: {
      one_click_checkout: {
        enabled: true,
        conditions: [
          {
            action: "ALLOW",
            values: ["checkoutCollectAddress", "checkoutAuthenticate"],
            // values: ["checkoutCollectAddress", "checkoutAuthenticate", "skipInitialAuthentication"],
            key: "features",
          }
        ],
      },
    },
    cart_details: {
      cart_items: [
        {
          item_id: "DEMO_ITEM_001",
          item_name: "Demo Product",
          item_description: "Sample product description",
          item_details_url: "https://example.com/product/demo",
          item_image_url: "https://placehold.co/400x400?text=Product",
          item_original_unit_price: amount,
          item_discounted_unit_price: amount,
          item_quantity: 1,
          item_currency: "INR",
        },
      ],
    },
  };

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "x-api-version": "2022-09-01",
      "x-client-id": process.env.APP_ID,
      "x-client-secret": process.env.APP_SECRET,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const CFresponse = await fetch(
      "https://sandbox.cashfree.com/pg/orders",
      options
    );
    const data = await CFresponse.json();

    if (!CFresponse.ok) {
      throw new Error(data.message || "Failed to create order");
    }

    const { payment_session_id, order_id } = data;
    res.json({ success: true, payment_session_id, order_id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/return", (req, res) => {
  res.sendFile(__dirname + "/public/return.html");
});

app.post("/verifyPayment", async (req, res) => {
  const { order_id } = req.body;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-api-version": "2022-09-01",
      "x-client-id": process.env.APP_ID,
      "x-client-secret": process.env.APP_SECRET,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(
      `https://sandbox.cashfree.com/pg/orders/${order_id}`,
      options
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to verify payment");
    }

    res.json({ success: true, order_status: data.order_status });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});