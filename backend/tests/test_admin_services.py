import pytest
from unittest.mock import patch, MagicMock
from app.services.admin_service import get_access_requests, get_user_access_data, update_request_status, grant_access_to_user

# Replace 'your_module_name' with the actual Python file name (without .py)

@pytest.fixture
def mock_conn():
    with patch('backend.app.services.admin_service.mysql.connector.connect') as mock_connect:
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connection.cursor.return_value = mock_cursor
        mock_connection.is_connected.return_value = True
        mock_connect.return_value = mock_connection

        yield mock_connect, mock_connection, mock_cursor


def test_get_access_requests(mock_conn):
    _, mock_connection, mock_cursor = mock_conn

    mock_cursor.fetchall.return_value = [
        {
            "id": 1,
            "full_name": "Sam Singh",
            "department": "IT",
            "locations": "RegionX",
            "submitted_at": MagicMock(strftime=lambda fmt: "2025-05-09 12:00:00"),
            "status": "pending"
        }
    ]

    result = get_access_requests()
    assert len(result) == 1
    assert result[0]["full_name"] == "Sam Singh"
    assert result[0]["submitted_at"] == "2025-05-09 12:00:00"


def test_get_user_access_data(mock_conn):
    _, mock_connection, mock_cursor = mock_conn

    mock_cursor.fetchall.return_value = [
        {
            "full_name": "Riya Sharma",
            "status": "approved",
            "submitted_at": MagicMock(strftime=lambda fmt: "2025-05-09 13:00:00")
        }
    ]

    result = get_user_access_data()
    assert len(result) == 1
    assert result[0]["status"] == "approved"
    assert result[0]["submitted_at"] == "2025-05-09 13:00:00"


def test_update_request_status_success(mock_conn):
    _, mock_connection, mock_cursor = mock_conn

    result = update_request_status(1, "approved")
    mock_cursor.execute.assert_called_with(
        "UPDATE permission_requests SET status = %s WHERE id = %s", ("approved", 1)
    )
    assert result is True


def test_grant_access_to_user_success(mock_conn):
    _, mock_connection, mock_cursor = mock_conn

    # Mock request data tuple from DB
    mock_cursor.fetchone.return_value = (
        1, "user123", "IT", None, None, None, "RegionX"
    )

    result = grant_access_to_user(1)
    assert result is True
    mock_cursor.execute.assert_any_call(
        "UPDATE users SET regions = %s WHERE username = %s", ("RegionX", "user123")
    )
    mock_cursor.execute.assert_any_call(
        "UPDATE permission_requests SET status = 'approved' WHERE id = %s", (1,)
    )


def test_grant_access_to_user_not_found(mock_conn):
    _, _, mock_cursor = mock_conn

    mock_cursor.fetchone.return_value = None

    result = grant_access_to_user(999)
    assert result is False
