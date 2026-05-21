# Cashfree One Click Checkout (OCC) Demo

A demo storefront showcasing Cashfree's Payment Gateway with One Click Checkout (OCC) integration.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A Cashfree account with API credentials ([sign up](https://merchant.cashfree.com/merchants/signup))

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd "Custom OCC demo"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   APP_ID=your_cashfree_app_id
   APP_SECRET=your_cashfree_app_secret
   ```

   For sandbox testing, use credentials from the [Cashfree sandbox dashboard](https://merchant.cashfree.com/merchants/login).

## Running the project

```bash
npm start
```

The server starts on **http://localhost:3000** using `nodemon` (auto-restarts on file changes).

## Project structure

```
.
├── server.js          # Express server — order creation & payment verification APIs
├── public/
│   ├── index.html     # Checkout page (storefront UI)
│   └── return.html    # Payment return/confirmation page
├── assets/
│   ├── css/style.css  # Styles
│   └── js/script.js   # Frontend logic (Cashfree JS SDK)
└── .env               # API credentials (not committed)
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/createOrder` | Creates a Cashfree order and returns `payment_session_id` |
| `POST` | `/verifyPayment` | Fetches order status by `order_id` |
| `GET`  | `/return` | Serves the post-payment return page |

## OCC features enabled

The integration enables One Click Checkout with the following features:

- `checkoutCollectAddress` — collects shipping address during checkout
- `checkoutAuthenticate` — authenticates the customer via OCC

## Sandbox vs Production

The server targets the **Cashfree sandbox** (`sandbox.cashfree.com`) by default. To switch to production, update the fetch URLs in [server.js](server.js) to `api.cashfree.com`.
