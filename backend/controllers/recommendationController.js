import Appointment from "../models/Appointments.js";
import Recommendation from "../models/Recommendation.js";


// GET recommendations for a user
export const getRecommendationsForUser = async (req, res) => {
  try {
    const data = await Recommendation.findOne({ userId: req.params.userId })
      .populate("recommendedServices")
      .populate("recommendedProducts");

    res.json(data || { recommendedServices: [], recommendedProducts: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const generateRecommendationsForUser = async (userId) => {
  const appts = await Appointment.find({ userId });

  const serviceFrequency = {};
  const productFrequency = {};

  appts.forEach(app => {
    const sId = app.serviceId.toString();
    serviceFrequency[sId] = (serviceFrequency[sId] || 0) + 1;

    app.productIds.forEach(pId => {
      const p = pId.toString();
      productFrequency[p] = (productFrequency[p] || 0) + 1;
    });
  });

  // Sort and get top 3 services/products
  const topServices = Object.entries(serviceFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  const topProducts = Object.entries(productFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  await Recommendation.findOneAndUpdate(
    { userId },
    {
      userId,
      recommendedServices: topServices,
      recommendedProducts: topProducts,
      lastUpdated: new Date()
    },
    { upsert: true }
  );
};
