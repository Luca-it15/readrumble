import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const ReviewForm = () => {
  const [title, setTitle] = useState('');
  const [score, setScore] = useState(1);
  const [pagesRead, setPagesRead] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Qui puoi gestire l'invio della recensione, ad esempio inviandola a un server
    console.log({ title, score, pagesRead, reviewText });
    history.push('/success'); // reindirizza alla pagina di successo dopo l'invio
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="bookTitle">
        <Form.Label>Titolo del libro</Form.Label>
        <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="bookScore">
        <Form.Label>Punteggio (0-5)</Form.Label>
        <Form.Control type="number" min="1" max="5" value={score} onChange={e => setScore(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="pagesRead">
        <Form.Label>Pagine lette</Form.Label>
        <Form.Control type="number" min="0" value={pagesRead} onChange={e => setPagesRead(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="reviewText">
        <Form.Label>Testo della recensione</Form.Label>
        <Form.Control as="textarea" rows={3} value={reviewText} onChange={e => setReviewText(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit">
        Invia recensione
      </Button>
    </Form>
  );
};

export default ReviewForm;
