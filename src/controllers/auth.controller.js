const bcrypt = require("bcryptjs");
const { prisma } = require("../lib/prisma");
const { signToken } = require("../lib/jwt");

async function register(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      workspaces: {
        create: { name: "My Workspace" },
      },
    },
  });

  const token = signToken({ userId: user.id });

  res.status(201).json({ token, user: { id: user.id, email: user.email } });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  const token = signToken({ userId: user.id });
  res.status(200).json({ token, user: { id: user.id, email: user.email } });
}

async function profileUpdate(req, res) {
  const { name } = req.body;
  const userId = req.userId;

  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }
  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: { name },
  });
  res.status(200).json({
    user: {
      id: updateUser.id,
      email: updateUser.email,
      name: updateUser.name,
    },
  });
}

module.exports = { register, login, profileUpdate };
