import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tokenAddress: {
      type: String,
      required: [true, 'Token address is required'],
    },
    amount: {
      type: String, // Storing as string to handle large numbers
      required: [true, 'Amount is required'],
    },
    to: {
      type: String,
      required: [true, 'Recipient address is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'executed', 'cancelled'],
      default: 'pending',
    },
    confirmations: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    txHash: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster querying
withdrawalSchema.index({ user: 1, status: 1 });
withdrawalSchema.index({ status: 1, createdAt: 1 });

// Static method to get pending withdrawals that need confirmation
withdrawalSchema.statics.getPendingWithdrawals = function() {
  return this.find({ status: 'pending' })
    .sort({ createdAt: 1 })
    .populate('user', 'name email');
};

// Method to add a confirmation
withdrawalSchema.methods.addConfirmation = async function(userId) {
  // Check if user already confirmed
  const hasConfirmed = this.confirmations.some(
    conf => conf.user.toString() === userId.toString()
  );

  if (!hasConfirmed) {
    this.confirmations.push({ user: userId });
    
    // Check if we have enough confirmations
    if (this.confirmations.length >= 2) { // Assuming 2 confirmations are needed
      this.status = 'confirmed';
    }
    
    await this.save();
  }

  return this;
};

export default mongoose.model('Withdrawal', withdrawalSchema);
