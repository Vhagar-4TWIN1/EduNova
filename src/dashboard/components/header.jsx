import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="50px">
      <Typography
        variant="h2"
        color={colors.primary[500]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.primary[600]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
