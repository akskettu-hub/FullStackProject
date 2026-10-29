// Mostly LLM generated: Claude Sonnet 5.5 Medium
import { Tab, Tabs } from "@mui/material";
import type { ReactElement } from "react";
import { Link, matchPath, useLocation } from "react-router-dom";

export type SubNavItem = { label: string; to: string };

const SubNav = ({ items }: { items: SubNavItem[] }): ReactElement => {
  const { pathname } = useLocation();
  const current = items.find((i) =>
    matchPath({ path: i.to, end: false }, pathname),
  );

  return (
    <Tabs
      value={current?.to ?? false}
      aria-label="Section Navigation"
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      {items.map((i) => (
        <Tab
          key={i.to}
          label={i.label}
          value={i.to}
          component={Link}
          to={i.to}
        />
      ))}
    </Tabs>
  );
};

export default SubNav;
