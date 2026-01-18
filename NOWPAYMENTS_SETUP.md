# NOWPayments Integration Setup Guide

## Overview
NOWPayments has been integrated into your application to handle cryptocurrency payments for traffic packages.

## Setup Instructions

### 1. Get NOWPayments API Credentials

1. Sign up at [NOWPayments](https://nowpayments.io/)
2. Go to Settings > API Keys
3. Generate a new API key
4. Generate an IPN secret for webhook verification

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
NOWPAYMENTS_API_KEY=your_nowpayments_api_key
NOWPAYMENTS_IPN_SECRET=your_nowpayments_ipn_secret
NEXT_PUBLIC_NOWPAYMENTS_ENABLED=true
```

### 3. Configure IPN Webhook

In your NOWPayments dashboard:
1. Go to Settings > IPN/Callbacks
2. Set IPN callback URL to: `https://yourdomain.com/api/payments/nowpayments/webhook`
3. Make sure IPN is enabled

**Important:** The webhook endpoint verifies the signature using HMAC-SHA512. Make sure your IPN secret matches.

### 4. Test in Sandbox Mode

NOWPayments provides a sandbox environment:
1. Use sandbox API URL: `https://api-sandbox.nowpayments.io/v1`
2. Update the API URL in the route files if testing in sandbox
3. Use sandbox credentials

### 5. Database Integration

The webhook handler includes TODO comments where you need to:
- Add traffic to user's account
- Log transactions
- Update user's traffic expiry date

Update these sections in `/app/api/payments/nowpayments/webhook/route.ts`:

```typescript
// Example with Prisma:
await prisma.user.update({
  where: { clerkId: userId },
  data: {
    trafficGB: { increment: trafficGB },
    trafficExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
});

await prisma.transaction.create({
  data: {
    userId,
    type: 'CRYPTO',
    amount: amountPaid,
    currency: data.price_currency,
    trafficGB,
    paymentId: data.payment_id,
    status: 'COMPLETED',
  },
});
```

## API Endpoints Created

### 1. Create Payment
**POST** `/api/payments/nowpayments/create-payment`

Creates a new crypto payment and returns a payment URL.

Request body:
```json
{
  "amount": 55.00,
  "trafficGB": 50,
  "email": "user@example.com"
}
```

Response:
```json
{
  "paymentId": "12345678",
  "paymentUrl": "https://nowpayments.io/payment/?iid=...",
  "orderId": "traffic_userId_timestamp",
  "amount": 55.00,
  "currency": "usd"
}
```

### 2. Webhook Handler
**POST** `/api/payments/nowpayments/webhook`

Receives IPN callbacks from NOWPayments when payment status changes.

Handles payment statuses:
- `finished` / `confirmed` - Payment successful
- `waiting` / `sending` - Payment in progress
- `failed` / `expired` / `refunded` - Payment failed
- `partially_paid` - Partial payment received

### 3. Payment Status Check
**GET** `/api/payments/nowpayments/status?paymentId=xxx`

Query payment status on-demand.

Response:
```json
{
  "paymentId": "12345678",
  "paymentStatus": "finished",
  "payAmount": "0.0015",
  "payCurrency": "btc",
  "priceAmount": 55.00,
  "priceCurrency": "usd",
  "orderId": "traffic_userId_timestamp",
  "paymentUrl": "https://..."
}
```

## Frontend Integration

The "Pay with Crypto" button in `/app/dashboard/addTraffic/page.tsx` now:
1. Creates a payment via the API
2. Redirects user to NOWPayments checkout
3. User completes payment with their chosen cryptocurrency
4. Webhook automatically adds traffic to their account
5. User is redirected to success page

## Supported Cryptocurrencies

NOWPayments supports 200+ cryptocurrencies including:
- Bitcoin (BTC)
- Ethereum (ETH)
- USDT (TRC20, ERC20, BEP20)
- USDC
- Litecoin (LTC)
- And many more...

Users can choose their preferred cryptocurrency during checkout.

## Security Features

1. **HMAC-SHA512 Signature Verification**: All webhooks are verified
2. **IPN Secret**: Ensures webhooks come from NOWPayments
3. **Order ID Validation**: Prevents replay attacks
4. **Clerk Authentication**: Only authenticated users can create payments

## Testing

1. Create a test payment with a small amount
2. Use NOWPayments testnet if available
3. Monitor webhook calls in your logs
4. Verify traffic is added to user account
5. Check transaction logging

## Production Checklist

- [ ] Add actual NOWPayments API key to `.env.local`
- [ ] Add IPN secret to `.env.local`
- [ ] Configure IPN callback URL in NOWPayments dashboard
- [ ] Update database integration in webhook handler
- [ ] Test end-to-end flow with real crypto
- [ ] Set up monitoring for failed payments
- [ ] Configure success/cancel redirect URLs
- [ ] Add transaction history UI for users

## Support

- NOWPayments Docs: https://documenter.getpostman.com/view/7907941/S1a32n38
- NOWPayments Support: support@nowpayments.io
- API Status: https://nowpayments.io/status

## Notes

- Payments are one-time purchases for traffic
- Traffic validity: 1 year from purchase
- Fees can be paid by user or merchant (currently set to user)
- Payment amounts are in USD by default
- No subscription support (use Stripe for subscriptions)
