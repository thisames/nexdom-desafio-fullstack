// MovementsTable.tsx
import { FC } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Typography,
  CardHeader,
  Divider,
  Chip
} from '@mui/material';
import { Movement } from './MovementsIndex';

interface MovementsTableProps {
  movements: Movement[];
}

const MovementsTable: FC<MovementsTableProps> = ({ movements }) => {
  return (
    <Card>
      <CardHeader title="Movimentações de Estoque" />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Quantidade</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Data/Hora</TableCell>
              <TableCell align="right">Preço (R$)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.map((movement) => (
              <TableRow hover key={movement.id}>
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {movement.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ID: {movement.productId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={movement.type}
                    color={movement.type === 'ENTRADA' ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight="bold">
                    {movement.quantity}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {movement.reason}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {movement.responsibleUser}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {format(new Date(movement.dateTime), 'dd/MM/yyyy HH:mm')}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight="bold">
                    {movement.salePrice.toFixed(2)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default MovementsTable;