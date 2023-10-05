import { useTheme } from "next-themes";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  let muiTheme = createTheme({ palette: { mode: theme } });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
