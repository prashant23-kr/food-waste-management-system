// =====================================================
// FOOD WASTE HACKATHON - BACKEND SERVER
// =====================================================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const FoodDonation = require("./models/FoodDonation");
const User = require("./models/User");
const { authenticateUser, authorizeRole } = require("./middleware/auth");

const app = express();

app.use(cors());

// =====================================================
// CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });

// =====================================================
// HEALTH CHECK API
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy ✅",
  });
});

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

// POST /api/auth/donor/register
app.post("/api/auth/donor/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "donor",
      phone: phone || "",
      address: address || "",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Donor account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/auth/ngo/register
app.post("/api/auth/ngo/register", async (req, res) => {
  try {
    const { organizationName, contactPerson, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name: contactPerson,
      email,
      password,
      role: "ngo",
      phone: phone || "",
      address: address || "",
      organizationName: organizationName || "",
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "NGO account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/auth/donor/login
app.post("/api/auth/donor/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "donor" });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/auth/ngo/login
app.post("/api/auth/ngo/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "ngo" });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationName: user.organizationName,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/auth/me
app.get("/api/auth/me", authenticateUser, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      address: req.user.address,
      organizationName: req.user.organizationName,
      createdAt: req.user.createdAt,
    },
  });
});

// PATCH /api/auth/me
app.patch("/api/auth/me", authenticateUser, async (req, res) => {
  try {
    const { name, phone, address, organizationName } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (organizationName !== undefined) user.organizationName = organizationName;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        organizationName: user.organizationName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// DONATION ROUTES (PUBLIC - for public dashboard)
// =====================================================

app.get("/api/donations", async (req, res) => {
  try {
    const donations = await FoodDonation.find();

    res.json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    console.error("Get donations error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// POST /api/donations (protected - donor creates donation)
app.post("/api/donations", authenticateUser, authorizeRole("donor"), async (req, res) => {
  try {
    const donationData = {
      ...req.body,
      donorId: req.user._id,
      donorName: req.user.name,
    };

    const donation = await FoodDonation.create(donationData);

    res.status(201).json({
      success: true,
      message: "Donation created successfully",
      data: donation,
    });
  } catch (error) {
    console.error("Create donation error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/donations/my (donor's own donations)
app.get("/api/donations/my", authenticateUser, authorizeRole("donor"), async (req, res) => {
  try {
    const donations = await FoodDonation.find({ donorId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/donations/:id (owner or assigned NGO can view)
app.get("/api/donations/:id", authenticateUser, async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    const isOwner = donation.donorId.toString() === req.user._id.toString();
    const isAssignedNGO = donation.ngoId && donation.ngoId.toString() === req.user._id.toString();

    if (!isOwner && !isAssignedNGO && req.user.role !== "ngo") {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to view this donation",
      });
    }

    res.json({
      success: true,
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// PATCH /api/donations/:id/accept (NGO accepts donation)
app.patch("/api/donations/:id/accept", authenticateUser, authorizeRole("ngo"), async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    if (donation.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "This donation is no longer available",
      });
    }

    donation.ngoId = req.user._id;
    donation.ngoName = req.user.organizationName || req.user.name;
    donation.status = "Accepted";
    await donation.save();

    res.json({
      success: true,
      message: "Donation accepted successfully",
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// PATCH /api/donations/:id/status (update donation status)
app.patch("/api/donations/:id/status", authenticateUser, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Pending", "Accepted", "Scheduled", "Picked Up", "Delivered", "Rejected", "Wasted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const donation = await FoodDonation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    const isOwner = donation.donorId.toString() === req.user._id.toString();
    const isAssignedNGO = donation.ngoId && donation.ngoId.toString() === req.user._id.toString();

    if (!isOwner && !isAssignedNGO) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this donation",
      });
    }

    donation.status = status;
    await donation.save();

    res.json({
      success: true,
      message: "Donation status updated",
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET /api/ngo/donations (NGO sees available/accepted donations)
app.get("/api/ngo/donations", authenticateUser, authorizeRole("ngo"), async (req, res) => {
  try {
    const donations = await FoodDonation.find({
      $or: [
        { status: "Pending", ngoId: null },
        { ngoId: req.user._id },
      ],
    })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// ANALYTICS API (public - for public dashboard)
// =====================================================

app.get("/api/analytics", async (req, res) => {
  try {
    const donations = await FoodDonation.find();

    const totalFoodDonated = donations.reduce(
      (sum, donation) => sum + Number(donation.foodQuantity || 0),
      0
    );

    const totalFoodDistributed = donations.reduce(
      (sum, donation) => sum + Number(donation.distributedQuantity || 0),
      0
    );

    const totalFoodWasted = donations.reduce(
      (sum, donation) => sum + Number(donation.wastedQuantity || 0),
      0
    );

    const deliveredCount = donations.filter(
      (donation) => donation.status === "Delivered"
    ).length;

    const deliveryRate =
      donations.length > 0
        ? Number(((deliveredCount / donations.length) * 100).toFixed(2))
        : 0;

    const pickupTimes = donations
      .map((donation) => Number(donation.pickupTime))
      .filter((time) => !isNaN(time));

    const averagePickupTime =
      pickupTimes.length > 0
        ? Number((pickupTimes.reduce((sum, time) => sum + time, 0) / pickupTimes.length).toFixed(2))
        : 0;

    const categoryMap = {};
    donations.forEach((donation) => {
      const category = donation.foodCategory || "Unknown";
      if (!categoryMap[category]) categoryMap[category] = 0;
      categoryMap[category] += Number(donation.foodQuantity || 0);
    });
    const donationsByCategory = Object.entries(categoryMap).map(([category, quantity]) => ({
      category,
      quantity,
    }));

    const locationMap = {};
    donations.forEach((donation) => {
      const location = donation.location || "Unknown";
      if (!locationMap[location]) locationMap[location] = 0;
      locationMap[location] += Number(donation.foodQuantity || 0);
    });
    const donationsByLocation = Object.entries(locationMap).map(([location, quantity]) => ({
      location,
      quantity,
    }));

    const donorMap = {};
    donations.forEach((donation) => {
      const donor = donation.donorName || "Unknown";
      if (!donorMap[donor]) donorMap[donor] = 0;
      donorMap[donor] += Number(donation.foodQuantity || 0);
    });
    const topDonors = Object.entries(donorMap)
      .map(([donorName, quantity]) => ({ donorName, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const ngoMap = {};
    donations.forEach((donation) => {
      const ngo = donation.ngoName || "Unknown";
      if (!ngoMap[ngo]) ngoMap[ngo] = 0;
      ngoMap[ngo] += Number(donation.distributedQuantity || 0);
    });
    const topNGOs = Object.entries(ngoMap)
      .map(([ngoName, quantity]) => ({ ngoName, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.json({
      success: true,
      totalFoodDonated,
      totalFoodDistributed,
      totalFoodWasted,
      deliveryRate,
      averagePickupTime,
      donationsByCategory,
      donationsByLocation,
      topDonors,
      topNGOs,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// DONATION TRENDS API
// =====================================================

app.get("/api/trends", async (req, res) => {
  try {
    const donations = await FoodDonation.find();

    const monthlyMap = {};

    donations.forEach((donation) => {
      if (donation.createdAt) {
        const date = new Date(donation.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = {
            month: monthKey,
            donated: 0,
            distributed: 0,
            wasted: 0,
            count: 0,
          };
        }
        monthlyMap[monthKey].donated += Number(donation.foodQuantity || 0);
        monthlyMap[monthKey].distributed += Number(donation.distributedQuantity || 0);
        monthlyMap[monthKey].wasted += Number(donation.wastedQuantity || 0);
        monthlyMap[monthKey].count += 1;
      }
    });

    const trends = Object.values(monthlyMap)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);

    res.json({
      success: true,
      data: trends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// STATUS SUMMARY API
// =====================================================

app.get("/api/status-summary", async (req, res) => {
  try {
    const donations = await FoodDonation.find();

    const statusMap = {};

    donations.forEach((donation) => {
      const status = donation.status || "Unknown";
      if (!statusMap[status]) {
        statusMap[status] = { status, count: 0, quantity: 0 };
      }
      statusMap[status].count += 1;
      statusMap[status].quantity += Number(donation.foodQuantity || 0);
    });

    const summary = Object.values(statusMap);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
