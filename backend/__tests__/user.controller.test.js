import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import { signupUser, loginUser } from '../controllers/user.controller.js';
process.env.JWT_SECRET = 'testsecret';

// 🛠️ Set test JWT secret for token generation
process.env.JWT_SECRET = 'testsecret';

const mockQuery = jest.fn();

jest.unstable_mockModule('../db/db.js', () => ({
  default: { query: mockQuery },
}));

const db = (await import('../db/db.js')).default;

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    mockQuery.mockReset();
  });

  test('signupUser: creates a user if email not exists', async () => {
    req.body = {
      full_name: 'aayush',
      email: 'abs@gmail.com',
      password: '12345678',
    };

    // Mocks: user not found, then user inserted
    mockQuery
      .mockResolvedValueOnce({ rows: [] }) // check if user exists
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }); // insert new user

    await signupUser(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'User created',
    });
  });

  test('signupUser: fails if email exists', async () => {
    req.body = {
      full_name: 'aayush',
      email: 'a@gmail.com',
      password: '12345678',
    };

    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    await signupUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  test('loginUser: succeeds with correct credentials', async () => {
    req.body = {
      email: 'a@gmail.com',
      password: '12345678',
    };

    const hashedPassword = await bcrypt.hash('12345678', 10);

    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          full_name: 'aayush',
          email: 'a@gmail.com',
          password: hashedPassword,
        },
      ],
    });

    await loginUser(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledWith(
      'shoe_token',
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    );
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Login successful',
      user: {
        full_name: 'aayush',
        email: 'a@gmail.com',
      },
    });
  });

  test('loginUser: fails with wrong password', async () => {
    req.body = {
      email: 'a@gmail.com',
      password: 'wrongpassword',
    };

    const hashedPassword = await bcrypt.hash('12345678', 10);
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          full_name: 'aayush',
          email: 'a@gmail.com',
          password: hashedPassword,
        },
      ],
    });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid email or password',
    });
  });

  test('loginUser: fails if user not found', async () => {
    req.body = { email: 'notfound@example.com', password: '12345678' };
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid email or password',
    });
  });
});
