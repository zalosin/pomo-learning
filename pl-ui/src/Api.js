const API_URL = 'http://192.168.1.213:3000';

export default {
    get: (url) => {
        return fetch(`${API_URL}/${url}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            })
            .then(res => res.json())
            .catch(console.log)
    },
    post: (url, body) => {
        return fetch(`${API_URL}/${url}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            .then(res => res.json())
            .catch(console.log)
    },
};