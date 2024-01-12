import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const BookSelector = ({ handleChangeBookTitle }) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [tags, setTags] = useState([]);

    var storedData = localStorage.getItem('logged_user');

    if (storedData) {
        // Il valore è presente, lo converte da stringa JSON a oggetto JavaScript
        var user = JSON.parse(storedData);

        // Ora puoi utilizzare la variabile 'isLoggedIn' come desideri
        console.log(user['Username']);
    } else {
        // La chiave 'isLoggedIn' non è presente in localStorage
        console.log('La chiave "logged_user" non è presente in localStorage.');
    }

    useEffect(() => {
        // Ottieni i titoli dei libri dal server
        axios
            .get(`http://localhost:8080/api/library/title/${user['Username']}`)
            .then((response) => {
                const bookTitles = response.data.map((book) => ({
                    value: book.bookName,
                    label: book.bookName,
                }));
                const bookTags = response.data.map((book) => ({
                    value: book.tags,
                    label: book.tags,
                }));
                setOptions(bookTitles);
                setTags(bookTags);
            })
            .catch((error) =>
                console.error('Errore durante il recupero dei titoli dei libri:', error)
            );
    }, []);

    const handleInputChange = (inputValue) => {
        setSelectedOption(inputValue);
        handleChangeBookTitle(inputValue.value, tags);
    };

    return (
        <Select
            value={selectedOption}
            onChange={handleInputChange}
            options={options}
            isSearchable
            placeholder="Seleziona un libro..."
        />
    );
};

export default BookSelector;
