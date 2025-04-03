import { Grid, Container, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Header from "../../components/Header/Header";

function MainLayout({ thumbnail, leftSidebar, content, rightSidebar }) {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {/* Thumbnail Row (Optional) */}
        {thumbnail && (
          <Grid item xs={12}>
            {thumbnail}
          </Grid>
        )}

        {/* Main Content Row */}
        {/* Left Sidebar */}
        <Grid item xs={12} md={3} lg={3} sx={{ 
          display: { xs: 'none', md: 'block' }
        }}>
          {leftSidebar}
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={6} lg={6}>
          {content}
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={3} lg={3} sx={{ 
          display: { xs: 'none', md: 'block' }
        }}>
          {rightSidebar}
        </Grid>
      </Grid>
    </Container>
  );
}

export default MainLayout;
