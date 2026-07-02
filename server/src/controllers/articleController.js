import Article from "../models/Article.js";
import Subscriber from "../models/Subscriber.js";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup Nodemailer transporter using Gmail (same as talent HR email system)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
      tls: { rejectUnauthorized: false },
      family: 4,
  auth: {
    user: process.env.EMAIL_USER || process.env.EMAIL,
    pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD,
  },
});

// Helper function to send email notification to a subscriber
const sendNewArticleEmail = async (toEmail, article) => {
  try {
    const emailUser = process.env.EMAIL_USER || process.env.EMAIL;
    const emailPass = process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPass) {
      console.log("Email credentials not set. Skipping subscription notification email.");
      return;
    }

    // Construct the direct page URL (Vite client runs on http://localhost:5173)
    const articleLink = `http://localhost:5173/article/${article._id}`;

    const mailOptions = {
      from: emailUser,
      to: toEmail,
      subject: `New Strategic Insight: ${article.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2563eb; margin: 0; font-size: 24px;">Strivo Consultancy</h2>
            <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Enterprise Strategy & Digital Insights</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 16px; line-height: 1.5; color: #334155;">Hello,</p>
          <p style="font-size: 16px; line-height: 1.5; color: #334155;">We have just published a new article under our <strong>${article.category}</strong> column that may interest you:</p>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #0f172a; margin: 0 0 8px 0; font-size: 18px;">${article.title}</h3>
            <p style="color: #475569; margin: 0; font-size: 15px; line-height: 1.5;">${article.description}</p>
          </div>

          <div style="text-align: center; margin: 25px 0;">
            <a href="${articleLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 15px; transition: background-color 0.2s ease;">Read Full Article</a>
          </div>

          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.4; margin: 0;">
            You are receiving this email because you subscribed to Nexus Insights Daily from Strivo Consultancy.<br />
            To manage your settings or unsubscribe, contact us directly.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Notification email dispatched successfully to: ${toEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${toEmail}:`, error.message);
  }
};

// @desc    Register a new newsletter subscriber
// @route   POST /api/articles/subscribe
// @access  Public
export const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    // Check if the email address is already in the subscribers database
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You are already subscribed to our newsletter list! 📬",
      });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send Welcome Email
    try {
      const emailUser = process.env.EMAIL_USER || process.env.EMAIL;
      const logo1Path = path.join(__dirname, "../../../client/src/assets/strivo logo.png");

      const mailOptions = {
        from: emailUser,
        to: email,
        subject: "Welcome! Your Strivo subscription is confirmed 🚀",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <p>Hi there,</p>
            <p>You are officially on the list! This email is to confirm that your subscription to our newsletter was successful.</p>
            <p>As promised, you will now receive our latest insights, weekly deep-dives, and strategic guides delivered straight to your inbox. We respect your time and your inbox, which means we are sticking to our core rule: absolutely no spam, just high-value signal to help you stay ahead.</p>
            <p>Keep an eye out for our next issue coming your way soon.</p>
            <p>Best regards,</p>
            <p>The Team at Strivo Private Limited</p>
            <br/>
            <div>
              <img src="cid:strivologo" alt="Strivo Logo" style="width: 150px;" />
            </div>
          </div>
        `,
        attachments: [
          {
            filename: "strivo logo.png",
            path: logo1Path,
            cid: "strivologo"
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email dispatched to: ${email}`);
    } catch (emailError) {
      console.error("❌ Failed to send welcome email:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Subscribed successfully! Thank you for staying updated. 🎉",
      data: subscriber,
    });
  } catch (error) {
    console.error("Error in subscribeEmail controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to register subscription.",
      error: error.message,
    });
  }
};

// @desc    Create a new article
// @route   POST /api/articles
// @access  Public (Admin panel)
export const createArticle = async (req, res) => {
  try {
    const { title, category, imageUrl, description, content, showSubscription } = req.body;

    // Validate that all fields are filled
    if (!title || !category || !imageUrl || !description || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: title, category, imageUrl, description, and content.",
      });
    }

    // Create a new article document instance
    const newArticle = new Article({
      title,
      category,
      imageUrl,
      description,
      content,
      showSubscription: showSubscription !== false, // Default to true if not specified
    });

    // Save to database
    const savedArticle = await newArticle.save();

    // Trigger newsletter email notification in the background
    // Using a separate try/catch block so a mailing configuration issue does not impact publishing
    try {
      const subscribers = await Subscriber.find().lean();
      if (subscribers && subscribers.length > 0) {
        // Send email to each registered subscriber asynchronously
        subscribers.forEach((sub) => {
          sendNewArticleEmail(sub.email, savedArticle);
        });
      }
    } catch (emailError) {
      console.error("Error sending article notification emails:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Article published successfully!",
      data: savedArticle,
    });
  } catch (error) {
    console.error("Error in createArticle controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to publish article.",
      error: error.message,
    });
  }
};

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Articles fetched successfully",
      data: articles,
    });
  } catch (error) {
    console.error("Error in getArticles controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to retrieve articles.",
      error: error.message,
    });
  }
};

// @desc    Get article by ID
// @route   GET /api/articles/:id
// @access  Public
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Article not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Article details fetched successfully",
      data: article,
    });
  } catch (error) {
    console.error("Error in getArticleById controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to retrieve article.",
      error: error.message,
    });
  }
};

// @desc    Update an article
// @route   PUT /api/articles/:id
// @access  Public (Admin panel)
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, imageUrl, description, content, showSubscription } = req.body;

    // Validate input fields
    if (!title || !category || !imageUrl || !description || !content) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields to update.",
      });
    }

    // Find and update the article document
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title,
        category,
        imageUrl,
        description,
        content,
        showSubscription: showSubscription !== false, // Default to true if not specified
      },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({
        success: false,
        message: "Article not found to update.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Article updated successfully!",
      data: updatedArticle,
    });
  } catch (error) {
    console.error("Error in updateArticle controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to update article.",
      error: error.message,
    });
  }
};


export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({
        success: false,
        message: "Article not found to delete.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Article deleted successfully.",
      data: deletedArticle,
    });
  } catch (error) {
    console.error("Error in deleteArticle controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to delete article.",
      error: error.message,
    });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/articles/subscribers
// @access  Public (Admin panel)
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Subscribers fetched successfully",
      data: subscribers,
    });
  } catch (error) {
    console.error("Error in getSubscribers controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to retrieve subscribers.",
      error: error.message,
    });
  }
};

// @desc    Delete a subscriber
// @route   DELETE /api/articles/subscribers/:id
// @access  Public (Admin panel)
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Subscriber.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscriber removed successfully.",
      data: deleted,
    });
  } catch (error) {
    console.error("Error in deleteSubscriber controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Failed to remove subscriber.",
      error: error.message,
    });
  }
};
