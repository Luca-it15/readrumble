import React from 'react';

function BookDetails({book}) {
    return (
        <div>
            {
                book.title // Mostra titolo
            }
        </div>
    );
}

export default BookDetails;