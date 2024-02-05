const userModel = require("../userModel/UserSchema");
const tokenModel = require("../userModel/tokenSchema");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const Register = async (req, res) => {
  const { fname, lname, email, phone, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(200).json({
        status: 200,
        message: "User already exists",
      });
    }

    const hashingpassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      fname,
      lname,
      email,
      phone,
      password: hashingpassword,
    });

    const user = await newUser.save();

    // jwt token sent to mail
    const newToken = new tokenModel({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    await newToken.save();

    // Retrieve BASE_URL from environment variables
    const baseURL = process.env.BASE_URL || 'http://localhost:3000/';

    const url = `${baseURL}users/${user._id}/verify/${newToken.token}`;
    await sendEmail(user.email, "Verify Email", url);

    res
      .status(201)
      .json({ message: "An Email sent to your account. Please verify." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
   
//verfied the E-mail ID and LINk:

const verifyEmail = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await userModel.findById(id);

    if (!user) return res.status(400).json({ message: "Invalid user ID" });

    const token = await tokenModel.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).json({ message: "Invalid or expired token" });

    await userModel.updateOne({ _id: user._id }, { verified: true });

    await tokenModel.deleteOne({ _id: token._id });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


//Login with jwt token authorization:

const loginpost = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    // Check if the user is verified
    if (!user.verified) {
      // If not verified, send a verification email
      let token = await tokenModel.findOne({ userId: user._id });
      if (!token) {
        token = await new tokenModel({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify Email", url);
      }

      return res.status(400).send({ message: "An Email sent to your account. Please verify." });
    }

    // Proceed with login if the user is verified
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const authToken = user.generateAuthToken();
    res.status(200).send({ data: authToken, message: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};



module.exports = { Register, verifyEmail, loginpost };
