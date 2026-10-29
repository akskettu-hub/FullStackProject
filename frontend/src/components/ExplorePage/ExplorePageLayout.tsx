import { Box } from "@mui/material";
import type { SubNavItem } from "../SubNav";
import SubNav from "../SubNav";
import { Outlet } from "react-router-dom";
import type { ReactElement } from "react";

const items: SubNavItem[] = [
  { label: "Corpora", to: "/explore/corpora" },
  { label: "Authors", to: "/explore/authors" },
];

const ExplorePageLayout = (): ReactElement => (
  <>
    <SubNav items={items} />
    <Box sx={{ pt: 1, pb: 1 }}>
      <Outlet />
    </Box>
  </>
);

export default ExplorePageLayout;
