import { tags } from "../constant/constant";
export const findTagColor = (tagValue) => {
  for (const category in tags) {
    const foundTag = tags[category].find((tag) => tag.value === tagValue);
    if (foundTag) return foundTag.color;
  }
  return "#222222";
};

import useRoleProduction from "./Roles/ProductionRole";
import useRoleMotion from "./Roles/MotionRoles";
import useRoleDesign from "./Roles/DesignRoles";
import useRoleDocs from "./Roles/DocsRoles";

import crewImport from "./CrewImport";
import equipImport from "./EquipImport";
import { usePrivilege, useHasPermission } from "./Privilege";

import useProductionPrice from "./Pricelist/useProductionPrice";
import useDesignPrice from "./Pricelist/useDesignPrice";
import useMotionPrice from "./Pricelist/useMotionPrice";
import useDocumentationPrice from "./Pricelist/useDocumentationPrice";
import use3DPrice from "./Pricelist/use3DPrice";

export {
  useRoleProduction,
  useRoleMotion,
  crewImport,
  equipImport,
  useRoleDesign,
  useRoleDocs,
  usePrivilege,
  useHasPermission,
  useProductionPrice,
  useDesignPrice,
  useMotionPrice,
  useDocumentationPrice,
  use3DPrice,
};
