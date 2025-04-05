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
    //Parse date and time to create Date object
    const [year, month, day] = appointmentDate.split('-');
    const timeComponents = appointmentTime.split(' ');
    let [hours, minutes] = timeComponents[0].split(':');

    //Convert 12-hour format to 24-hour format
    if (timeComponents[1] === 'PM' && hours !== '12') {
      hours = parseInt(hours) + 12;
    }
    else if (timeComponents[1] === 'AM' && hours === '12') {
      hours = 0;
    }

    // Convert 12h to 24h format
    let hoursInt = parseInt(hours);
    if (timeComponents[1] === 'PM' && hoursInt !== 12) {
      hoursInt += 12;
    } else if (timeComponents[1] === 'AM' && hoursInt === 12) {
      hoursInt = 0;
    }

    const formattedHours = hoursInt.toString().padStart(2, '0');
    const formattedMinutes = minutes.padStart(2, '0');

    // Create ISO string with Nepal timezone offset
    const isoString = `${appointmentDate}T${formattedHours}:${formattedMinutes}:00+05:45`;
    const appointmentDateTime = new Date(isoString);

    // Validate the date
    if (isNaN(appointmentDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date or time" });
    }

    const newAppointment = new Appointment({
      userId,
      subServiceId,
      appointmentDateTime,
      status: "Pending",
    });

    await newAppointment.save();

    // Fetch user details for email notification
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Format the date for display in the email
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };

    const formattedDateTime = appointmentDateTime.toLocaleDateString('en-US', options);

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
            <li><strong>Appointment Date & :</strong> ${formattedDateTime}</li>
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

    // Send admin notification
    const adminEmailHTML = `
    <html>
        <body>
          <h2>New Appointment Booking</h2>
          <p>User has booked an appointment:</p>
          <h3>Appointment Details:</h3>
          <ul>
            <li><strong>Full Name:</strong> ${user.fullName}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Phone:</strong> ${user.phoneNumber}</li>
            <li><strong>Appointment Date & Time:</strong> ${formattedDateTime}</li>
          </ul>
        </body>
      </html>
    `;

    await sendEmail(
      process.env.EMAIL_USER,
      "New Appointment Booking",
      "A new booking of appointment",
      adminEmailHTML
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

//Get appointment history for specific user
export const appointmentHistory = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(appointments);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' })
  }
}

