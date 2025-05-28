import { Card } from '@mui/material';
import SuppliersTable from './SuppliersTable';
import { useEffect, useState } from 'react';

export interface Supplier {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  createdAt: string;
  updatedAt: string;
}

function SuppliersIndex() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/fornecedores`);
      if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
      }
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleAddSupplier = async (newSupplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('http://localhost:8080/api/fornecedores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSupplier)
      });

      if (!response.ok) {
        throw new Error('Failed to add supplier');
      }

      await fetchSuppliers();
      return true;
    } catch (err) {
      console.error('Error adding supplier:', err);
      return false;
    }
  };

  const handleUpdateSupplier = async (id: number, updatedSupplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`http://localhost:8080/api/fornecedores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSupplier)
      });

      if (!response.ok) {
        throw new Error('Failed to update supplier');
      }

      await fetchSuppliers();
      return true;
    } catch (err) {
      console.error('Error updating supplier:', err);
      return false;
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/fornecedores/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete supplier');
      }

      await fetchSuppliers();
      return true;
    } catch (err) {
      console.error('Error deleting supplier:', err);
      return false;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <SuppliersTable
        suppliers={suppliers}
        onAddSupplier={handleAddSupplier}
        onUpdateSupplier={handleUpdateSupplier}
        onDeleteSupplier={handleDeleteSupplier}
      />
    </Card>
  );
}

export default SuppliersIndex;