import {
  RELATIONSHIP_CODES,
  type RelationshipCode,
  type RelationshipCodeOptions,
} from "@mono/types";
import type { ReactElement } from "react";
import { getSelectionState } from "../../../utils/checkboxSelections";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

type RelationshipCodePickerProps = {
  selected: RelationshipCodeOptions;
  onChange: (next: Set<RelationshipCode>) => void;
};

const RelationshipCodePicker = (
  props: RelationshipCodePickerProps,
): ReactElement => {
  const { selected, onChange } = props;

  const { checked, indeterminate } = getSelectionState(
    RELATIONSHIP_CODES,
    selected,
  );

  const toggleRelationshipCode = (code: RelationshipCode): void => {
    const next = new Set(selected);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    onChange(next);
  };

  const togggleSelectAll = (): void => {
    const next = new Set(selected);
    for (const code of RELATIONSHIP_CODES) {
      if (checked) next.delete(code);
      else next.add(code);
    }
    onChange(next);
  };

  return (
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
          {RELATIONSHIP_CODES.map((code) => (
            <FormControlLabel
              key={code}
              label={code}
              control={
                <Checkbox
                  checked={selected.has(code)}
                  onChange={() => toggleRelationshipCode(code)}
                />
              }
            />
          ))}
        </Box>
      </Box>
    </FormGroup>
  );
};

export default RelationshipCodePicker;
