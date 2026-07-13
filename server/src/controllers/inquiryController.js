import Inquiry from "../models/inquiryModel.js";
import nodemailer from "nodemailer";

let clients = [];

export const getInquiriesEvents = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*'
  });

  res.write('data: {"type":"init"}\n\n');

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
};

export const createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create({
      ...req.body,
      activityLog: [{ action: "Received", details: "Inquiry submitted by client." }]
    });

    // Broadcast new inquiry to SSE clients
    clients.forEach(client => {
      try {
        client.write(`data: ${JSON.stringify({ type: "new_inquiry", data: inquiry })}\n\n`);
      } catch (err) {
        console.error("Error writing to SSE client:", err.message);
      }
    });

    const emailUser = process.env.EMAIL_USER || process.env.EMAIL;
    const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPass) {
      console.log("Email credentials not set. Skipping inquiry notification email sending.");
    } else {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          tls: { rejectUnauthorized: false },
          family: 4,
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        await transporter.sendMail({
          from: emailUser,
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
      } catch (emailErr) {
        console.error("Failed to send inquiry notification email:", emailErr.message);
      }
    }

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
        const existing = await Inquiry.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: "Inquiry not found" });
        }

        const newLogs = [];
        if (req.body.status && req.body.status !== existing.status) {
            newLogs.push({
                action: "Status Changed",
                details: `Status updated to ${req.body.status}`
            });
        }
        if (req.body.assignedTo && req.body.assignedTo !== existing.assignedTo) {
            newLogs.push({
                action: "Assigned",
                details: `Assigned to ${req.body.assignedTo}`
            });
        }
        if (req.body.nextFollowUp && new Date(req.body.nextFollowUp).getTime() !== (existing.nextFollowUp ? new Date(existing.nextFollowUp).getTime() : 0)) {
            newLogs.push({
                action: "Follow-up Scheduled",
                details: `Follow-up scheduled for ${new Date(req.body.nextFollowUp).toLocaleDateString()}`
            });
        }

        const updatedLogs = [...(existing.activityLog || []), ...newLogs];

        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                activityLog: updatedLogs
            },
            { new: true }
        );

        // Broadcast to SSE clients
        clients.forEach(client => {
          try {
            client.write(`data: ${JSON.stringify({ type: "update_inquiry", data: inquiry })}\n\n`);
          } catch (err) {
            console.error("SSE broadcast error:", err);
          }
        });

        res.json(inquiry);

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
export const sendReply = async (req, res) => {
    try {
        const { email, subject, message, inquiryId } = req.body;

        if (process.env.EMAIL && process.env.EMAIL_PASSWORD) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
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
            console.log(`Email successfully sent to ${email} via SMTP.`);
        } else {
            console.log("---------------- DEV ENVIRONMENT MOCK EMAIL SENDER ----------------");
            console.log(`To: ${email}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${message}`);
            console.log("-------------------------------------------------------------------");
        }

        if (inquiryId) {
            const existing = await Inquiry.findById(inquiryId);
            if (existing) {
                const newLogs = [...(existing.activityLog || []), {
                    action: "Replied by Email",
                    details: `Subject: ${subject}`
                }];
                await Inquiry.findByIdAndUpdate(inquiryId, { activityLog: newLogs });
            }
        }

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

export const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({
                message: "Inquiry not found"
            });
        }
        res.json({
            success: true,
            message: "Inquiry deleted successfully"
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message
        });
    }
};

export const deleteAllInquiries = async (req, res) => {
    try {
        await Inquiry.deleteMany({});
        
        // Broadcast a delete_all event to SSE clients
        clients.forEach(client => {
          try {
            client.write(`data: ${JSON.stringify({ type: "delete_all" })}\n\n`);
          } catch (err) {
            console.error("SSE broadcast error:", err);
          }
        });

        res.json({
            success: true,
            message: "All inquiries deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};