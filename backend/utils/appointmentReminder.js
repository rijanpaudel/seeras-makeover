import cron from 'node-cron';
import Appointment from '../models/Appointments.js';
import sendEmail from '../utils/emailService.js';

const appointmentReminder = async () => {
  try {
    // Get current time in UTC
    const nowUTC = new Date();

    // Calculate target time (1 hour ahead of now in UTC)
    const targetUTC = new Date(nowUTC.getTime() + 60 * 60 * 1000);

    // ±1 minute window
    const startWindowUTC = new Date(targetUTC.getTime() - 60 * 1000);
    const endWindowUTC = new Date(targetUTC.getTime() + 60 * 1000);

    const nepalOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kathmandu'
    };

    const dateTimeOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kathmandu'
    };

    const nepalNow = new Intl.DateTimeFormat('en-US', nepalOptions).format(nowUTC);
    const nepalTarget = new Intl.DateTimeFormat('en-US', nepalOptions).format(targetUTC);

    console.log("Nepal Time Now:", nepalNow);
    console.log("Looking for appointments at:", nepalTarget);

    // Find upcoming appointments 1 hour from now
    const upcomingAppointments = await Appointment.find({
      appointmentDateTime: {
        $gte: startWindowUTC,
        $lte: endWindowUTC
      },
      status: { $ne: "Canceled" }
    }).populate("userId", "fullName email phoneNumber")
      .populate("subServiceId", "name");

    console.log(`Found ${upcomingAppointments.length} appointments.`);

    for (const appointment of upcomingAppointments) {
      const { userId, appointmentDateTime, subServiceId } = appointment;

      const formattedDateTime = new Intl.DateTimeFormat('en-US', dateTimeOptions).format(appointmentDateTime);

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
cron.schedule('*/9 * * * *', () => {
  console.log("Running appointment reminder job...");
  appointmentReminder();
});

export default appointmentReminder;
