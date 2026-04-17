import Cart from "../models/cart.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

// 1. Get User Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId }).populate({
      path: "items.courseId",
      select: "courseTitle subTitle price courseThumbnail creator",
      populate: {
        path: "creator",
        select: "name",
      },
    });

    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Check if user is already enrolled
    const user = await User.findById(userId);
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [{ courseId }] });
    } else {
      // Check if item already in cart
      const exists = cart.items.some((item) => item.courseId.toString() === courseId);
      if (exists) {
        return res.status(400).json({
          success: false,
          message: "Course already in cart.",
        });
      }

      cart.items.push({ courseId });
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Added to cart successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.courseId.toString() !== courseId);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Removed from cart",
      cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Clear Cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
