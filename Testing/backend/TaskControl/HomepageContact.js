const contactSchema = require("../userModel/ContactSchema.js");

const Contactpostmethod = async (req, res, next) => {
  const { fname, lname, email, address } = req.body;
  try {
    const contact = await contactSchema.create({
      fname,
      email,
      lname,
      address,
    });

    res.status(201).json({
      status: 201,
      msg: "Created contact",
      data: contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { Contactpostmethod };
