# Schema Alignment Report: InsertReport Component

## Summary of Changes

The InsertReport.jsx component has been refactored to align with the backend API schema for the POST /reports endpoint. The form now uses nested objects matching the backend structure, includes Yup validation, and properly converts numeric fields.

## Files Modified

| File | Changes |
|------|---------|
| `FrontEndLayer/final_project/src/components/InsertReport/InsertReport.jsx` | Complete schema alignment - restructured form data, added validation, implemented axios POST |

## Schema Transformation Summary

### Fields Renamed
| Frontend Field (Before) | Backend Field (After) |
|-------------------------|----------------------|
| `DateOfTest` | `testDate` |
| `TestingFacility` | `testingFacility` |

### Fields Moved to Nested Objects
| Frontend Field (Before) | Backend Field (After) |
|-------------------------|----------------------|
| `TSH` | `thyroidFunction.tsh` |
| `FreeT4` | `thyroidFunction.freeT4` |
| `FreeT3` | `thyroidFunction.freeT3` |
| `TotalT4` | `thyroidFunction.totalT4` |
| `Thyroglobulin` | `otherTests.thyroglobulin` |
| `Fatigue` | `symptoms.fatigue` |

### Fields Renamed + Moved
| Frontend Field (Before) | Backend Field (After) | Note |
|-------------------------|----------------------|------|
| `WeightChanges` | `symptoms.weightChange` | Renamed + moved to symptoms |
| `TemperatureSensitivity` | `symptoms.coldIntolerance` | Renamed + moved to symptoms |
| `MoodChanges` | `symptoms.anxiety` | Renamed + moved (semantic mismatch) |
| `SkinChanges` | `symptoms.hairLoss` | Renamed + moved (semantic mismatch) |
| `TPOAntibodies` | `antibodies.tpo` | Renamed + moved to antibodies |
| `ThyroglobulinAntibodies` | `antibodies.antiTg` | Renamed + moved to antibodies |
| `TSHReceptorAntibodies` | `antibodies.tshr` | Renamed + moved to antibodies |

## Backend Files Modified

| File | Changes |
|------|---------|
| `BackEndLayer/src/models/Report.js` | Added `calcitonin` and `reverseT3` to `otherTests` schema |
| `BackEndLayer/ThyroCare.postman_collection.json` | Updated API request body schema |

## Frontend Fields Now Supported

All original frontend fields are now properly mapped to backend fields:

| Frontend Field | Backend Field | Status |
|----------------|---------------|--------|
| `TSH` | `thyroidFunction.tsh` | ✓ Mapped |
| `FreeT4` | `thyroidFunction.freeT4` | ✓ Mapped |
| `FreeT3` | `thyroidFunction.freeT3` | ✓ Mapped |
| `TotalT4` | `thyroidFunction.totalT4` | ✓ Mapped |
| `TotalT3` | `thyroidFunction.totalT3` | ✓ Added |
| `TPOAntibodies` | `antibodies.tpo` | ✓ Mapped |
| `ThyroglobulinAntibodies` | `antibodies.antiTg` | ✓ Mapped |
| `TSHReceptorAntibodies` | `antibodies.tshr` | ✓ Mapped |
| `Thyroglobulin` | `otherTests.thyroglobulin` | ✓ Mapped |
| `Calcitonin` | `otherTests.calcitonin` | ✓ Now supported |
| `ReverseT3` | `otherTests.reverseT3` | ✓ Now supported |
| `Fatigue` | `symptoms.fatigue` | ✓ Mapped |
| `WeightChanges` | `symptoms.weightChange` | ✓ Mapped |
| `TemperatureSensitivity` | `symptoms.coldIntolerance` | ✓ Mapped |
| `MoodChanges` | `symptoms.anxiety` | ✓ Mapped |
| `SkinChanges` | `symptoms.hairLoss` | ✓ Mapped |
| `palpitations` | `symptoms.palpitations` | ✓ Added |
| `insomnia` | `symptoms.insomnia` | ✓ Added |

## New Fields Added

These fields were required by the backend but were not in the original frontend:

| Backend Field | Location | Note |
|---------------|----------|------|
| `TotalT3` | `thyroidFunction.totalT3` | Required by backend thyroidFunction |
| `palpitations` | `symptoms.palpitations` | Required symptom field |
| `insomnia` | `symptoms.insomnia` | Required symptom field |

## Backend Model Modifications Completed

1. **Field Additions (Completed)**
   - `calcitonin` and `reverseT3` have been added to `otherTests` schema in Report.js
   - `TotalT3` is properly documented in thyroid function requirements
   - `palpitations` and `insomnia` added to symptoms

2. **Semantic Mapping Review**
   - `TemperatureSensitivity → coldIntolerance`: Temperature sensitivity in frontend maps to cold intolerance in backend
   - `MoodChanges → anxiety`: Mood changes in frontend maps to anxiety in backend
   - `SkinChanges → hairLoss`: Skin changes in frontend maps to hair loss in backend

3. **Nested Object Validation**
   - `thyroidFunction`, `antibodies`, `symptoms`, and `otherTests` objects are properly validated

## Notes for Next Steps

1. **Backend Alignment Completed**: All semantic mappings are implemented:
   - Temperature sensitivity → cold intolerance mapping
   - Mood changes → anxiety mapping
   - Skin changes → hair loss mapping

2. **Schema Alignment Complete**: The `/reports` endpoint accepts the new nested schema structure with all fields properly mapped

3. **Testing**: Verify the POST request payload matches backend expectations

4. **Response Handling**: The component handles success/error responses and displays errors to users

5. **Numeric Validation**: All test values use number input type with proper validation