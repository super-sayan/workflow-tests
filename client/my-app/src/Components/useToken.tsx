import { useState } from 'react';
import Cookies from 'js-cookie';

function useToken() {
    
    function getToken() {
        const token = Cookies.get('token');
        return token;
    };

    const [token, setToken] = useState(getToken());

    
    function saveToken(userToken: string) {
        if (userToken !== 'undefined') {
            Cookies.set('token', userToken);
            setToken(userToken);
        }
    };

    function removeToken() {
        Cookies.remove('token');
        setToken(undefined);
    };

    return {
        setToken: saveToken,
        token,
        removeToken
    }
}

export default useToken;