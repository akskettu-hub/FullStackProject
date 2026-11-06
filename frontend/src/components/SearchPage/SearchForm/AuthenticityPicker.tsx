import type { SearchOptions } from "@mono/types";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import type { ReactElement } from "react";

type AuthenticityPickerProps = {
  options: SearchOptions["authenticity"];
  selected: Set<string>;
  onChange: (next: Set<string>) => void;
};

const AuthenticityPicker = (props: AuthenticityPickerProps): ReactElement => {
  const { options, selected, onChange } = props;

  const toggleAuthenticity = (authKey: string): void => {
    const next = new Set(selected);
    if (next.has(authKey)) next.delete(authKey);
    else next.add(authKey);
    onChange(next);
  };

  return (
    <FormGroup>
      <Box key={"authenticity-options"}>
        {options.map((opt) => (
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
      </Box>
    </FormGroup>
  );
};

export default AuthenticityPicker;
