const bcrypt = require("bcryptjs");

const test = async () => {
  const pass = "password123";
  const hash = await bcrypt.hash(pass, 10);
  console.log("Hash:", hash);
  const match = await bcrypt.compare(pass, hash);
  console.log("Match:", match);
};

test();
