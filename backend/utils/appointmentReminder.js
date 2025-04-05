import cron from 'node-cron';
import mongoose from 'mongoose';
import Appointment from '../models/Appointments.js';
import sendEmail from '../utils/emailService.js';

// Function to send reminder emails
const appointmentReminder = async () => {
  try {
    const currentTime = new Date();
    let nepalTime = 5 * 60 + 45 // Convert to Nepal Time (GMT+5:45)

    //Caculate the current Nepali time and target time
    const nepalNow = new Date(currentTime.getTime() + nepalTime * 60 * 1000);
    const targetNepalTime = new Date(nepalNow.getTime() + 60 * 60 * 1000);

    const targetUTC = new Date(targetNepalTime.getTime() - nepalTime * 60 * 1000);

    // Allow 2 minute window arount targetUTC
    const oneHourMinStart = new Date(targetUTC.getTime() - 1 * 60 * 1000);
    const oneHourMaxEnd = new Date(targetUTC.getTime() + 1 * 60 * 1000);

    console.log(`Looking for appointments scheduled between:
    ${oneHourMinStart.toISOString()} and ${oneHourMaxEnd.toISOString()}`);


    // Find appointments that are scheduled exactly 1 hour from now
    const upcomingAppointments = await Appointment.find({
      appointmentDateTime: {
        $gte: oneHourMinStart,
        $lte: oneHourMaxEnd
      },
      status: { $ne: "Canceled" }
    }).populate("userId", "fullName email phoneNumber").populate("subServiceId", "name");

    console.log(`Found ${upcomingAppointments.length} appointments happening in 1 hour.`);

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
              <li><strong>Date & Time:</strong> ${formattedDateTime}</li>
              <li><strong>Sub Service:</strong> ${subServiceId.name}</li>
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

      console.log(`Reminder email sent to ${userId.email}`);
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
