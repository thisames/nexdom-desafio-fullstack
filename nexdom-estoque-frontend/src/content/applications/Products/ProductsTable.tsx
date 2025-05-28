// ProductsTable.tsx
import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import InventoryIcon from '@mui/icons-material/Inventory';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddIcon from '@mui/icons-material/Add';
import Label from 'src/components/Label';
import BulkActions from './BulkActions';
import { Page } from './ProductsIndex';

interface Category {
  id: number;
  nome: string;
}

interface Supplier {
  id: number;
  nome: string;
}

interface Product {
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
  } | null;
  createdAt: string;
  updatedAt: string;
  totalSaidas?: number;
  lucroTotal?: number;
}

interface MovementCreateRequest {
  produtoId: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  usuarioResponsavel: string;
  motivo?: string;
  precoVenda?: number;
}

interface RecentOrdersTableProps {
  className?: string;
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  totalElements: number;
  page: number;
  size: number;
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  onUpdateProduct: (id: number, product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  onCreateMovement: (movement: MovementCreateRequest) => Promise<boolean>;
  onPageChange: (newPage: number, newSize: number) => void;
}

interface Filters {
  category?: number;
}

const getStockStatusLabel = (quantity: number, minQuantity: number): JSX.Element => {
  if (quantity <= 0) {
    return <Label color="error">Out of Stock</Label>;
  } else if (quantity <= minQuantity) {
    return <Label color="warning">Low Stock</Label>;
  } else {
    return <Label color="success">In Stock</Label>;
  }
};

const applyFilters = (
  products: Product[],
  filters: Filters
): Product[] => {
  return products.filter((product) => {
    let matches = true;

    if (filters.category && product.categoria?.id !== filters.category) {
      matches = false;
    }

    return matches;
  });
};

const ProductsTable: FC<RecentOrdersTableProps> = ({
                                                         products,
                                                         categories,
                                                         suppliers,
                                                         totalElements,
                                                         page,
                                                         size,
                                                         onAddProduct,
                                                         onUpdateProduct,
                                                         onCreateMovement,
                                                         onPageChange
                                                       }) => {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const selectedBulkActions = selectedProducts.length > 0;
  const [filters, setFilters] = useState<Filters>({
    category: null
  });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [openMovementModal, setOpenMovementModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [movementData, setMovementData] = useState<MovementCreateRequest>({
    produtoId: 0,
    tipo: 'ENTRADA',
    quantidade: 0,
    usuarioResponsavel: 'Usuário Logado',
    motivo: '',
    precoVenda: 0
  });
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    nome: '',
    descricao: '',
    sku: '',
    precoCusto: 0,
    precoVenda: 0,
    quantidadeEstoque: 0,
    estoqueMinimo: 0,
    unidadeMedida: 'UN',
    categoria: { id: 0, name: '' },
    fornecedor: { id: 0, name: '' }
  });

