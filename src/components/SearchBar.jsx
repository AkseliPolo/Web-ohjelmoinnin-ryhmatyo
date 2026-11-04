import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <Form onSubmit={handleSubmit} role="search">
      <InputGroup>
        <Form.Control
          type="search"
          placeholder="Hae elokuvaa nimellä"
          aria-label="Hae elokuvaa nimellä"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" variant="warning">Hae</Button>
      </InputGroup>
    </Form>
  );
}