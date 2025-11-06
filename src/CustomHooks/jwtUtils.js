// utils/jwtUtils.js (or add this function in your component file)
const decodeJWT = (token) => {
  try {
    // JWT token has 3 parts: header.payload.signature
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    console.log({decodedPayload})
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export default decodeJWT;