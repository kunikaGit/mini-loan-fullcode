# Mini-Loan-App

This is the frontend code for a mini-loan application web app built with React.js. The app allows authenticated users to go through a loan application process, view their loans, and submit weekly repayments.

## Introduction

This React.js application provides a user-friendly interface for customers to create, view, and manage their loans. Admins can also approve loan requests.

## Features

1. **Loan Creation:**
   - Customers can submit a loan request with the amount required and loan term.
   - Scheduled repayments are generated automatically with a weekly repayment frequency.

2. **Loan Approval:**
   - Admins can change the state of pending loans to approved.

3. **Loan View:**
   - Customers can view their own loans using a policy check to ensure privacy.

4. **Repayments:**
   - Customers can add repayments equal to or greater than the scheduled repayment amount.
   - Repayments update to PAID status, and if all repayments for a loan are PAID, the loan becomes PAID.

## Getting Started

### Prerequisites

- Node.js installed
- NPM (Node Package Manager) installed

### Installation
npm i

### Run code
Make sure first you ran the backend code
then , run frontend by
npm start