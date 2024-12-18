/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import {RAZORPAY_KEY_ID, API_URL} from '@env';

function App() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }

    if (!name || !email || !contact) {
      alert('Missing Information', 'Please fill in all details.');
      return;
    }

    setLoading(true);

    // Step 1: Create an order by calling the backend API
    const response = await fetch(`${API_URL}/api/v1/razorpay/create-order`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({amount, email, contact, name}),
    });

    const data = await response.json();

    if (!data.id) {
      throw new Error('Order ID not received.');
    }

    // Step 2: Open Razorpay Checkout
    const options = {
      description: 'Payment towards order',
      image:
        'https://razorpay.com/docs/build/browser/static/razorpay-docs-light.009264f2.svg',
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      amount: data.amount * 100, // Amount in paise
      name: 'Razorpay Payment',
      order_id: data.id,
      prefill: {
        email: data.customer_email,
        contact: data.customer_contact,
        name: data.customer_name,
      },
      theme: {color: '#53a20e'},
    };

    RazorpayCheckout.open(options)
      .then(paymentData => {
        // Step 3: Verify payment on the backend
        fetch(`${API_URL}/api/v1/razorpay/verify-payment`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({paymentData}),
        })
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              alert(
                `Payment Successful. name: ${result.name}, amount: ${result.amount}`,
              );
            } else {
              alert('Payment Verification Failed', 'Please try again.');
            }
          });
      })
      .catch(error => {
        alert('Payment Error', error);
        setLoading(false);
      });
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Enter Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount in INR"
        placeholderTextColor="#000"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#000"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#000"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        placeholderTextColor="#000"
        keyboardType="phone-pad"
        value={contact}
        onChangeText={setContact}
      />
      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : 'Pay Now'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    color: '#000',
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    color: '#000',
    borderWidth: 1,
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#53a20e',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
