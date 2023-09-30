export type Image = {
  name: string;
  url: string;
  isCompressed: boolean;
  rawSize: number;
  compressedSize: number;
  rowKey: string;
  partitionKey: string;
  timestamp: Date;
};
