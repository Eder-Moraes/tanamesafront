
function decodeJWT(token) {
    const base64Url = token.split('.')[1]; // O payload está na segunda parte
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join('')
    );
  
    return JSON.parse(jsonPayload);
  }
  
  
  const checkUserAccess = () => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      return null;
    }
  
    try {
      // Decodifica o token JWT
      const decoded = decodeJWT(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
  
      // Verifica se o token expirou
      if (decoded.exp < currentTime) {
        // Se o token expirou, remove do localStorage e retorna null
        localStorage.removeItem('authToken');
        return null;
      }
      return decoded;
    } catch (err) {
      // Se houver erro na decodificação, remove o token
      localStorage.removeItem('authToken');
      return null;
    }
  };
  
  module.exports = checkUserAccess;