export type Image = {
  name: string;
  url: string;
  userName: string;
  isCompressed: boolean;
  rawSize: number;
  compressedSize: number;
  rowKey: string;
  partitionKey: string;
  timestamp: Date;
};
