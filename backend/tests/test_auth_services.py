import pytest
from unittest.mock import patch, MagicMock
from backend.app.services.auth_service import create_user, login_user, login_admin

# Replace 'your_module_name' with your actual Python filename (without .py)


@pytest.fixture
def mock_mysql():
    with patch('backend.app.services.auth_service.mysql.connector.connect') as mock_connect:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_conn.is_connected.return_value = True
        mock_connect.return_value = mock_conn
        yield mock_cursor, mock_conn


def test_create_user_success(mock_mysql):
    mock_cursor, mock_conn = mock_mysql

    dummy_user = {
        'fullName': 'Aarav Singh',
        'email': 'aarav@example.com',
        'phoneNumber': '1234567890',
        'role': 'user',
        'designation': 'Researcher',
        'department': 'Remote Sensing',
        'username': 'aarav01',
        'password': 'hashed_pwd',
        'regions': ['North', 'East'],
        'accessReason': 'Wants satellite data',
        'supervisorContact': 'Dr. Patel'
    }

    create_user(dummy_user)

    mock_cursor.execute.assert_called_once()
    mock_conn.commit.assert_called_once()
    mock_cursor.close.assert_called_once()
    mock_conn.close.assert_called_once()


def test_login_user_success(mock_mysql):
    mock_cursor, _ = mock_mysql
    mock_cursor.fetchone.return_value = ('some', 'mock', 'user')

    data = {'email': 'aarav@example.com', 'password': 'hashed_pwd'}

    result = login_user(data)

    assert result is not None
    mock_cursor.execute.assert_called_once()


def test_login_user_failure(mock_mysql):
    mock_cursor, _ = mock_mysql
    mock_cursor.fetchone.return_value = None

    data = {'email': 'wrong@example.com', 'password': 'wrong_pwd'}

    result = login_user(data)

    assert result is None
    mock_cursor.execute.assert_called_once()


def test_login_admin_success(mock_mysql):
    mock_cursor, _ = mock_mysql
    mock_cursor.fetchone.return_value = ('admin', 'user')

    data = {'username': 'admin01', 'password': 'admin_pwd'}

    result = login_admin(data)

    assert result is not None
    mock_cursor.execute.assert_called_once()


def test_login_admin_failure(mock_mysql):
    mock_cursor, _ = mock_mysql
    mock_cursor.fetchone.return_value = None

    data = {'username': 'fakeadmin', 'password': 'wrong_pwd'}

    result = login_admin(data)

    assert result is None
    mock_cursor.execute.assert_called_once()
