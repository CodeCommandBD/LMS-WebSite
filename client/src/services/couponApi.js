import api from "@/lib/api";

export const getAllCoupons = async () => {
    const response = await api.get("/coupons/all");
    return response.data;
};

export const createCoupon = async (couponData) => {
    const response = await api.post("/coupons/create", couponData);
    return response.data;
};

export const deleteCoupon = async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
};

export const validateCoupon = async (code, totalAmount) => {
    const response = await api.post("/coupons/validate", { code, totalAmount });
    return response.data;
};
