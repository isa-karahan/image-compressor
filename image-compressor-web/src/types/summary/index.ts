export type AzureStorageSummary = {
  tables: Array<Summary>;
  queues: Array<Summary>;
  blobs: Array<Summary>;
};

export type Summary = {
  name: string;
  count: number;
};
