const cron = require('node-cron');
const BorrowRequest = require('../models/BorrowRequest');
const User = require('../models/User');
const Item = require('../models/Item');
const { sendEmail } = require('../utils/sendEmail');

/**
 * Check for due/overdue items and send reminders
 * Runs daily at 8 AM
 */
const startReminderCron = () => {
  // Cron expression: 0 8 * * * (runs at 8 AM every day)
  cron.schedule('0 8 * * *', async () => {
    console.log('🔔 Running reminder cron job...');

    try {
      const now = new Date();

      // Find requests that are due today or already overdue
      const dueRequests = await BorrowRequest.find({
        $and: [
          { status: { $ne: 'returned' } },
          { status: { $ne: 'rejected' } },
          { dueDate: { $lte: now } },
        ],
      })
        .populate('borrowerId')
        .populate('ownerId')
        .populate('itemId');

      for (const request of dueRequests) {
        // Mark as overdue if not already
        if (request.status !== 'overdue') {
          request.status = 'overdue';
          await request.save();

          // Increment borrower's overdue count
          await User.findByIdAndUpdate(request.borrowerId._id, {
            $inc: { overdueCount: 1 },
          });
        }

        // Send reminder emails
        const borrowerEmail = request.borrowerId.email;
        const ownerEmail = request.ownerId.email;
        const itemTitle = request.itemId.title;

        // Email to borrower
        const borrowerSubject = `⏰ Reminder: "${itemTitle}" is due for return`;
        const borrowerText = `
Hello ${request.borrowerId.name},

Your borrowed item "${itemTitle}" is now overdue!
Due date: ${request.dueDate.toDateString()}
Please return it to ${request.ownerId.name} as soon as possible.

Your trust score may be affected by overdue returns.

Best regards,
ShareShelf Team
        `;

        await sendEmail(borrowerEmail, borrowerSubject, borrowerText);

        // Email to owner
        const ownerSubject = `📦 Overdue Item: "${itemTitle}" not returned`;
        const ownerText = `
Hello ${request.ownerId.name},

The item "${itemTitle}" borrowed by ${request.borrowerId.name} is now overdue.
Due date was: ${request.dueDate.toDateString()}

Please contact the borrower for return.

Best regards,
ShareShelf Team
        `;

        await sendEmail(ownerEmail, ownerSubject, ownerText);
      }

      console.log(`✅ Reminder cron completed. Processed ${dueRequests.length} requests.`);
    } catch (error) {
      console.error('❌ Error in reminder cron job:', error.message);
    }
  });

  console.log('✓ Reminder cron job scheduled (runs daily at 8 AM)');
};

module.exports = { startReminderCron };
