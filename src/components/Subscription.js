import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Subscription = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!auth.currentUser) return;

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setSubscription(userSnap.data());
      }
      setLoading(false);
    };

    fetchSubscription();
  }, []);

  const handleSubscribe = async (plan) => {
    if (!auth.currentUser) {
      alert("You need to be logged in to subscribe.");
      return;
    }

    const userRef = doc(db, "users", auth.currentUser.uid);
    try {
      await updateDoc(userRef, { 
        isSubscribed: true, 
        subscriptionPlan: plan, 
        billingCycle 
      });

      setSubscription({
        isSubscribed: true,
        subscriptionPlan: plan,
        billingCycle
      });

      alert(`Successfully subscribed to ${plan} (${billingCycle})!`);
      navigate("/dashboard/gaming-skill-assessment");
    } catch (error) {
      console.error("Subscription update failed:", error);
      alert("⚠️ Failed to update subscription. Try again later.");
    }
  };

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-4xl mx-auto mt-6 text-white">
      <h2 className="text-3xl font-bold mb-6">Choose Your Subscription</h2>

      {/* Toggle Billing Cycle */}
      <div className="flex justify-center mb-6">
        <button
          className={`p-3 px-6 ${billingCycle === "monthly" ? "bg-blue-600" : "bg-gray-700"} rounded-l-lg`}
          onClick={() => setBillingCycle("monthly")}
        >
          Monthly
        </button>
        <button
          className={`p-3 px-6 ${billingCycle === "yearly" ? "bg-blue-600" : "bg-gray-700"} rounded-r-lg`}
          onClick={() => setBillingCycle("yearly")}
        >
          Yearly
        </button>
      </div>

      {/* Subscription Plans */}
      {loading ? (
        <p className="text-center text-gray-400">Loading subscription data...</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* Advanced Plan */}
          <div className={`p-6 rounded-lg shadow-md ${subscription?.subscriptionPlan === "Advanced" ? "bg-green-700" : "bg-gray-800"}`}>
            <h3 className="text-xl font-bold">🎮 Advanced Plan</h3>
            <p className="mt-2 text-gray-400">$69 / {billingCycle}</p>
            {subscription?.subscriptionPlan === "Advanced" ? (
              <button className="mt-4 w-full p-3 bg-gray-500 rounded-lg text-white font-semibold cursor-not-allowed">
                ✅ Subscribed
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe("Advanced")}
                className="mt-4 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700"
              >
                {subscription?.isSubscribed ? "Switch to Advanced" : "Subscribe"}
              </button>
            )}
          </div>

          {/* Pro Plan */}
          <div className={`p-6 rounded-lg shadow-md ${subscription?.subscriptionPlan === "Pro" ? "bg-green-700" : "bg-gray-800"}`}>
            <h3 className="text-xl font-bold">🚀 Pro Plan</h3>
            <p className="mt-2 text-gray-400">$159 / {billingCycle}</p>
            {subscription?.subscriptionPlan === "Pro" ? (
              <button className="mt-4 w-full p-3 bg-gray-500 rounded-lg text-white font-semibold cursor-not-allowed">
                ✅ Subscribed
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe("Pro")}
                className="mt-4 w-full p-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700"
              >
                {subscription?.isSubscribed ? "Switch to Pro" : "Subscribe"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;