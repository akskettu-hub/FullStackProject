import { Paper, styled } from "@mui/material";

const SummaryStackItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(0.5, 1.5), // 4px vertical, 12px horizontal
}));

export default SummaryStackItem;
