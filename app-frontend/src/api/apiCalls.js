import axios from 'axios';

export const signup = (user) => {
    return axios.post('/api/1.0/users', user);
};

export const login = (user) => {
    const token = Buffer.from(`${user.email}:${user.password}`, 'utf8').toString('base64')
    return axios.post('/api/1.0/login', {}, {
        headers: {
          'Authorization': `Basic ${token}`
        },
    })
};

export const setAuthorizationHeader = ({username, password, isLoggedIn}) => {
  if (isLoggedIn) {
    const token = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');
    axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
  
}; 