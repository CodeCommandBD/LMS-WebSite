import Coupon from "../models/coupon.model.js";

// 1. Create Coupon (Admin)
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountAmount, expiresAt, usageLimit, minPurchaseAmount } = req.body;

    // Check if code exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountAmount,
      expiresAt: new Date(expiresAt),
      usageLimit,
      minPurchaseAmount,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get All Coupons (Admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, coupons });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Delete Coupon (Admin)
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Coupon deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Validate Coupon (User)
export const validateCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    // Check if expired
    if (new Date() > coupon.expiresAt) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    // Check usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }

    // Check minimum purchase
    if (totalAmount < coupon.minPurchaseAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum purchase of ৳${coupon.minPurchaseAmount} required for this coupon.` 
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (totalAmount * coupon.discountAmount) / 100;
    } else {
      discount = coupon.discountAmount;
    }

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      discount: Math.round(discount),
      couponCode: coupon.code
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
