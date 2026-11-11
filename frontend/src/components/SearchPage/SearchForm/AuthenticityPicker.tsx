import type {
  AuthenticityCombinationsAllowed,
  AuthenticityCodeOptions,
  SearchOptions,
} from "@mono/types";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import type { ReactElement } from "react";

type AuthenticityPickerProps = {
  options: SearchOptions["authenticity"];
  selected: AuthenticityCodeOptions;
  onChange: (next: Set<string>) => void;
  combinationsAllowed: AuthenticityCombinationsAllowed;
  setCombinations: (next: boolean) => void;
};

const AuthenticityPicker = (props: AuthenticityPickerProps): ReactElement => {
  const { options, selected, onChange, combinationsAllowed, setCombinations } =
    props;

  const toggleAuthenticity = (authKey: string): void => {
    const next = new Set(selected);
    if (next.has(authKey)) next.delete(authKey);
    else next.add(authKey);
    onChange(next);
  };

  return (
    <FormGroup>
      <Box
        key={"authenticity-options"}
        sx={{ display: "flex", flexDirection: "column", ml: 3 }}
      >
        {options
          .filter((opt) => opt.length === 1)
          .map((opt) => (
            <FormControlLabel
              label={opt}
              control={
                <Checkbox
                  checked={selected.has(opt)}
                  onChange={() => toggleAuthenticity(opt)}
                />
              }
            />
          ))}

        <FormControlLabel
          label={"Combinations"}
          control={
            <Checkbox
              checked={combinationsAllowed}
              onChange={() => setCombinations(!combinationsAllowed)}
            />
          }
        />
      </Box>
    </FormGroup>
  );
};

export default AuthenticityPicker;
