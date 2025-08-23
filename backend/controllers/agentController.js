const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const Agent = require("../models/Agent");

exports.createAgent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, mobileNumber, password } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({
      $or: [{ email }, { mobileNumber }],
    });

    if (existingAgent) {
      return res
        .status(400)
        .json({ message: "Agent with this email or mobileNumber already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new agent
    const agent = new Agent({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
    });

    await agent.save();

    res.status(201).json({
      message: "Agent created successfully",
      agent: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        mobileNumber: agent.mobileNumber,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select("-password");
    res.json(agents);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
