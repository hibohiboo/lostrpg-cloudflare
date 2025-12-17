import { Box, Container, Typography } from '@mui/material';

export function EditPageWrapper({
  children,
  title,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          {title}
        </Typography>
        {children}
      </Box>
    </Container>
  );
}
