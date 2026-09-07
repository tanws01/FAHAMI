# 🛡️ AI Money Guardian

### Your financial bouncer.

**AI Money Guardian** is a hackathon demo showing how an AI agent can make a spending decision using a **verifiable agent identity** and **privacy-preserving financial credentials**.

> Instead of asking an AI to trust your salary, bank balance or screenshots, prove only what the agent needs to know.

## The 10-second demo

1. Enter **RM4,999** → 🔴 **ACCESS DENIED**
2. Enter **RM500** → 🟢 **ACCESS GRANTED**
3. Show the audit trail: agent identity → credential verification → policy evaluation → decision.

## Why this fits the T3N ADK challenge

| Hackathon capability | Money Guardian |
|---|---|
| **Verifiable agent identity** | Agent authenticates with its own T3N identity before protected calls. |
| **Privacy-preserving KYC / credentials** | The policy asks only for `identity_status`, `income_tier`, and `safe_spend_limit`; raw identity, IC, bank account and exact salary stay hidden. |
| **Secure data access** | The T3N adapter sends a minimum-attribute request to a tenant-scoped contract instead of exposing a financial profile to the browser. |
| **Auditable action** | Every decision gets an audit ID and records the policy used. |

The T3N adapter follows the same connection pattern as Terminal 3's reference ADK demo: `setEnvironment` → WASM component → agent address → handshake → authentication → `executeAndDecode`. fileciteturn12file0

## Architecture

```text
User: “Can I spend RM4,999?”
              │
              ▼
       AI Money Guardian
              │
       T3N agent identity
              │
              ▼
   Selective credential request
   ┌──────────────────────────┐
   │ identity: VERIFIED       │
   │ income tier: RM5k–7,999  │  ← disclosed
   │ safe limit: RM1,200      │  ← disclosed
   └──────────────────────────┘
              │
              ▼
       Spending policy
       RM4,999 > RM1,200
              │
              ▼
        🔴 DENIED + audit ID
```

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4173`.

### T3N mode

Copy `.env.example` to `.env` and provide the hackathon T3N credentials/configuration. The server will use the T3N adapter when `AGENT_KEY` and `T3N_TENANT_DID` are present. The contract function is configurable with `T3N_VERIFY_FUNCTION` because the exact credential contract deployed for the hackathon may differ.

Without those values, the UI runs in clearly-labelled **demo mode** with synthetic credentials. No real bank data is used.

## Demo script

> “This isn't another budgeting app. It's a bouncer for your money.”
>
> “I ask the agent to approve RM4,999. Before it answers, the agent authenticates its own identity and requests only three financial attributes.”
>
> “It does NOT need my IC, bank account, exact salary or transaction history.”
>
> “My verified safe-spend limit is RM1,200. RM4,999 is denied. RM500 is approved.”
>
> “The important part isn't the decision. It's that an agent can act on verified information without receiving the sensitive information itself.”

## Important

This is a hackathon prototype using synthetic/demo financial data. It is an affordability-rule demonstration, **not financial advice** and does not connect to a real bank account or execute real payments.
