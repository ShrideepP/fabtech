import { Icons } from "@/components/icons";

export const COMPANY_NAME = "Fabtech";

export const PAGE_LINKS = [
  {
    id: 1,
    name: "Marketing",
    pageURL: "/",
    icon: Icons.megaphone,
  },
  {
    id: 2,
    name: "Add Customer",
    pageURL: "/marketing/add",
    icon: Icons.plus,
  },
  {
    id: 3,
    name: "Finalised Measurements",
    pageURL: "/finalised-measurements",
    icon: Icons.ruler,
  },
  {
    id: 4,
    name: "Add Measurement",
    pageURL: "/finalised-measurements/add",
    icon: Icons.plus,
  },
];

export const CDN_URL =
  "https://jrorlcgdsixdlvhlwfja.supabase.co/storage/v1/object/public/files";

export const FOLDER_NAMES = {
  quotation: "/quotation",
  finalisedQuotation: "/finalised-quotation",
  bill: "/bill",
};

export const FLOW_SEARCH_PARAMS = {
  step1: "basic-details",
  step2: "product-measurements",
  step3: "process-details",
};

export const TABLE_NAMES = {
  marketing: "marketing",
  finalisedMeasurements: "finalised_measurements",
  productMeasurements: "product_measurements",
};

export const DESIGN_VARIANTS = {
  "regular-design": {
    "2 shutters 5x7": 380,
    "3 shutters 5x7": 410,
    "3 shutters 6x7": 390,
    "4 shutters 7x7": 390,
    "4 shutters 8x7": 390,
  },
  "vertical-horizontal": {
    "2 shutters 5x7": 380,
    "3 shutters 5x7": 420,
    "3 shutters 6x7": 410,
    "4 shutters 7x7": 410,
    "4 shutters 8x7": 410,
  },
  "square-tube-design-with-centre-plate": {
    "2 shutters 5x7": 380,
    "3 shutters 5x7": 420,
    "3 shutters 6x7": 410,
    "4 shutters 7x7": 410,
    "4 shutters 8x7": 410,
  },
  "square-tube-design-without-centre-plate": {
    "2 shutters 5x7": 390,
    "3 shutters 5x7": 430,
    "3 shutters 6x7": 420,
    "4 shutters 7x7": 420,
    "4 shutters 8x7": 420,
  },
  "safety-door": {
    "Single shutter 2.5x7": 400,
    "Single shutter 3x7": 400,
    "2 shutters 4x7": 380,
  },
  "openable-window": {
    "Openable window": 450,
  },
};
