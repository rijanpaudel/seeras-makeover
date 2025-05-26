import dotenv from "dotenv";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js";
import Enrollment from "../models/Enrollment.js";
import sendEmail from "../utils/emailService.js";

dotenv.config();

// Khalti API configuration
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const KHALTI_API_URL = "https://a.khalti.com/api/v2";

// 1. INITIATE PAYMENT FOR COURSE ENROLLMENT
export const initiatePayment = async (req, res) => {
  const { amount, purchase_order_id, purchase_order_name, return_url, customer_info, extra } = req.body;

  if (!amount || !purchase_order_id || !purchase_order_name || !return_url || !customer_info || !extra?.orderData?.courseId) {
    return res.status(400).json({ message: "Missing required payment fields" });
  }

  console.log("Request body for payment initiation:", req.body);

  if (!KHALTI_SECRET_KEY) {
    console.error("KHALTI_SECRET_KEY is not defined in environment variables");
    return res.status(500).json({ message: "Payment configuration error" });
  }

  const payload = {
    return_url,
    website_url: "http://localhost:5173",
    amount,
    purchase_order_id,
    purchase_order_name,
    customer_info,
  };

  try {
    const response = await fetch(`${KHALTI_API_URL}/epayment/initiate/`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawResponse = await response.text();
    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (parseError) {
      console.error("Failed to parse Khalti response:", parseError);
      return res.status(500).json({ message: "Invalid response from payment gateway" });
    }

    if (response.ok) {
      // Store the payment record for course enrollment
      await Payment.create({
        pidx: data.pidx,
        orderData: extra.orderData,
        status: 'Pending',
        processed: false,
        type: 'course_enrollment'  // Identify payment type
      });

      return res.json({
        payment_url: data.payment_url,
        pidx: data.pidx,
      });
    } else {
      console.error("Khalti API error:", data);
      return res.status(response.status).json({
        message: data.detail || data.message || "Payment gateway error",
        details: data,
      });
    }
  } catch (err) {
    console.error("Error initiating Khalti payment:", err);
    return res.status(500).json({ message: "Error connecting to payment gateway" });
  }
};

// 2. VERIFY PAYMENT FOR COURSE ENROLLMENT
export const verifyPayment = async (req, res) => {
  const { pidx } = req.body;

  if (!pidx) {
    return res.status(400).json({ message: "Missing pidx" });
  }

  try {
    // Find the payment record using pidx
    const paymentRecord = await Payment.findOne({ pidx });

    if (!paymentRecord) {
      return res.status(404).json({ message: "Payment record not found." });
    }

    // If the payment has already been processed, return the existing enrollment
    if (paymentRecord.processed) {
      const existingEnrollment = paymentRecord.enrollmentId ? 
        await Enrollment.findById(paymentRecord.enrollmentId) : null;
      
      return res.status(200).json({
        message: "Payment already processed",
        enrollment: existingEnrollment,
        status: paymentRecord.status,
      });
    }

    // Proceed with Khalti payment verification only if payment is not processed
    const response = await fetch(`${KHALTI_API_URL}/epayment/lookup/`, {
      method: "POST",
      headers: {
        "Authorization": `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const data = await response.json();
    console.log("Khalti verification response:", data);

    if (data.status === "Completed") {
      // Proceed with creating the enrollment after payment verification
      const orderData = paymentRecord.orderData;

      if (!orderData || !orderData.userId || !orderData.courseId) {
        return res.status(400).json({ message: "Order data not found or incomplete in payment record" });
      }

      const { userId, courseId } = orderData;

      // Check if the user is already enrolled in the course
      const existingEnrollment = await Enrollment.findOne({ userId, courseId });
      if (existingEnrollment) {
        paymentRecord.processed = true;
        paymentRecord.enrollmentId = existingEnrollment._id;
        paymentRecord.status = "Completed";
        await paymentRecord.save();
        
        return res.status(200).json({
          message: "Payment successful, but you were already enrolled in this course.",
          status: "Completed",
          enrollment: existingEnrollment,
        });
      }

      // Find the course to get its modules
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const initialModules = course.modules.map(() => false);

      // Create new enrollment
      const newEnrollment = new Enrollment({
        userId,
        courseId,
        completedModules: initialModules,
        paymentStatus: "Completed",
      });

      await newEnrollment.save();

      // Send confirmation email
      const user = await User.findById(userId);
      if (user) {
        const emailHTML = `
          <h2>Course Enrollment Confirmed</h2>
          <p>Dear ${user.firstName || user.username},</p>
          <p>You have successfully enrolled in <strong>${course.courseTitle}</strong>.</p>
          <p>Course details:</p>
          <ul>
            <li>Duration: ${course.courseDuration} weeks</li>
            <li>Price: Rs ${course.coursePrice}</li>
          </ul>
          <p>You can access your course by logging into your account.</p>
          <p>Thank you for choosing our platform!</p>
        `;
        
        try {
          await sendEmail(
            user.email,
            "Course Enrollment Confirmed",
            "Your course enrollment has been processed successfully",
            emailHTML
          );
        } catch (emailError) {
          console.error("Error sending enrollment confirmation email:", emailError);
        }
      }

      // Update payment status to completed and link the enrollment
      paymentRecord.processed = true;
      paymentRecord.enrollmentId = newEnrollment._id;
      paymentRecord.status = "Completed";
      await paymentRecord.save();

      return res.status(200).json({
        message: "Payment verified and enrollment processed!",
        status: "Completed",
        enrollment: newEnrollment,
      });
    } else {
      return res.status(400).json({ message: "Payment not completed", status: data.status });
    }
  } catch (error) {
    console.error("Error verifying Khalti payment for course:", error);
    return res.status(500).json({ message: "Error verifying payment" });
  }
};