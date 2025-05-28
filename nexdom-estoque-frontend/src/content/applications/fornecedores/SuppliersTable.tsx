
import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import {
  Tooltip,
  Divider,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
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
  CircularProgress, TableRow
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddIcon from '@mui/icons-material/Add';

interface Supplier {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  createdAt: string;
  updatedAt: string;
}

interface SuppliersTableProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  onUpdateSupplier: (id: number, supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  onDeleteSupplier: (id: number) => Promise<boolean>;
}

const SuppliersTable: FC<SuppliersTableProps> = ({
                                                   suppliers,
                                                   onAddSupplier,
                                                   onUpdateSupplier,
                                                   onDeleteSupplier
                                                 }) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingSupplierId, setDeletingSupplierId] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>>({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    endereco: ''
  });

  // Loading states
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingSupplier(null);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDeletingSupplierId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeletingSupplierId(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupplier({
      ...newSupplier,
      [name]: value
    });
  };

  const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingSupplier) {
      setEditingSupplier({
        ...editingSupplier,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    setIsAdding(true);
    const success = await onAddSupplier(newSupplier);
    setIsAdding(false);

    if (success) {
      setSnackbar({
        open: true,
        message: 'Fornecedor adicionado com sucesso!',
        severity: 'success'
      });
      setOpenAddModal(false);
      setNewSupplier({
        nome: '',
        cnpj: '',
        telefone: '',
        email: '',
        endereco: ''
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Erro ao adicionar fornecedor',
        severity: 'error'
      });
    }
  };

  const handleEditSubmit = async () => {
    if (!editingSupplier) return;

    setIsEditing(true);
    const { id, ...supplierData } = editingSupplier;
    const success = await onUpdateSupplier(id, supplierData);
    setIsEditing(false);

    if (success) {
      setSnackbar({
        open: true,
        message: 'Fornecedor atualizado com sucesso!',
        severity: 'success'
      });
      handleCloseEditModal();
    } else {
      setSnackbar({
        open: true,
        message: 'Erro ao atualizar fornecedor',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingSupplierId) return;

    setIsDeleting(true);
    const success = await onDeleteSupplier(deletingSupplierId);
    setIsDeleting(false);

    if (success) {
      setSnackbar({
        open: true,
        message: 'Fornecedor excluído com sucesso!',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Erro ao excluir fornecedor',
        severity: 'error'
      });
    }
    handleCloseDeleteDialog();
  };

  const theme = useTheme();

  return (
    <Card>
      <CardHeader
        action={
          <Box width={150}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddModal}
            >
              Adicionar
            </Button>
          </Box>
        }
        title="Fornecedores"
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Atualizado em</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers?.map((supplier) => (
              <TableRow hover key={supplier.id}>
                <TableCell>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {supplier.nome}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {supplier.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" color="text.primary" noWrap>
                    {supplier.cnpj}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" color="text.primary" noWrap>
                    {supplier.telefone}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {supplier.endereco}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {format(new Date(supplier.updatedAt), 'dd/MM/yyyy HH:mm')}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar Fornecedor" arrow>
                    <IconButton
                      sx={{
                        '&:hover': {
                          background: theme.colors.primary.lighter
                        },
                        color: theme.palette.primary.main
                      }}
                      color="inherit"
                      size="small"
                      onClick={() => handleOpenEditModal(supplier)}
                    >
                      <EditTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir Fornecedor" arrow>
                    <IconButton
                      sx={{
                        '&:hover': { background: theme.colors.error.lighter },
                        color: theme.palette.error.main
                      }}
                      color="inherit"
                      size="small"
                      onClick={() => handleOpenDeleteDialog(supplier.id)}
                    >
                      <DeleteTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Adição */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal} maxWidth="sm" fullWidth>
        <DialogTitle>Adicionar Novo Fornecedor</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ pt: 2 }} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Nome"
              name="nome"
              value={newSupplier.nome}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="CNPJ"
              name="cnpj"
              value={newSupplier.cnpj}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Telefone"
              name="telefone"
              value={newSupplier.telefone}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={newSupplier.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Endereço"
              name="endereco"
              value={newSupplier.endereco}
              onChange={handleInputChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !newSupplier.nome ||
              !newSupplier.cnpj ||
              !newSupplier.telefone ||
              !newSupplier.email ||
              !newSupplier.endereco ||
              isAdding
            }
          >
            {isAdding ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={openEditModal} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Fornecedor - {editingSupplier?.nome || ''}</DialogTitle>
        <DialogContent dividers>
          {editingSupplier && (
            <Box component="form" sx={{ pt: 2 }} noValidate>
              <TextField
                fullWidth
                margin="normal"
                label="Nome"
                name="nome"
                value={editingSupplier.nome}
                onChange={handleEditInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="CNPJ"
                name="cnpj"
                value={editingSupplier.cnpj}
                onChange={handleEditInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Telefone"
                name="telefone"
                value={editingSupplier.telefone}
                onChange={handleEditInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={editingSupplier.email}
                onChange={handleEditInputChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Endereço"
                name="endereco"
                value={editingSupplier.endereco}
                onChange={handleEditInputChange}
                required
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancelar</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={
              !editingSupplier?.nome ||
              !editingSupplier?.cnpj ||
              !editingSupplier?.telefone ||
              !editingSupplier?.email ||
              !editingSupplier?.endereco ||
              isEditing
            }
          >
            {isEditing ? <CircularProgress size={24} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Excluir'}
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

export default SuppliersTable;