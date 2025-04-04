import cron from 'node-cron';
import mongoose from 'mongoose';
import Appointment from '../models/Appointments.js';
import sendEmail from '../utils/emailService.js';

// Function to send reminder emails
const appointmentReminder = async () => {
  try {
    const currentTime = new Date();
    const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000);

    // Find appointments that are 1 hour ahead of the current time
    const upcomingAppointments = await Appointment.find({
      appointmentTime: { $gte: currentTime, $lte: oneHourLater },
      status: { $ne: "Canceled" }
    }).populate("userId", "fullName email phoneNumber").populate("subServiceId", "name");

    for (const appointment of upcomingAppointments) {
      const { userId, appointmentDateTime, subServiceId } = appointment;
      // Format datetime for email
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


      const emailHTML = `
        <html>
          <body>
            <h2>Appointment Reminder</h2>
            <p>Dear ${userId.fullName},</p>
            <p>This is a reminder that you have an upcoming appointment:</p>
            <h3>Appointment Details:</h3>
            <ul>
              <li><strong>Full Name:</strong> ${userId.fullName}</li>
              <li><strong>Email:</strong> ${userId.email}</li>
              <li><strong>Phone:</strong> ${userId.phoneNumber}</li>
              <<p><strong>${formattedDateTime}</strong></p>
              <li><strong>Sub Service:</strong> ${appointment.subServiceId.name}</li>
            </ul>
            <p>We look forward to serving you. If you need to reschedule or cancel, please contact us.</p>
            <p>Best Regards,<br/>Seeras Makeover</p>
          </body>
        </html>
      `;

      await sendEmail(
        userId.email,
        "Appointment Reminder - Seeras Makeover",
        "Your appointment is coming up in 1 hour!",
        emailHTML
      );
    }
  } catch (error) {
    console.error("Error sending appointment reminders:", error);
  }
};

// Run the cron job every minute
cron.schedule('*/1 * * * *', () => {
  console.log("Running appointment reminder job...");
  appointmentReminder();
});

export default appointmentReminder;
