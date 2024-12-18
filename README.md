# Full Stack React Native App with Razorpay Payment Gateway Integration

This project is a **full-stack React Native** application integrated with **Razorpay Payment Gateway**. The app allows users to enter payment details, which are processed through Razorpay. The backend, built with **Node.js**, **Express**, and **MongoDB**, manages the order creation, payment verification, and stores the payment details.

### Key Features:

-   User-friendly interface for entering payment details (amount, name, email, and contact number).
-   The backend creates an order using the Razorpay API.
-   Seamless payment flow with Razorpay checkout integration.
-   Payment verification via the Razorpay API to ensure successful transaction completion.
-   Real-time updates on the payment status.

---

## Prerequisites

Before starting, ensure you have the following set up:

### 1. React Native Environment

-   Make sure you have **React Native** environment set up. Follow the official guide for setting up React Native for Android: [React Native Environment Setup](https://reactnative.dev/docs/environment-setup).

### 2. MongoDB

-   Ensure **MongoDB** is installed and running on your system. If not, follow the installation guide: [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/).

---

## .env Configuration

### Frontend (`React Native`):

In the root of your **frontend** project, create a `.env` file and set the following:

```env
API_URL = # Backend URL (e.g., http://localhost:8000)
RAZORPAY_KEY_ID = # Your Razorpay Key ID
```

### Backend (`Node.js & Express`):

In the root of your **frontend** project, create a `.env` file and set the following:

```env
PORT = 8000
NODE_ENV = development
MONGODB_URL = mongodb://localhost:27017
RAZORPAY_KEY_ID = # Your Razorpay Key ID
RAZORPAY_KEY_SECRET = # Your Razorpay Key Secret
```

---

## Running the Project

### Frontend (`React Native`):

1. Navigate to the frontend directory:

    ```bash
    cd Payment
    ```

2. Install the necessary dependencies:
    ```bash
    npm install
    ```
3. Run the app on your physical Android device:
    ```bash
    npm run android
    ```
    Ensure you are using a physical device, as Razorpay checkout may not work correctly on emulators.

### Backend (`Node.js & Express`):

1. Navigate to the backend directory:

    ```bash
    cd server
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the backend server in development mode:
    ```bash
    npm run dev
    ```

---

## Using ngrok to Generate a Public API URL

### Why Use ngrok?

When developing this project locally, the backend server (running on port 8000) is only accessible within your local network. However, services like **Razorpay** require a publicly accessible URL to communicate with your backend, especially for payment verification. This is where **ngrok** comes in.

**ngrok** creates a secure tunnel from a public URL (e.g., `http://xyz123.ngrok.io`) to your locally running backend, making it accessible over the internet. This allows Razorpay's API to communicate with your local server even though it's running in your local development environment.

### Steps to Use ngrok:

1. **Install ngrok**:
   If you haven't already, install **ngrok** by following the instructions on the [ngrok website](https://ngrok.com/download).

2. **Start ngrok**:
   After installing **ngrok**, open a terminal and run the following command to expose your local backend server running on port 8000:

    ```bash
    ngrok http http://localhost:8000
    ```

---

## Thank You!

If you have any questions, issues, or suggestions, feel free to reach out. We hope this project helps you in integrating Razorpay with your React Native app. Happy coding, and good luck with your payment gateway integration! 😊

If you found this project helpful, consider starring it on GitHub ⭐️!

Good luck and happy coding! 🚀
