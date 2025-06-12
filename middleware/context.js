import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET

const context = ({ req }) => {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    const token = auth.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, JWT_SECRET); 
      return {
        userId: decoded.id,
        role: decoded.role, // doctor | patient | pharmacy
      };
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
  return {};
};

export default context;
