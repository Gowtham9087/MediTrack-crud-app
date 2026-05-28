// testAdmin.js
const bcrypt = require("bcryptjs");
const sequelize = require("./config/mysql");
const User = require("./models/mysql/User");

async function testAdmin() {
  try {
    await sequelize.authenticate();

    const user = await User.findOne({ where: { email: "admin@gmail.com" } });

    if (!user) {
      console.log("❌ No admin found in DB!");
      return;
    }

    console.log("✅ User found:");
    console.log("   Name:", user.name);
    console.log("   Email:", user.email);
    console.log("   Role:", user.role);
    console.log("   Password hash:", user.password);

    // Test if bcrypt compare works
    const isMatch = await bcrypt.compare("Admin@123", user.password);
    console.log("   bcrypt match:", isMatch ? "✅ YES" : "❌ NO");

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    process.exit(0);
  }
}

testAdmin();