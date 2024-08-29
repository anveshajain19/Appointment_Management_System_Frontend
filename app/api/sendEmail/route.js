import { Resend } from "resend";
import { NextResponse } from "next/server";

// Initialize Resend API
const resend = new Resend(process.env.RESEND_API_KEY);

// Email template for the doctor
const DoctorEmailTemplate = ({ UserName, Time, appointmentDate, Note }) => {
  const dateObj = new Date(appointmentDate);

  return (
    <div>
      <h1>New Appointment Scheduled</h1>
      <p>Dear Doctor,</p>
      <p>An appointment has been scheduled with the following details:</p>
      <ul>
        <li><strong>Patient:</strong> {UserName}</li>
        <li><strong>Date:</strong> {dateObj.toDateString()}</li>
        <li><strong>Time:</strong> {Time}</li>
        <li><strong>Details Given By Patient:</strong> {Note || "No additional notes provided."}</li>
      </ul>
      
      <p>Best regards,<br />Genpact group 18</p>
    </div>
  );
};


const PatientEmailTemplate = ({ UserName, Time, appointmentDate }) => {
  const dateObj = new Date(appointmentDate);

  return (
    <div>
      <h1>Appointment Booking Confirmation</h1>
      <p>Dear {UserName},</p>
      <p>
        Your appointment with the doctor has been successfully scheduled for{" "}
        <strong>{dateObj.toDateString()}</strong> at <strong>{Time}</strong>.
      </p>
      <p>Please ensure that you arrive at least 15 minutes before the scheduled appointment time.</p>
      <p>We look forward to seeing you soon.</p>
      <p>You can also manage your appointments in the appointment section. </p>
      <p>Best regards,<br />Genpact Project - Group 18</p>
    </div>
  );
};


export async function POST(req) {
  const response = await req.json();
  const result = response.data;
  console.log("Result Data:", result);

  try {
    // Send email to the patient
    const patientEmailData = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [result.Email],
      subject: "Appointment Confirmation",
      react: PatientEmailTemplate({ 
        UserName: result.UserName, 
        Time: result.Time, 
        appointmentDate: result.Date 
      }),
    });
    console.log('Patient email sent:', patientEmailData);

    // Send email to the doctor
    const doctorEmailData = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [result.Email], 
      subject: "New Appointment Scheduled",
      react: DoctorEmailTemplate({ 
        UserName: result.UserName, 
        Time: result.Time, 
        appointmentDate: result.Date, 
        Note: result.Note 
      }), 
    });
    console.log('Doctor email sent:', doctorEmailData);

    return NextResponse.json({ patientEmailData, doctorEmailData });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json({ error });
  }
}
