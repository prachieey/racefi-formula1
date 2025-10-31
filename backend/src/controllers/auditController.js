import Audit from '../models/Audit.js';
import { ethers } from 'ethers';
import asyncHandler from 'express-async-handler';
import ErrorResponse from '../utils/errorResponse.js';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Run a new security audit
// @route   POST /api/v1/audits
// @access  Private
export const runAudit = asyncHandler(async (req, res, next) => {
  const { contractAddress, network, sourceCode, contractName } = req.body;
  const userId = req.user.id;

  // Basic validation
  if (!ethers.isAddress(contractAddress)) {
    return next(new ErrorResponse('Invalid Ethereum address', 400));
  }

  // Create audit record
  const audit = await Audit.create({
    user: userId,
    contractAddress: contractAddress.toLowerCase(),
    network: network || 'ethereum',
    status: 'pending',
    metadata: {
      solcVersion: req.body.solcVersion,
      optimization: req.body.optimization,
      runs: req.body.runs
    }
  });

  // In a real application, you would queue this task
  await performSecurityAnalysis(audit, sourceCode, contractName);

  res.status(201).json({
    success: true,
    data: audit,
    message: 'Audit started successfully. This may take a few minutes.'
  });
});

// @desc    Get all audits for the authenticated user
// @route   GET /api/v1/audits
// @access  Private
export const getAudits = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single audit
// @route   GET /api/v1/audits/:id
// @access  Private
export const getAudit = asyncHandler(async (req, res, next) => {
  const audit = await Audit.findById(req.params.id).populate('user', 'name email');

  if (!audit) {
    return next(
      new ErrorResponse(`Audit not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is audit owner or admin
  if (audit.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this audit`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: audit
  });
});

// @desc    Update audit
// @route   PUT /api/v1/audits/:id
// @access  Private
export const updateAudit = asyncHandler(async (req, res, next) => {
  let audit = await Audit.findById(req.params.id);

  if (!audit) {
    return next(
      new ErrorResponse(`Audit not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is audit owner or admin
  if (audit.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this audit`,
        401
      )
    );
  }

  // Update fields that are allowed to be updated
  const { status, findings, score } = req.body;
  
  if (status) audit.status = status;
  if (findings) audit.findings = findings;
  if (score) audit.score = score;
  
  if (status === 'completed' && !audit.completedAt) {
    audit.completedAt = Date.now();
  }

  await audit.save();

  res.status(200).json({
    success: true,
    data: audit
  });
});

// @desc    Delete audit
// @route   DELETE /api/v1/audits/:id
// @access  Private
export const deleteAudit = asyncHandler(async (req, res, next) => {
  const audit = await Audit.findById(req.params.id);

  if (!audit) {
    return next(
      new ErrorResponse(`Audit not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is audit owner or admin
  if (audit.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this audit`,
        401
      )
    );
  }

  await audit.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// Helper function to perform security analysis
async function performSecurityAnalysis(audit, sourceCode, contractName) {
  try {
    // In a real application, you would use a proper security analysis tool
    // like Slither, Mythril, or Securify, or integrate with a service like
    // OpenZeppelin Defender, Tenderly, or Quantstamp
    
    // For demo purposes, we'll simulate a security analysis
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Sample findings (in a real app, this would come from the analysis tool)
    const sampleFindings = [
      {
        severity: 'high',
        title: 'Reentrancy Vulnerability',
        description: 'The contract is vulnerable to reentrancy attacks in the withdraw function.',
        location: {
          file: `${contractName}.sol`,
          line: 42,
          codeSnippet: 'function withdraw() public {\n    // Vulnerable code\n    (bool success, ) = msg.sender.call{value: address(this).balance}("");\n    require(success, "Transfer failed");\n    balances[msg.sender] = 0;\n}'
        },
        recommendation: 'Use the Checks-Effects-Interactions pattern and consider using ReentrancyGuard from OpenZeppelin.'
      },
      {
        severity: 'medium',
        title: 'Unchecked External Call',
        description: 'The return value of an external call is not checked.',
        location: {
          file: `${contractName}.sol`,
          line: 30,
          codeSnippet: 'function transfer(address to, uint256 amount) public {\n    // Missing return value check\n    token.transfer(to, amount);\n}'
        },
        recommendation: 'Check the return value of the external call and handle potential failures.'
      }
    ];

    // Calculate a random score between 50 and 100 for demo purposes
    const score = Math.floor(Math.random() * 51) + 50;

    // Update the audit with findings
    await Audit.findByIdAndUpdate(audit._id, {
      status: 'completed',
      findings: sampleFindings,
      score,
      completedAt: Date.now()
    });

  } catch (error) {
    console.error('Error during security analysis:', error);
    
    // Update audit status to failed
    await Audit.findByIdAndUpdate(audit._id, {
      status: 'failed',
      error: error.message
    });
  }
}

// @desc    Get audit statistics
// @route   GET /api/v1/audits/stats
// @access  Private
export const getAuditStats = asyncHandler(async (req, res, next) => {
  const stats = await Audit.aggregate([
    {
      $match: { user: req.user._id }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgScore: { $avg: '$score' }
      }
    },
    {
      $project: {
        _id: 0,
        status: '$_id',
        count: 1,
        avgScore: { $ifNull: [{ $round: ['$avgScore', 2] }, 0] }
      }
    },
    {
      $sort: { status: 1 }
    }
  ]);

  const total = await Audit.countDocuments({ user: req.user._id });
  const completed = await Audit.countDocuments({ 
    user: req.user._id, 
    status: 'completed' 
  });

  res.status(200).json({
    success: true,
    data: {
      stats,
      total,
      completed,
      inProgress: await Audit.countDocuments({ 
        user: req.user._id, 
        status: { $in: ['pending', 'in_progress'] } 
      })
    }
  });
});
