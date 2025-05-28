// MovementsIndex.tsx
import { Card, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import MovementsTable from './MovementsTable';

export interface Movement {
  id: number;
  productId: number;
  productName: string;
  type: 'ENTRADA' | 'SAIDA';
  quantity: number;
  dateTime: string;
  responsibleUser: string;
  reason: string;
  salePrice: number;
  createdAt: string;
  updatedAt: string;
}

function MovementsIndex() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/movimentacoes`);
      if (!response.ok) {
        throw new Error('Failed to fetch movements');
      }
      const data = await response.json();
      setMovements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  if (loading) return (
    <Card sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Card>
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <MovementsTable movements={movements} />
    </Card>
  );
}

export default MovementsIndex;