const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const { name, phone, location } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Name cannot be empty" });
    }

    if (phone && !/^\d+$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Phone number must contain only numbers" });
    }

    if (!location || location.trim() === "") {
      return res.status(400).json({ success: false, message: "Location cannot be empty" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = name;
    user.phone = phone;
    user.location = location;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { updateProfile };
