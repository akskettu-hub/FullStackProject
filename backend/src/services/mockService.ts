import mockData from "../../data/mockData.json" with { type: "json" };

export interface MockDataEntry {
  id: number;
  textContent: string;
  year: number;
}

const data: MockDataEntry[] = mockData;

const getMockData = (): MockDataEntry[] => {
  return data;
};

export default getMockData;
