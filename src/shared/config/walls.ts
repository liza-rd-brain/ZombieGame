import { CellsBarrierListType } from "../../business/types";

// The array is convenient for iterating
export const CELLS_BARRIERS_LIST: CellsBarrierListType = [
  {
    coord: { hor: 2, vert: 2 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 2, vert: 3 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 2, vert: 4 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 2, vert: 5 },
    barrier: {
      bottom: null,
      left: { name: "window", isOpen: true },
    },
  },
  {
    coord: { hor: 2, vert: 6 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 2, vert: 7 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 2, vert: 8 },
    barrier: {
      bottom: null,
      left: { name: "window", isOpen: true },
    },
  },
  {
    coord: { hor: 2, vert: 9 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 2, vert: 10 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 3, vert: 10 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 4, vert: 10 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 5, vert: 10 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 6, vert: 10 },
    barrier: {
      bottom: { name: "door", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 7, vert: 10 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 8, vert: 10 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 9, vert: 10 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 10, vert: 10 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },

  {
    coord: { hor: 7, vert: 9 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },

  {
    coord: { hor: 3, vert: 2 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 4, vert: 2 },
    barrier: {
      bottom: { name: "door", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 5, vert: 2 },
    barrier: {
      bottom: { name: "window", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 6, vert: 2 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 7, vert: 2 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 8, vert: 2 },
    barrier: {
      bottom: { name: "window", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 9, vert: 2 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 10, vert: 2 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },

  {
    coord: { hor: 10, vert: 7 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },

  {
    coord: { hor: 3, vert: 7 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 4, vert: 9 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },

  {
    coord: { hor: 4, vert: 8 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },

  {
    coord: { hor: 4, vert: 7 },
    barrier: {
      bottom: { name: "door", isOpen: true },
      left: { name: "door", isOpen: true },
    },
  },
  {
    coord: { hor: 5, vert: 7 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 6, vert: 7 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },

  {
    coord: { hor: 7, vert: 7 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 7, vert: 8 },
    barrier: {
      bottom: null,
      left: { name: "door", isOpen: true },
    },
  },
  {
    coord: { hor: 8, vert: 7 },
    barrier: {
      bottom: { name: "wall", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 9, vert: 7 },
    barrier: {
      bottom: { name: "door", isOpen: true },
      left: null,
    },
  },
  {
    coord: { hor: 7, vert: 6 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 7, vert: 5 },
    barrier: {
      bottom: null,
      left: { name: "door", isOpen: true },
    },
  },
  {
    coord: { hor: 7, vert: 4 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 7, vert: 3 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 11, vert: 10 },
    barrier: {
      bottom: null,
      left: null,
    },
  },

  {
    coord: { hor: 11, vert: 9 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },

  {
    coord: { hor: 11, vert: 8 },
    barrier: {
      bottom: null,
      left: { name: "window", isOpen: true },
    },
  },
  {
    coord: { hor: 11, vert: 7 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 11, vert: 6 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 11, vert: 5 },
    barrier: {
      bottom: null,
      left: { name: "window", isOpen: true },
    },
  },
  {
    coord: { hor: 11, vert: 4 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 11, vert: 3 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
  {
    coord: { hor: 11, vert: 2 },
    barrier: {
      bottom: null,
      left: { name: "wall", isOpen: true },
    },
  },
];
