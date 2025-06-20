# BiteSpeed Identity Reconciliation - Backend Assignment

This is my submission for the BiteSpeed backend assignment. It implements an identity reconciliation API that consolidates contact information based on shared email addresses or phone numbers.

I am not an expert in ReactJS or TypeScript — I built this project with the help of an AI tool (ChatGPT), and through that process, I learned a lot about backend development and data handling using Prisma, Express, and TypeScript.

---

## 📌 Problem Statement

The goal is to build a service that can receive an email or phone number and return a unified identity, linking related contacts together (primary and secondary).

---

## 🧪 Endpoint

### `POST /identify`
### 'http://localhost:3000/identify'
### `POST https://bitespeed-identify-app.onrender.com/identify` `:) {render api call url}`

#### Request Body:
```json
{
  "email": "user@example.com",
  "phoneNumber": "1234567890"
}