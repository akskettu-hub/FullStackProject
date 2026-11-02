// Partially LLM generated: Claude Sonnet 5.5 Medium
import type { SearchOptions } from "@mono/types";
import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import type { ReactElement } from "react";

type CorpusPickerProps = {
  options: SearchOptions;
  selected: Set<number>;
  onChange: (next: Set<number>) => void;
};

const getCorpusCollectionState = (
  options: SearchOptions[number],
  selected: Set<number>,
): { checked: boolean; indeterminate: boolean } => {
  const ids = options.corpora.map((c) => c.id);

  const checked = ids.length > 0 && ids.every((id) => selected.has(id));
  const indeterminate = !checked && ids.some((id) => selected.has(id));

  console.log({ checked, indeterminate });

  return { checked, indeterminate };
};

const CorpusPicker = (props: CorpusPickerProps): ReactElement => {
  const { options, selected, onChange } = props;

  const toggleCorpus = (id: number): void => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  const toggleCorpusCollection = (collection: SearchOptions[number]): void => {
    const { checked } = getCorpusCollectionState(collection, selected);
    const next = new Set(selected);
    for (const corpus of collection.corpora) {
      if (checked) next.delete(corpus.id);
      else next.add(corpus.id);
    }
    onChange(next);
  };

  return (
    <FormGroup>
      {options.map((opt) => {
        const { checked, indeterminate } = getCorpusCollectionState(
          opt,
          selected,
        );
        return (
          <Box key={opt.id}>
            <FormControlLabel
              label={opt.name}
              control={
                <Checkbox
                  checked={checked}
                  indeterminate={indeterminate}
                  onChange={() => toggleCorpusCollection(opt)}
                />
              }
              onChange={() => console.log("change")}
            />
            <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
              {opt.corpora.map((corpus) => (
                <FormControlLabel
                  key={corpus.id}
                  label={corpus.name}
                  control={
                    <Checkbox
                      checked={selected.has(corpus.id)}
                      onChange={() => toggleCorpus(corpus.id)}
                    />
                  }
                />
              ))}
            </Box>
          </Box>
        );
      })}
    </FormGroup>
  );
};

export default CorpusPicker;