  // Loading states
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingMovement, setIsCreatingMovement] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name.includes('preco') || name.includes('quantidade') || name.includes('estoque')
        ? Number(value)
        : value
    });
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [name]: name.includes('preco') || name.includes('quantidade') || name.includes('estoque')
          ? Number(value)
          : value
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'categoria') {
      const selectedCategory = categories.find(c => c.id === value);
      setNewProduct({
        ...newProduct,
        categoria: { id: value, name: selectedCategory?.nome || '' }
      });
    } else if (name === 'fornecedor') {
      const selectedSupplier = suppliers.find(s => s.id === value);
      setNewProduct({
        ...newProduct,
        fornecedor: { id: value, name: selectedSupplier?.nome || '' }
      });
    }
  };

  const handleEditSelectChange = (e: any) => {
    const { name, value } = e.target;
    if (editingProduct) {
      if (name === 'categoria') {
        const selectedCategory = categories.find(c => c.id === value);
        setEditingProduct({
          ...editingProduct,
          categoria: { id: value, name: selectedCategory?.nome || '' }
        });
      } else if (name === 'fornecedor') {
        const selectedSupplier = suppliers.find(s => s.id === value);
        setEditingProduct({
          ...editingProduct,
          fornecedor: { id: value, name: selectedSupplier?.nome || '' }
        });
      }
    }
  };

  const handleSubmit = async () => {
    setIsAdding(true);
    const success = await onAddProduct(newProduct);
    setIsAdding(false);

    if (success) {
      setSnackbar({
        open: true,
        message: 'Produto adicionado com sucesso!',
        severity: 'success'
      });
      setOpenAddModal(false);
      setNewProduct({
        nome: '',
        descricao: '',
        sku: '',
        precoCusto: 0,
        precoVenda: 0,
        quantidadeEstoque: 0,
        estoqueMinimo: 0,
        unidadeMedida: 'UN',
        categoria: { id: 0, name: '' },
        fornecedor: { id: 0, name: '' }
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Erro ao adicionar produto',
        severity: 'error'
      });
    }
  };

  const handleEditSubmit = async () => {
    if (!editingProduct) return;

    setIsEditing(true);
    const { id, ...productData } = editingProduct;
    const success = await onUpdateProduct(id, productData);
    setIsEditing(false);

    if (success) {
      setSnackbar({
        open: true,
        message: 'Produto atualizado com sucesso!',
        severity: 'success'
      });
      handleCloseEditModal();
    } else {
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar produto',
        severity: 'error'
      });
    }
  };

  const categoryOptions = [
    { id: 'all', name: 'All' },
    ...Array.from(new Set(products
      .map(product => product.categoria)
      .filter(cat => cat && cat.id && cat.name)
    ))
      .map(category => ({
        id: category.id,
        name: category.name
      }))
  ];

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = Number(e.target.value);
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      category: value
    }));
  };

  const handleSelectAllProducts = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedProducts(
      event.target.checked
        ? products.map((product) => product.id)
        : []
    );
  };

  const handleSelectOneProduct = (
    event: ChangeEvent<HTMLInputElement>,
    productId: number
  ): void => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prevSelected) => [
        ...prevSelected,
        productId
      ]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((id) => id !== productId)
      );
    }
  };

  const handlePageChange = (event: unknown, newPage: number): void => {
    onPageChange(newPage, size);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newSize = parseInt(event.target.value);
    onPageChange(0, newSize);
  };

  const handleOpenMovementModal = (product: Product) => {
    setCurrentProduct(product);
    setMovementData({
      produtoId: product.id,
      tipo: 'ENTRADA',
      quantidade: 0,
      usuarioResponsavel: 'Usuário Logado',
      motivo: 'COMPRA',
      precoVenda: product.precoVenda
    });
    setOpenMovementModal(true);
  };

  const handleCloseMovementModal = () => {
    setOpenMovementModal(false);
    setCurrentProduct(null);
  };

  const handleMovementInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMovementData({
      ...movementData,
      [name]: name === 'quantidade' || name === 'precoVenda'
        ? Number(value)
        : value
    });
  };

  const handleMovementTypeChange = (e: any) => {
    setMovementData({
      ...movementData,
      tipo: e.target.value
    });
    setMovementData(prev => ({ ...prev, motivo: '' }));
  };

  const handleMovementReasonChange = (e: any) => {
    setMovementData({
      ...movementData,
      motivo: e.target.value
    });
  };

  const handleSubmitMovement = async () => {
    setIsCreatingMovement(true);
    try {
      const success = await onCreateMovement(movementData);
      setIsCreatingMovement(false);

      if (success) {
        setSnackbar({
          open: true,
          message: 'Movimentação registrada com sucesso!',
          severity: 'success'
        });
        handleCloseMovementModal();
      } else {
        setSnackbar({
          open: true,
          message: 'Erro ao registrar movimentação',
          severity: 'error'
        });
      }
    } catch (err) {
      setIsCreatingMovement(false);
      console.error('Error creating movement:', err);
      setSnackbar({
        open: true,
        message: 'Erro ao registrar movimentação',
        severity: 'error'
      });
    }
  };

  const filteredProducts = applyFilters(products, filters);
  const selectedSomeProducts =
    selectedProducts.length > 0 &&
    selectedProducts.length < products.length;
  const selectedAllProducts =
    selectedProducts.length === products.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box display="flex" alignItems="center" gap={2}>
              <Box width={150}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Categoria</InputLabel>
                  <Select
                    value={filters.category || 'all'}
                    onChange={handleCategoryChange}
                    label="Categoria"
                    autoWidth
                  >
                    {categoryOptions.map((categoryOption) => (
                      <MenuItem key={categoryOption.id} value={categoryOption.id}>
                        {categoryOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddModal}
              >
                Adicionar
              </Button>
            </Box>
          }
          title="Produtos"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllProducts}
                  indeterminate={selectedSomeProducts}
                  onChange={handleSelectAllProducts}
                />
              </TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell align="right">Total Profit</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => {
              const isProductSelected = selectedProducts.includes(
                product.id
              );
              return (
                <TableRow
                  hover
                  key={product.id}
                  selected={isProductSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isProductSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneProduct(event, product.id)
                      }
                      value={isProductSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {product.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {product.descricao}
                    </Typography>
                    <Typography fontSize={10} variant="body2" color="text.secondary" noWrap>
                      Última vez modificado: {format(new Date(product.updatedAt), 'dd/MM/yyyy HH:mm:ss')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {product.sku}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {product.categoria?.name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {product.fornecedor?.name || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {numeral(product.precoVenda).format('$0,0.00')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      Cost: {numeral(product.precoCusto).format('$0,0.00')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {getStockStatusLabel(product.quantidadeEstoque, product.estoqueMinimo)}
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {product.quantidadeEstoque} {product.unidadeMedida}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {numeral(product.lucroTotal).format('$0,0.00')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {product.totalSaidas} sales
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit Product" arrow>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                        onClick={() => handleOpenEditModal(product)}
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Registrar Movimentação" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.info.lighter },
                          color: theme.palette.info.main
                        }}
                        color="inherit"
                        size="small"
                        onClick={() => handleOpenMovementModal(product)}
                      >
                        <InventoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={totalElements}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={size}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {/* Modal de Movimentação */}
      <Dialog open={openMovementModal} onClose={handleCloseMovementModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Registrar Movimentação - {currentProduct?.nome || ''}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ pt: 2 }} noValidate>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de Movimentação</InputLabel>
              <Select
                name="tipo"
                value={movementData.tipo}
                onChange={handleMovementTypeChange}
                label="Tipo de Movimentação"
              >
                <MenuItem value="ENTRADA">Entrada</MenuItem>
                <MenuItem value="SAIDA">Saída</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Quantidade"
              name="quantidade"
              type="number"
              value={movementData.quantidade}
              onChange={handleMovementInputChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Preço de Venda"
              name="precoVenda"
              type="number"
              value={movementData.precoVenda}
              onChange={handleMovementInputChange}
              InputProps={{
                startAdornment: 'R$'
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Responsável"
              name="usuarioResponsavel"
              value={movementData.usuarioResponsavel}
              onChange={handleMovementInputChange}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Motivo</InputLabel>
              <Select
                name="motivo"
                value={movementData.motivo}
                onChange={handleMovementReasonChange}
                label="Motivo"
              >
                {movementData.tipo === 'ENTRADA' ? [
                  <MenuItem key="compra" value="COMPRA">Compra</MenuItem>,
                  <MenuItem key="reabastecimento" value="REABASTECIMENTO">Reabastecimento</MenuItem>,
                  <MenuItem key="devolucao" value="DEVOLUCAO">Devolução</MenuItem>,
                ] : [
                  <MenuItem key="venda" value="VENDA">Venda</MenuItem>,
                  <MenuItem key="perda" value="PERDA">Perda</MenuItem>,
                  <MenuItem key="danificado" value="DANIFICADO">Danificado</MenuItem>,
                ]}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMovementModal}>Cancelar</Button>
          <Button
            onClick={handleSubmitMovement}
            variant="contained"
            disabled={!movementData.quantidade || !movementData.usuarioResponsavel || isCreatingMovement}
          >
            {isCreatingMovement ? <CircularProgress size={24} /> : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Adição */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Novo Produto</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ pt: 2 }} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Nome"
              name="nome"
              value={newProduct.nome}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Descrição"
              name="descricao"
              value={newProduct.descricao}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="SKU"
              name="sku"
              value={newProduct.sku}
              onChange={handleInputChange}
              required
            />
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                margin="normal"
                label="Preço de Custo"
                name="precoCusto"
                type="number"
                value={newProduct.precoCusto}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: 'R$'
                }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Preço de Venda"
                name="precoVenda"
                type="number"
                value={newProduct.precoVenda}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: 'R$'
                }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                margin="normal"
                label="Estoque Atual"
                name="quantidadeEstoque"
                type="number"
                value={newProduct.quantidadeEstoque}
                onChange={handleInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Estoque Mínimo"
                name="estoqueMinimo"
                type="number"
                value={newProduct.estoqueMinimo}
                onChange={handleInputChange}
              />
            </Box>
            <FormControl fullWidth margin="normal">
              <InputLabel>Unidade de Medida</InputLabel>
              <Select
                name="unidadeMedida"
                value={newProduct.unidadeMedida}
                onChange={handleInputChange}
                label="Unidade de Medida"
              >
                <MenuItem value="UN">Unidade (UN)</MenuItem>
                <MenuItem value="KG">Quilograma (KG)</MenuItem>
                <MenuItem value="LT">Litro (LT)</MenuItem>
                <MenuItem value="M">Metro (M)</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Categoria</InputLabel>
              <Select
                name="categoria"
                value={newProduct.categoria.id}
                onChange={handleSelectChange}
                label="Categoria"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Fornecedor</InputLabel>
              <Select
                name="fornecedor"
                value={newProduct.fornecedor.id}
                onChange={handleSelectChange}
                label="Fornecedor"
                required
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !newProduct.nome ||
              !newProduct.sku ||
              !newProduct.categoria.id ||
              !newProduct.fornecedor.id ||
              isAdding
            }
          >
            {isAdding ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Produto - {editingProduct?.nome || ''}</DialogTitle>
        <DialogContent dividers>
          {editingProduct && (
            <Box component="form" sx={{ pt: 2 }} noValidate>
              <TextField
                fullWidth
                margin="normal"
                label="Nome"
                name="nome"
                value={editingProduct.nome}
                onChange={handleEditInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Descrição"
                name="descricao"
                value={editingProduct.descricao}
                onChange={handleEditInputChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="SKU"
                name="sku"
                value={editingProduct.sku}
                onChange={handleEditInputChange}
                required
              />
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Preço de Custo"
                  name="precoCusto"
                  type="number"
                  value={editingProduct.precoCusto}
                  onChange={handleEditInputChange}
                  InputProps={{
                    startAdornment: 'R$'
                  }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Preço de Venda"
                  name="precoVenda"
                  type="number"
                  value={editingProduct.precoVenda}
                  onChange={handleEditInputChange}
                  InputProps={{
                    startAdornment: 'R$'
                  }}
                />
              </Box>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Estoque Atual"
                  name="quantidadeEstoque"
                  type="number"
                  value={editingProduct.quantidadeEstoque}
                  onChange={handleEditInputChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Estoque Mínimo"
                  name="estoqueMinimo"
                  type="number"
                  value={editingProduct.estoqueMinimo}
                  onChange={handleEditInputChange}
                />
              </Box>
              <FormControl fullWidth margin="normal">
                <InputLabel>Unidade de Medida</InputLabel>
                <Select
                  name="unidadeMedida"
                  value={editingProduct.unidadeMedida}
                  onChange={handleEditInputChange}
                  label="Unidade de Medida"
                >
                  <MenuItem value="UN">Unidade (UN)</MenuItem>
                  <MenuItem value="KG">Quilograma (KG)</MenuItem>
                  <MenuItem value="LT">Litro (LT)</MenuItem>
                  <MenuItem value="M">Metro (M)</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="categoria"
                  value={editingProduct.categoria.id}
                  onChange={handleEditSelectChange}
                  label="Categoria"
                  required
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Fornecedor</InputLabel>
                <Select
                  name="fornecedor"
                  value={editingProduct.fornecedor.id}
                  onChange={handleEditSelectChange}
                  label="Fornecedor"
                  required
                >
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancelar</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={
              !editingProduct?.nome ||
              !editingProduct?.sku ||
              !editingProduct?.categoria.id ||
              !editingProduct?.fornecedor.id ||
              isEditing
            }
          >
            {isEditing ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as any}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

ProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  suppliers: PropTypes.array.isRequired,
  totalElements: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  onAddProduct: PropTypes.func.isRequired,
  onUpdateProduct: PropTypes.func.isRequired,
  onCreateMovement: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired
};

ProductsTable.defaultProps = {
  className: ''
};

export default ProductsTable;