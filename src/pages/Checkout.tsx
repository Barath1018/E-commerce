import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../firebase/config";
// Assume this runs after payment is successful
const saveOrder = async (orderData: { productName: any; price: any; quantity: any; }) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    await addDoc(collection(firestore, "users", user.uid, "orders"), {
      productName: orderData.productName,
      price: orderData.price,
      quantity: orderData.quantity,
      timestamp: serverTimestamp(),
    });
    console.log("Order saved!");
  } catch (err) {
    console.error("Failed to save order:", err);
  }
};
