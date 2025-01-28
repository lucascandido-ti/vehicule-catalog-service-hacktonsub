export enum Status {
  AVAILABLE = "Available",
  RESERVED = "Reserved",
  SOLD = "Sold",
}

export const statusDict = {
  [Status.AVAILABLE]: "Disponivel",
  [Status.RESERVED]: "Reservado",
  [Status.SOLD]: "Vendido",
};
