import { Box, Typography } from "@mui/material";
import { type ReactElement } from "react";

type HomePageProps = {
  name: string;
};

// TODO: Typography test: body1 and body2 are too small and not substantially different from subtitle
const HomePage = (props: HomePageProps): ReactElement => {
  return (
    <Box>
      <Typography variant="h3">
        Welcome, {props.name ? props.name : "Mysterious Stranger"}!
      </Typography>

      <Typography variant="body1">
        This is the landing page once the user has logged in. Insert overview of
        app later.
      </Typography>

      <Box>
        <Typography variant="h1" component="h1">
          Typography Test:
        </Typography>
        <Typography variant="h1" component="h1">
          A Full Stack Project h1
        </Typography>
        <Typography variant="h2" component="h2">
          A Full Stack Project h2
        </Typography>
        <Typography variant="h3" component="h3">
          A Full Stack Project h3
        </Typography>
        <Typography variant="h4" component="h4">
          A Full Stack Project h4
        </Typography>
        <Typography variant="h5" component="h5">
          A Full Stack Project h5
        </Typography>
        <Typography variant="h6" component="h6">
          A Full Stack Project h6
        </Typography>
        <Typography variant="body1" component="p">
          A Full Stack Project body 1
        </Typography>
        <Typography variant="body2" component="p">
          A Full Stack Project body 2
        </Typography>
        <Typography variant="subtitle1">
          A Full Stack Project subtitle 1
        </Typography>
        <Typography variant="subtitle2">
          A Full Stack Project subtitle 2
        </Typography>
        <Typography variant="button">A Full Stack Project button</Typography>
        <Typography variant="caption">A Full Stack Project caption</Typography>
        <Typography variant="overline">
          A Full Stack Project overline
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
