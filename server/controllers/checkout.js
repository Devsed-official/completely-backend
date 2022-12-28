import OrderModel, { STATUS } from "../models/Order.js";
import JobDetailsModel from "../models/JobDetails.js";
import User from "../models/User.js";
import Stripe from "stripe";
import Order from "../models/Order.js";
const stripe = new Stripe(
  "sk_test_51H2fveBDmy6MUD5rB4X2wMJsdIY0lBvczpcQgYIhksnLIlVQTQ08VMRc6xQsy4fiI4m6V1I7OZVM57XaIbtMxqEd002xV4xd6A"
);

export default {
  createOrder: async (req, res) => {
    console.log(req.body)
    try {
      let cart = req.body;
      let orderObj = {
        status: STATUS.CREATED,
        potentialProfessionals: [],
        ...cart
      }
      const order = await Order.createOrder(orderObj);
      const orderId = order._id.toString()
      const session = await stripe.checkout.sessions.create({
        success_url: `http://localhost:8100/order/paymentsuccess/{CHECKOUT_SESSION_ID}/${orderId}`,
        cancel_url: 'http://localhost:8100/order/paymentfailed',
        line_items: [
          {
            price_data: {
              currency: 'chf',
              product_data: {
                name: 'Completely Services',
                metadata: {
                  orderId: orderId
                }
              },
              unit_amount: Math.ceil(Number(cart.grandTotal) * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
      });
      return res.status(200).json({ url: session.url })
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      let order = await OrderModel.updateStatus(req.params.id, req.body);
      return res.status(200).json({ success: true, order });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
};
