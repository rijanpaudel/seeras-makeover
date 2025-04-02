import Appointment from "../models/Appointments.js";
import User from "../models/User.js";
import sendEmail from "../utils/emailService.js";
import mongoose from "mongoose";

// Book an appointment
export const bookAppointment = async (req, res) => {
  const { userId, subServiceId, appointmentDate, appointmentTime } = req.body;

  // Check if all required fields are present
  if (!userId || !subServiceId || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(subServiceId)) {
    return res.status(400).json({ message: "Invalid user or sub service ID format" });
  }


  try {
    const appointmentTimeObj = new Date(appointmentDate);
    const [hour, minute] = appointmentTime.split(":");
    appointmentTimeObj.setHours(hour, minute);

    const newAppointment = new Appointment({
      userId,
      subServiceId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime: appointmentTimeObj,
    });

    await newAppointment.save();

    // Fetch user details for email notification
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare the email content
    const emailHTML = `
      <html>
        <body>
          <h2>Appointment Confirmation</h2>
          <p>Dear ${user.fullName},</p>
          <p>Your appointment has been successfully booked!</p>
          <h3>Appointment Details:</h3>
          <ul>
            <li><strong>Full Name:</strong> ${user.fullName}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Phone:</strong> ${user.phoneNumber}</li>
            <li><strong>Appointment Date:</strong> ${appointmentDate}</li>
            <li><strong>Appointment Time:</strong> ${appointmentTime}</li>
          </ul>
          <p>We look forward to seeing you at your scheduled appointment time.</p>
          <p>Best Regards,<br/>Seeras Makeover</p>
        </body>
      </html>
    `;

    // Send the email notification to the user
    await sendEmail(
      user.email,
      "Appointment Confirmation - Seeras Makeover",
      "Your appointment has been successfully booked!",
      emailHTML
    );

    res.status(201).json({ message: "Appointment Book Successfully", appointment: newAppointment });
  } catch (error) {
    console.error("Error booking appoointment:", error);
    res.status(500).json({ message: "Error booking appoointment:", error });
  }
};

// Get all appointments for Admin
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("userId", "fullName email phoneNumber").populate("subServiceId", "name");
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Update Appointment Status (Admin Only)
export const updateAppointmentStatus = async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment updated successfully", appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

// Delete Appointment (Admin Only)
export const deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting Appointment:", error);
    res.status(500).json({ message: "Error deleting Appointment", error });
  }
};

export const updateAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { appointmentDate, appointmentTime, subServiceId } = req.body;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { appointmentDate, appointmentTime, subServiceId },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment updated", appointment: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Error updating appointment", error });
  }
};

