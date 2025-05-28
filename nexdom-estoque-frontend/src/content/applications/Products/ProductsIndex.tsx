// ProductsIndex.tsx
import { Card, CircularProgress } from '@mui/material';
import ProductsTable from './ProductsTable';
import { useEffect, useState } from 'react';

export interface Product {
  id: number;
  nome: string;
  descricao: string;
  sku: string;
  precoCusto: number;
  precoVenda: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  unidadeMedida: string;
  categoria: {
    id: number;
    name: string;
  };
  fornecedor: {
    id: number;
    name: string;
  } | null; // Adicionei | null pois no exemplo o fornecedor pode ser null
  createdAt: string;
  updatedAt: string;
  totalSaidas: number; // Nova propriedade
  lucroTotal: number; // Nova propriedade
}

export interface Category {
  id: number;
  nome: string;
  descricao: string;
}

export interface Supplier {
  id: number;
  nome: string;
  cnpj: string;
}

export interface MovementCreateRequest {
  produtoId: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  usuarioResponsavel: string;
  motivo?: string;
  precoVenda?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

function ProductsIndex() {
  const [products, setProducts] = useState<Page<Product>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
    first: true,
    last: true,
    empty: true
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (page = 0, size = 10) => {
    try {
      const response = await fetch(`http://localhost:8080/api/produtos?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, suppliersRes] = await Promise.all([
          fetch('http://localhost:8080/api/categorias'),
          fetch('http://localhost:8080/api/fornecedores')
        ]);

        if (!categoriesRes.ok || !suppliersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [categoriesData, suppliersData] = await Promise.all([
          categoriesRes.json(),
          suppliersRes.json()
        ]);

        setCategories(categoriesData);
        setSuppliers(suppliersData);
        await fetchProducts();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateMovement = async (movement: MovementCreateRequest) => {
    try {
      const response = await fetch('http://localhost:8080/api/movimentacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movement)
      });

      if (!response.ok) {
        throw new Error('Failed to create movement');
      }

      await fetchProducts(products.number, products.size);
      return true;
    } catch (err) {
      console.error('Error creating movement:', err);
      return false;
    }
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('http://localhost:8080/api/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: newProduct.nome,
          descricao: newProduct.descricao,
          sku: newProduct.sku,
          valorFornecedor: newProduct.precoCusto,
          precoVenda: newProduct.precoVenda,
          quantidadeEstoque: newProduct.quantidadeEstoque,
          estoqueMinimo: newProduct.estoqueMinimo,
          unidadeMedida: newProduct.unidadeMedida,
          categoriaId: newProduct.categoria.id,
          fornecedorId: newProduct.fornecedor.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      await fetchProducts(products.number, products.size);
      return true;
    } catch (err) {
      console.error('Error adding product:', err);
      return false;
    }
  };

  const handleUpdateProduct = async (id: number, updatedProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch(`http://localhost:8080/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: updatedProduct.nome,
          descricao: updatedProduct.descricao,
          sku: updatedProduct.sku,
          valorFornecedor: updatedProduct.precoCusto,
          precoVenda: updatedProduct.precoVenda,
          quantidadeEstoque: updatedProduct.quantidadeEstoque,
          estoqueMinimo: updatedProduct.estoqueMinimo,
          unidadeMedida: updatedProduct.unidadeMedida,
          categoriaId: updatedProduct.categoria.id,
          fornecedorId: updatedProduct.fornecedor.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      await fetchProducts(products.number, products.size);
      return true;
    } catch (err) {
      console.error('Error updating product:', err);
      return false;
    }
  };

  const handlePageChange = (newPage: number, newSize: number) => {
    fetchProducts(newPage, newSize);
  };

  if (loading) return (
    <Card sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <CircularProgress />
    </Card>
  );
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <ProductsTable
        products={products.content}
        totalElements={products.totalElements}
        categories={categories}
        suppliers={suppliers}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onCreateMovement={handleCreateMovement}
        onPageChange={handlePageChange}
        page={products.number}
        size={products.size}
      />
    </Card>
  );
}

export default ProductsIndex;