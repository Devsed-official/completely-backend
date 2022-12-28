import Order from "../models/Order.js";

export default {
  getOrderDetails: async (req, res) => {
    try {
      let orderIds = req.body.orderIds;
      const orders = await Order.getOrderDetailsByIds(orderIds);
      return res.status(200).json({ success: true, orders });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  },
};
