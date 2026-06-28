import Inquiry from "../models/inquiryModel.js";
import nodemailer from "nodemailer";

export const createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
  port: 465,
  secure: true,
      tls: { rejectUnauthorized: false },
      family: 4,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,

      to: "support@strivo.com", // Company email

      subject: `New Inquiry from ${inquiry.fullName}`,

      html: `
        <h2>New Inquiry</h2>

        <p><b>Name:</b> ${inquiry.fullName}</p>

        <p><b>Company:</b> ${inquiry.company}</p>

        <p><b>Email:</b> ${inquiry.email}</p>

        <p><b>Phone:</b> ${inquiry.phone}</p>

        <p><b>Service:</b> ${inquiry.service}</p>

        <p><b>Message:</b></p>

        <p>${inquiry.message}</p>
      `,
    });

    res.status(201).json(inquiry);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};
export const getInquiries = async (req, res) => {

    const inquiries = await Inquiry.find().sort({
        createdAt: -1,
    });

    res.json(inquiries);

};
export const getNewInquiries = async(req,res)=>{

   try{

      const inquiries = await Inquiry.find({

         status:"New"

      }).sort({

         createdAt:-1

      });

      res.json(inquiries);

   }

   catch(err){

      res.status(500).json({

         message:err.message

      });

   }

}
export const updateInquiryStatus = async (req, res) => {
    try {

        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            { new: true }
        );

        res.json(inquiry);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};
export const sendReply = async (req, res) => {
    try {
        const { email, subject, message } = req.body;

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
  port: 465,
  secure: true,
      tls: { rejectUnauthorized: false },
      family: 4,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Strivo Consultancy" <${process.env.EMAIL}>`,
            to: email,
            subject,
            html: `
                <div style="font-family:Arial;padding:20px">
                    <h2 style="color:#2563eb">
                        Strivo Consultancy
                    </h2>

                    <hr/>

                    <p>${message.replace(/\n/g, "<br/>")}</p>

                    <br/>

                    <p>
                        Regards,<br/>
                        <strong>Strivo Consultancy Team</strong>
                    </p>
                </div>
            `,
        });

        res.status(200).json({
            success: true,
            message: "Reply sent successfully",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to send email",
        });
    }
};