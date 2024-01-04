import { useState, useEffect } from 'react';
import axios from 'axios';

function useAjax(url, method, params) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios({
            method: method,
            url: url,
            params: params
        })
        .then(response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(error => {
            setError(error.toString());
            setLoading(false);
        });
    }, [url, method, params]);

    return { data, error, loading };
}

export default useAjax;
