const CANVAS_API_URL = process.env.REACT_APP_API_BASE_URL + "/api/Canvas/";
const HISTORICAL_DATA_URL = process.env.REACT_APP_API_BASE_URL + "/api/HistoricalDatas/";
const COLOR_DATA_URL = process.env.REACT_APP_API_BASE_URL + "/api/ColorDatas/";

export const getArray = async () => {
  let response = await fetch(CANVAS_API_URL + "GetCanvas", {
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => JSON.parse(res));
  return response;
};

interface ModifyProps {
  position: { row: number; col: number };
  colour: string;
}

export const modifyArray = async ({ position: { row, col }, colour }: ModifyProps) => {
  const body = JSON.stringify({ row: row, column: col, hex: colour });
  await fetch(CANVAS_API_URL + "UpdateCell", {
    body,
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    method: "PUT",
  });
};

// TODO: can potentially put these in a model folder
// NOTE: nitpick on the model field naming, should change
// oldValues, newValues and keyValues to singular instead

// same types as defined in backend/Models/HistoricalData.cs
export interface IHistoricalData {
  id: number;
  // NOTE: assuming the tableName can only be ColorData
  // Name of table that is changed
  tableName: string;
  // Time when SaveChangesAsync() is called in UpdateCell()
  dateTime: string;
  // Id of the item changed
  keyValues: string; // "{\"ColorDataID\":1027}"
  // Old value of the item changed
  oldValues: string; // "{\"Hex\":\"#FFFFFF\"}"
  // New value of the item changed
  newValues: string; // "{\"Hex\":\"#eb4034\"}"
}

// same types as defined in backend/Models/ColorData.cs
export interface IColorData {
  colorDataID: number;
  rowIndex: number;
  columnIndex: number;
  hex: string;
  canvasID: number;
}

export interface IUpdatedCell {
  row: number;
  col: number;
  oldHex: string;
  newHex: string;
}

// TODO: explain why I want to structure the data like this
export interface ITransformedHistoricalData {
  [canvasID: number]: { [date: string]: IUpdatedCell[] };
}

export interface ICanvasData {
  canvasID: number;
  name: string | null;
  score: number;
  colorData: IColorData[];
}

// TODO: explain why this is necessary
export interface IHistoricalDataDates {
  [canvasID: number]: string[];
}

export const getCanvasById = (id: number): Promise<ICanvasData> => fetch(CANVAS_API_URL + id).then((res) => res.json());

export const getColorDataById = (id: number): Promise<IColorData> => fetch(COLOR_DATA_URL + id).then((res) => res.json());

export const getHistoricalData = (): Promise<IHistoricalData[]> => fetch(HISTORICAL_DATA_URL).then((res) => res.json());