import {
  type AuthenticityCombinationsAllowed,
  type AuthenticityCodeOptions,
  type AuthenticityCode,
  AUTHENTICITY_CODES,
} from "@mono/types";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import type { ReactElement } from "react";
import { getSelectionState } from "../../../utils/checkboxSelections";

type AuthenticityPickerProps = {
  selected: AuthenticityCodeOptions;
  onChange: (next: Set<AuthenticityCode>) => void;
  combinationsAllowed: AuthenticityCombinationsAllowed;
  setCombinations: (next: boolean) => void;
};

const AuthenticityPicker = (props: AuthenticityPickerProps): ReactElement => {
  const { selected, onChange, combinationsAllowed, setCombinations } = props;

  const { checked, indeterminate } = getSelectionState(
    AUTHENTICITY_CODES,
    selected,
  );

  const toggleAuthenticity = (code: AuthenticityCode): void => {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    onChange(next);
  };

  const togggleSelectAll = (): void => {
    const next = new Set(selected);
    for (const code of AUTHENTICITY_CODES) {
      if (checked) next.delete(code);
      else next.add(code);
    }
    onChange(next);
  };

  return (
    <FormControl component={"fieldset"} variant="standard">
      <FormLabel component={"legend"}>Authenticity</FormLabel>
      <FormGroup>
        <Box>
          <FormControlLabel
            label={"Select All"}
            control={
              <Checkbox
                checked={checked}
                indeterminate={indeterminate}
                onChange={() => togggleSelectAll()}
              />
            }
          />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
            {AUTHENTICITY_CODES.map((code) => (
              <FormControlLabel
                key={code}
                label={code}
                control={
                  <Checkbox
                    checked={selected.has(code)}
                    onChange={() => toggleAuthenticity(code)}
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
        </Box>
      </FormGroup>
    </FormControl>
  );
};

export default AuthenticityPicker;
