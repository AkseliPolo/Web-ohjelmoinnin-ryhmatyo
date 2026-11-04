import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

const MOCK_MOVIES = [
  { id: 1, title: 'Tähtien takaa' },
  { id: 2, title: 'Yö Helsingissä' },
  { id: 3, title: 'Viimeinen juna' },
  { id: 4, title: 'Meren kutsu' },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const results = MOCK_MOVIES.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <h1 className="h4">Hakutulokset: "{query}"</h1>
      {results.length === 0 ? (
        <p>Hakusanalla ei löytynyt elokuvia.</p>
      ) : (
        <ul>
          {results.map((m) => (
            <li key={m.id}>{m.title}</li>
          ))}
        </ul>
      )}
    </Container>
  );
}