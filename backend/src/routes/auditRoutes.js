import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import advancedResults from '../middleware/advancedResults.js';
import Audit from '../models/Audit.js';
import {
  runAudit,
  getAudits,
  getAudit,
  updateAudit,
  deleteAudit,
  getAuditStats
} from '../controllers/auditController.js';

const router = express.Router({ mergeParams: true });

// All routes are protected and require authentication
router.use(protect);

// Route for getting audit statistics
router.get('/stats', getAuditStats);

// Routes for /api/v1/audits
router
  .route('/')
  .get(
    advancedResults(Audit, [
      {
        path: 'user',
        select: 'name email'
      }
    ]),
    getAudits
  )
  .post(
    [
      body('contractAddress', 'Valid contract address is required').isEthereumAddress(),
      body('network', 'Network is required').isString(),
      body('sourceCode', 'Source code is required').notEmpty(),
      body('contractName', 'Contract name is required').notEmpty()
    ],
    runAudit
  );

// Routes for /api/v1/audits/:id
router
  .route('/:id')
  .get(getAudit)
  .put(
    [
      body('status').optional().isIn(['pending', 'in_progress', 'completed', 'failed']),
      body('findings').optional().isArray(),
      body('score').optional().isFloat({ min: 0, max: 100 })
    ],
    updateAudit
  )
  .delete(deleteAudit);

export default router;
