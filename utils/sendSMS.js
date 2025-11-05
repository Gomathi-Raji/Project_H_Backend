import twilio from 'twilio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import SMSLog from '../models/SMSLog.js';

dotenv.config(); // Load env vars

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  console.error('Twilio credentials not set. Please check TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env');
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

const logFilePath = path.join(__dirname, '../logs/sms_logs.txt');

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

export const sendSMS = async (to, message, type) => {
  console.log('Attempting to send SMS:', { to, type, messageLength: message.length });
  if (!client) {
    const errorMsg = 'Twilio client not initialized. Check credentials.';
    console.error(errorMsg);
    // Log to file and DB anyway
    const logEntry = `${new Date().toISOString()} - To: ${to}, Type: ${type}, Status: failed, Error: ${errorMsg}\nMessage: ${message}\n\n`;
    fs.appendFileSync(logFilePath, logEntry);
    await SMSLog.create({
      to,
      body: message,
      status: 'failed',
      type,
    });
    return { success: false, error: errorMsg };
  }

  try {
    console.log('Sending SMS via Twilio...');
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: to,
    });
    console.log('SMS sent successfully, SID:', result.sid);

    // Log to file
    const logEntry = `${new Date().toISOString()} - To: ${to}, Type: ${type}, Status: sent, SID: ${result.sid}\nMessage: ${message}\n\n`;
    fs.appendFileSync(logFilePath, logEntry);

    // Log to DB
    await SMSLog.create({
      to,
      body: message,
      status: 'sent',
      type,
    });

    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('SMS send error:', error.message);

    // Log failure to file
    const logEntry = `${new Date().toISOString()} - To: ${to}, Type: ${type}, Status: failed, Error: ${error.message}\nMessage: ${message}\n\n`;
    fs.appendFileSync(logFilePath, logEntry);

    // Log to DB
    await SMSLog.create({
      to,
      body: message,
      status: 'failed',
      type,
    });

    return { success: false, error: error.message };
  }
};