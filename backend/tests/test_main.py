import pytest
from app.main import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_root_endpoint(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"Welcome to Magic Diary API" in response.data

def test_get_diaries(client):
    response = client.get('/diaries')
    assert response.status_code == 200
    assert response.json is not None
