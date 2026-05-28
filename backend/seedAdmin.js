const bcrypt = require("bcryptjs");
const sequelize = require("./config/mysql");
const User = require("./models/mysql/User");

async function resetAdmin() {
  try {
    await sequelize.authenticate();

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.update(
      { 
        password: hashedPassword,
        role: "admin"          // make sure role is set correctly
      },
      { where: { email: "admin@gmail.com" },
        individualHooks: false  // ← skips any beforeUpdate hooks to avoid double-hashing
      }
    );

    console.log("✅ Done!");
    console.log("📧 Email: admin@gmail.com");
    console.log("🔑 Password: Admin@123");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    process.exit(0);
  }
}

resetAdmin();