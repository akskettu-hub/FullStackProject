import { Typography } from "@mui/material";
import { type ReactElement } from "react";

type GreetingProps = {
  name: string;
};

const Greeting = (props: GreetingProps): ReactElement => {
  return (
    <div>
      <p>Welcome, {props.name}!</p>
    </div>
  );
};

type HomePageProps = {
  name: string;
};

const HomePage = (props: HomePageProps): ReactElement => {
  return (
    <div>
      <Greeting name={props.name ? props.name : "Mysterious Stranger"} />

      <div>
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
          Seek and thou shalt find body 1
        </Typography>
        <Typography variant="body2" component="p">
          Seek and thou shalt find body 2
        </Typography>
      </div>
    </div>
  );
};

export default HomePage;
