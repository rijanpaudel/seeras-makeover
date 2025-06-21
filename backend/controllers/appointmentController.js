import Appointment from "../models/Appointments.js";
import User from "../models/User.js";
import sendEmail from "../utils/emailService.js";
import BlockedSlot from "../models/BlockedSlot.js";
import mongoose from "mongoose";

// Book an appointment
export const bookAppointment = async (req, res) => {
  const { userId, subServiceId, appointmentDate, appointmentTime, notes } = req.body;

  // Check if all required fields are present
  if (!userId || !subServiceId || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(subServiceId)) {
    return res.status(400).json({ message: "Invalid user or sub service ID format" });
  }

  try {
    let appointmentDateTime;
    let time24;
<<<<<<< HEAD

=======
    
>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a
    try {
      // Convert time to 24-hour format
      time24 = convertTo24Hour(appointmentTime);
      const [hours, minutes] = time24.split(':').map(Number);
<<<<<<< HEAD

=======
      
>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a
      // Create Date object from parts
      const [year, month, day] = appointmentDate.split('-').map((part, index) => {
        return index === 1 ? parseInt(part) - 1 : parseInt(part);
      });
<<<<<<< HEAD

      appointmentDateTime = new Date(year, month, day, hours, minutes);

=======
      
      appointmentDateTime = new Date(year, month, day, hours, minutes);
      
>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a
      if (isNaN(appointmentDateTime.getTime())) {
        throw new Error("Invalid date");
      }
    } catch (err) {
      console.error("Date parsing error:", err);
      return res.status(400).json({ message: "Invalid date or time format" });
    }
<<<<<<< HEAD

    // Check if time slot is already booked
    const startOfDay = new Date(appointmentDateTime);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentDateTime);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      subServiceId,
      appointmentDateTime: appointmentDateTime
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked",
        code: "TIME_ALREADY_BOOKED",
        conflictingAppointment: {
          id: existingAppointment._id,
          userId: existingAppointment.userId
        }
      });
    }

    // Check if the time slot is blocked by admin
    const blockedSlot = await BlockedSlot.findOne({
      subServiceId,
=======
    
    // Check if time slot is already booked
    const startOfDay = new Date(appointmentDateTime);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(appointmentDateTime);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingAppointment = await Appointment.findOne({
      subServiceId: subServiceId,
      appointmentDateTime: appointmentDateTime,
      status: { $ne: "Cancelled" } // Don't count cancelled appointments
    });
      
    if (existingAppointment) {
      return res.status(400).json({ 
        message: "This time slot is already booked. Please select a different time." 
      });
    }
    
    // Check if the time slot is blocked by admin
    const blockedSlot = await BlockedSlot.findOne({
>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      startTime: time24
    });
<<<<<<< HEAD

    if (blockedSlot) {
      return res.status(400).json({
        message: "This time slot is not available for booking",
        code: "TIME_BLOCKED",
        blockedSlot: {
          id: blockedSlot._id,
        }
=======
    
    if (blockedSlot) {
      return res.status(400).json({ 
        message: "This time slot is not available for booking. Please select a different time." 
>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a
      });
    }

    // Create the appointment with the valid date
    const newAppointment = new Appointment({
      userId,
      subServiceId,
      appointmentDateTime,
      status: "Pending",
      notes: notes || ""
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

    const formattedDateTime = appointmentDateTime.toLocaleString('en-US', options);

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
<<<<<<< HEAD
            <li><strong>Appointment Date & :</strong> ${formattedDateTime}</li>
=======
            <li><strong>Appointment Date & Time:</strong> ${formattedDateTime}</li>
>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a
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
<<<<<<< HEAD
    res.status(201).json({ message: "Appointment Book Successfully", appointment: newAppointment });
  } catch (error) {
    console.error("Error booking appoointment:", error);
    res.status(500).json({ message: "Error booking appoointment:", error });
=======
    
    res.status(201).json({ message: "Appointment Book Successfully", appointment: newAppointment });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Error booking appointment:", error });
>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a
  }
};

function convertTo24Hour(timeStr) {
  if (!timeStr) return "00:00";

  // Handle different time formats
  let hours, minutes, period;

<<<<<<< HEAD
  // Match patterns
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2}) (AM|PM)/i);
=======
  // Match patterns like "11:00 AM" or "1:00 PM"
  const timeMatch = timeStr.trim().match(/(\d{1,2}):(\d{2})\s+(AM|PM)/i);
>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a

  if (timeMatch) {
    hours = parseInt(timeMatch[1], 10);
    minutes = timeMatch[2];
    period = timeMatch[3].toUpperCase();

    // Convert to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    // Format with leading zeros
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  // If the format doesn't match, log and return a default
  console.error("Invalid time format:", timeStr);
  return "12:00"; // Default to noon
}

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
    const appointments = await Appointment.find({ userId: req.params.userId })
      .sort({ appointmentDateTime: -1 })
      .populate("subServiceId", "name");
    res.json(appointments);
  }
  catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' })
  }
}

