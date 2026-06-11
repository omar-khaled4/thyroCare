const predictionController = require('./prediction.controller');
const User = require('../models/User');
const Report = require('../models/Report');
const Symptom = require('../models/Symptom');
const Prediction = require('../models/Prediction');

// Mock dependencies
jest.mock('../utils/helpers', () => ({
  tryCatch: jest.fn(fn => fn),
  respond: jest.fn((res, statusCode, data = null, message = "") => {
    return res.status(statusCode).json({ success: statusCode < 400, data, message });
  })
}));

jest.mock('../models/User');
jest.mock('../models/Report');
jest.mock('../models/Symptom');
jest.mock('../models/Prediction');

describe('Prediction Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      user: { id: 'user_123' },
      body: {},
      params: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Mock global fetch for ML Model Service Call
    global.fetch = jest.fn();
  });

  describe('predict', () => {
    it('should return 400 if no report is found', async () => {
      User.findById.mockResolvedValue({ _id: 'user_123' });
      Report.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(null) // No report
      });
      Symptom.findOne.mockResolvedValue(null);

      await predictionController.predict(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'No report found. Please submit a thyroid report before requesting a prediction.' })
      );
    });

    it('should handle successful prediction from ML model', async () => {
      // Mock Data
      User.findById.mockResolvedValue({ _id: 'user_123', age: 30, gender: 'Male' });
      Report.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue({
          patientId: 'user_123',
          thyroidFunction: { tsh: 2.5, freeT3: 3.1, freeT4: 1.2 }
        })
      });
      Symptom.findOne.mockResolvedValue({
        patientId: 'user_123',
        records: [{ fatigue: 1 }]
      });

      // Mock Fetch resolving successfully with ML prediction
      global.fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          diagnosis: 'Normal',
          severity: 'None',
          confidence: 0.98,
          healthScore: 90,
          recommendations: []
        })
      });

      Prediction.create.mockResolvedValue({
        _id: 'pred_123',
        createdAt: new Date(),
      });

      await predictionController.predict(req, res);

      expect(global.fetch).toHaveBeenCalled();
      expect(Prediction.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Prediction complete' })
      );
    });

    it('should handle ML Model service unavailable (503)', async () => {
      User.findById.mockResolvedValue({ _id: 'user_123', age: 30, gender: 'Male' });
      Report.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue({ patientId: 'user_123' })
      });
      Symptom.findOne.mockResolvedValue(null);

      // Mock Fetch throwing an error
      global.fetch.mockRejectedValue(new Error('Connection Refused'));

      await predictionController.predict(req, res);

      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'The prediction service is currently unavailable. Ensure the LLM server is running on port 8000.' })
      );
    });
  });

  describe('getPredictionHistory', () => {
    it('should return user predictions', async () => {
      const mockPredictions = [{ diagnosis: 'Normal' }];
      Prediction.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockPredictions)
      });

      await predictionController.getPredictionHistory(req, res);

      expect(Prediction.find).toHaveBeenCalledWith({ patientId: 'user_123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: mockPredictions })
      );
    });
  });
});
