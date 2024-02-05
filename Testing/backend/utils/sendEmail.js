const sendEmail = async (email, subject, text) => {
	try {
	  const transporter = nodemailer.createTransport({
		host: process.env.HOST,
		service: process.env.SERVICE,
		port: Number(process.env.EMAIL_PORT),
		secure: Boolean(process.env.SECURE),
		auth: {
		  user: process.env.USER,
		  pass: process.env.PASS,
		},
	  });
  
	  const info = await transporter.sendMail({
		from: process.env.USER,
		to: email,
		subject: subject,
		text: text,
	  });
  
	  console.log("Email sent successfully:", info.response);
	} catch (error) {
	  console.error("Error sending email:", error);
	  return error;
	}
  };
  