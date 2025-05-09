import pytest
from backend.app.services.user_service import get_accessible_locations, register_request, get_notifications

# Optional: Create fixture if you want fresh setup for each test
@pytest.fixture
def test_user_data():
    return {
        "fullName": "Sam Singh",
        "email": "sam@example.com",
        "phoneNumber": "1234567890",
        "department": "CS",
        "designation": "Intern",
        "locations": "Hyderabad,Mumbai",
        "justification": "Need access for project",
        "supervisorInfo": "Dr. A. Someone",
        "additionalComments": "None"
    }


def test_get_accessible_locations():
    locations = get_accessible_locations(1)
    assert isinstance(locations, list)

def test_register_request(test_user_data):
    result = register_request(test_user_data)
    assert "request_id" in result
    assert result["message"] == "Permission request submitted"

def test_get_notifications():
    notifs = get_notifications()
    assert isinstance(notifs, list)
