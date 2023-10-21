using ImageCompressor.StorageLibrary.Entities.Abstract;

namespace ImageCompressor.StorageLibrary.Entities.Concrete;

public sealed class ImageCompressorQueue : IQueue
{
    public string UserRowKey { get; set; }
    public string UserPartitionKey { get; set; }
    public string ClientId { get; set; }
    public List<QueueImage> Images { get; set; } = new();
}