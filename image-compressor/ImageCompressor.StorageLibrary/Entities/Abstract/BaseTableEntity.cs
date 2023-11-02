using Azure;
using Azure.Data.Tables;

namespace ImageCompressor.StorageLibrary.Entities.Abstract;

public class BaseTableEntity : ITableEntity
{
    public string PartitionKey { get; set; }
    public string RowKey { get; set; } = Guid.NewGuid().ToString();
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
