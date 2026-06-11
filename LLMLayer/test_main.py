import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ThyroCare LLM API is running"}

@patch("main.client.chat.complete")
def test_predict_endpoint(mock_complete):
    """
    Test the prediction endpoint. 
    This uses a mock for the trained machine learning model inference to ensure 
    fast, predictable testing without hitting external limits.
    """
    # Mocking the machine learning model prediction response
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content='''{
            "diagnosis": "Hypothyroidism",
            "severity": "Moderate",
            "confidence": 0.92,
            "healthScore": 45,
            "recommendations": [
                {"priority": "high", "action": "Consult endocrinologist", "reason": "Elevated TSH"}
            ]
        }'''))
    ]
    mock_complete.return_value = mock_response

    payload = {
        "patient_data": {
            "age": 45,
            "gender": "Female",
            "tsh": 15.5,
            "freeT3": 1.2,
            "freeT4": 0.5,
            "symptoms": {
                "fatigue": 1,
                "weightChange": 1,
                "coldIntolerance": 1
            }
        }
    }

    response = client.post("/predict", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    assert data["diagnosis"] == "Hypothyroidism"
    assert data["severity"] == "Moderate"
    assert data["confidence"] == 0.92
    assert data["healthScore"] == 45
    assert len(data["recommendations"]) == 1
    assert data["recommendations"][0]["action"] == "Consult endocrinologist"

@patch("main.client.chat.complete")
def test_predict_endpoint_error_handling(mock_complete):
    """
    Test how the model handles unexpected inference output parsing.
    """
    mock_response = MagicMock()
    # Simulating a bad output from the model
    mock_response.choices = [
        MagicMock(message=MagicMock(content="Invalid JSON response from model"))
    ]
    mock_complete.return_value = mock_response

    payload = {
        "patient_data": {
            "age": 30,
            "gender": "Male",
            "tsh": 2.5,
            "freeT3": 3.0,
            "freeT4": 1.2
        }
    }

    response = client.post("/predict", json=payload)
    
    assert response.status_code == 500
    data = response.json()
    assert "error" in data
    assert data["error"] == "Failed to parse AI response as JSON"
