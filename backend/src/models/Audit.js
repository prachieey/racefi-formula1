import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contractAddress: {
      type: String,
      required: [true, 'Contract address is required'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^0x[a-fA-F0-9]{40}$/.test(v);
        },
        message: props => `${props.value} is not a valid Ethereum address!`
      }
    },
    network: {
      type: String,
      required: [true, 'Network is required'],
      enum: ['ethereum', 'polygon', 'bsc', 'avalanche'],
      default: 'ethereum'
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed'],
      default: 'pending'
    },
    findings: [
      {
        severity: {
          type: String,
          enum: ['critical', 'high', 'medium', 'low', 'info'],
          required: true
        },
        title: {
          type: String,
          required: true,
          trim: true
        },
        description: {
          type: String,
          required: true
        },
        location: {
          file: String,
          line: Number,
          codeSnippet: String
        },
        recommendation: {
          type: String,
          required: true
        }
      }
    ],
    metadata: {
      solcVersion: String,
      optimization: Boolean,
      runs: Number
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    completedAt: Date,
    reportUrl: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
auditSchema.index({ contractAddress: 1, network: 1 });
auditSchema.index({ status: 1 });
auditSchema.index({ user: 1 });

// Virtual for audit duration
auditSchema.virtual('duration').get(function() {
  if (!this.completedAt || !this.createdAt) return null;
  return this.completedAt - this.createdAt;
});

// Pre-save hook to update completedAt
auditSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

const Audit = mongoose.model('Audit', auditSchema);

export default Audit;
