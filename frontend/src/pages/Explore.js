import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

class SearchBar extends Component {
  render() {
    return (
      <Form inline>
        <FormControl type="text" placeholder="Cerca" className="mr-sm-2" />
        <Button variant="outline-success">Cerca</Button>
      </Form>
    );
  }
}

class SearchResults extends Component {
  render() {
    return (
      <div>
        <h3>Risultati della ricerca:</h3>
        <ul>
          <li>Risultato 1</li>
          <li>Risultato 2</li>
          <li>Risultato 3</li>
        </ul>
      </div>
    );
  }
}

class Explore extends Component {
  render() {
    return (
      <div>
        <h1>Esplora</h1>
        <SearchBar />
        <SearchResults />
      </div>
    );
  }
}

export default Explore;
