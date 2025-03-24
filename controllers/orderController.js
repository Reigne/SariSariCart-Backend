const OrderModel = require("../models/order");
const ProductModel = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const { items, deliveryInformation, paymentMethod } = req.body;

    console.log(req.body, "req body");
    const userId = req.user._id; // Assuming the user ID is coming from the authenticated user

    // console.log(userId, "user id");
    // Calculate the total amount
    let totalAmount = 0;
    for (const item of items) {
      const product = await ProductModel.findById(item.product);
      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }
      totalAmount += product.price * item.quantity;
    }

    // Create a new order
    const order = await OrderModel.create({
      user: userId,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      statusHistory: {
        status: "Pending",
        comment: "Order is pending.",
      },
      deliveryInformation,
      paymentMethod,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    // console.log(error);
    next(error);
    // return next(/new ErrorHandler("Error creating order", 500));
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate(
      "user items.product"
    );

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders for the authenticated user
// exports.getMyOrders = async (req, res, next) => {
//   try {
//     const orders = await OrderModel.find({ user: req.user._id }).populate(
//       "items.product"
//     );

//     res.status(200).json({
//       success: true,
//       orders,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you're using authentication and have access to the user's ID

    // Get query parameter for status, default to 'all'
    const status = req.query.status || "all";

    // Create filter based on status
    let filter = { user: userId };

    switch (status) {
      case "pending":
        filter.status = "Pending";
        break;
      case "to-ship":
        filter.status = "Confirmed";
        break;
      case "to-receive":
        filter.status = { $in: ["Shipped", "Delivered"] };
        break;
      case "completed":
        filter.status = "Completed";
        break;
      case "cancelled":
        filter.status = "Cancelled";
        break;
      default:
        // 'all' case or any other invalid status, fetch all orders
        break;
    }

    // Fetch orders based on the filter
    // const orders = await OrderModel.find(filter);
    const orders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "items.product",
        populate: {
          path: "category", // Populate the category field within the product
          model: "Category",
        },
      });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching orders.",
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    let order = await OrderModel.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }

    // Generate appropriate comment based on status
    let statusComment;
    switch (status) {
      case "Pending":
        statusComment =
          "Your order has been placed and is awaiting confirmation.";
        break;
      case "Confirmed":
        statusComment = "Your order has been confirmed and is being prepared.";
        break;
      case "Shipped":
        statusComment = "Your order has been shipped from our warehouse.";
        break;
      case "Out for Delivery":
        statusComment = "Your order is out for delivery and will arrive soon.";
        break;
      case "Delivered":
        statusComment =
          "Your order has been successfully delivered to the shipping address.";
        order.deliveredAt = Date.now();
        break;
      case "Completed":
        statusComment =
          "Your order has been completed. Thank you for shopping with us!";
        break;
      case "Cancelled":
        statusComment =
          "Your order has been cancelled. For any questions, please contact support.";
        break;
      default:
        statusComment = "Order status has been updated.";
    }

    // Add status to history
    order.statusHistory.push({
      status,
      comment: statusComment,
      changedAt: Date.now(),
    });

    // Update current status
    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders (for admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find().populate("user items.product");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