export const getBookedTimes = async (req, res) => {
  try {
    const { date, subServiceId } = req.query;

    if (!date || !subServiceId) {
      return res.status(400).json({ message: "Date and subServiceId query params are required" });
    }

    // Create date range for the selected day
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

<<<<<<< HEAD
=======
    console.log('Searching for appointments between:', start, 'and', end);
    console.log('For subServiceId:', subServiceId);

>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a
    // Find appointments for the selected date and service
    // Only include appointments that are not cancelled
    const appointments = await Appointment.find({
      subServiceId,
      appointmentDateTime: { $gte: start, $lte: end },
      status: { $ne: "Cancelled" } // Exclude cancelled appointments
    });

<<<<<<< HEAD
    // Format times exactly as they appear in the UI
    const bookedTimes = appointments.map(app =>
      app.appointmentDateTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    );
=======
    console.log('Found appointments:', appointments.length);

    // Format times exactly as they appear in the UI
    const bookedTimes = appointments.map(app => {
      const timeStr = app.appointmentDateTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      console.log('Formatted appointment time:', timeStr);
      return timeStr;
    });
>>>>>>> 3ba96876bed626446a07dc67a0c3f372d923666a

    console.log("Returning booked times:", bookedTimes);
    res.json({ bookedTimes });
  } catch (error) {
    console.error("Error fetching booked times:", error);
    res.status(500).json({ message: "Error fetching booked times", error: error.message });
  }
};

export const getRecentAppointments = async (req, res) => {
  try {
    // Fetch the most recent 10 appointments
    const appointments = await Appointment.find()
      .sort({ appointmentDateTime: -1 }) // Sort by date, newest first
      .limit(10) // Limit to 10 results
      .populate("userId", "fullName email phoneNumber") // Include user details
      .populate("subServiceId", "name"); // Include service details

    // Send the appointments directly without wrapping in another object
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching recent appointments:", error);
    res.status(500).json({ message: "Error fetching recent appointments", error: error.message });
  }
};

export const getMonthlyAppointments = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Get the current month (0-indexed)
    const currentMonth = new Date().getMonth();

    // We'll get data for the last 6 months
    const startMonth = currentMonth - 5 >= 0 ? currentMonth - 5 : 0;

    // Initialize results array with all months having 0 appointments
    const monthlyData = [];
    for (let i = startMonth; i <= currentMonth; i++) {
      monthlyData.push({
        name: months[i],
        appointments: 0
      });
    }

    // Aggregate appointments by month
    const appointments = await Appointment.aggregate([
      {
        $match: {
          // Filter appointments for the current year and relevant months
          appointmentDateTime: {
            $gte: new Date(currentYear, startMonth, 1),
            $lte: new Date(currentYear, currentMonth + 1, 0)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$appointmentDateTime" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    // Update the results with actual appointment counts
    appointments.forEach(item => {
      // MongoDB months are 1-indexed, so subtract 1 to match our array
      const monthIndex = item._id - 1;
      // Find the corresponding month in our data array
      const dataIndex = monthlyData.findIndex(m => months.indexOf(m.name) === monthIndex);
      if (dataIndex !== -1) {
        monthlyData[dataIndex].appointments = item.count;
      }
    });

    res.json(monthlyData);
  } catch (error) {
    console.error('Error fetching monthly appointments:', error);
    res.status(500).json({ error: 'Failed to fetch monthly appointment data' });
  }
};

export const getServiceDistribution = async (req, res) => {
  try {
    // Aggregate appointments by service type
    const serviceDistribution = await Appointment.aggregate([
      {
        $lookup: {
          from: 'subservices',
          localField: 'subServiceId',
          foreignField: '_id',
          as: 'service'
        }
      },
      {
        $unwind: '$service'
      },
      {
        $group: {
          _id: '$service.name',
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: 1
        }
      },
      {
        $sort: { value: -1 }
      },
      {
        $limit: 5  // Top 5 services
      }
    ]);

    // Check if we have data
    if (serviceDistribution.length === 0) {
      return res.json([
        { name: 'No Data', value: 1 }
      ]);
    }

    // Calculate the total count for all services
    const totalServices = serviceDistribution.reduce((sum, service) => sum + service.value, 0);

    // If we have less than 5 services but we have additional services not in the top 5
    const otherServicesCount = await Appointment.countDocuments() - totalServices;

    // If there are other services not in our top categories, add an "Other" category
    if (otherServicesCount > 0) {
      serviceDistribution.push({
        name: 'Other',
        value: otherServicesCount
      });
    }

    res.json(serviceDistribution);
  } catch (error) {
    console.error('Error fetching service distribution:', error);
    res.status(500).json({ error: 'Failed to fetch service distribution data' });
  }
};


