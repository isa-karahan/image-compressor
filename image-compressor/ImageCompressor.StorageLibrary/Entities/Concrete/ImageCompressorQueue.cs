using ImageCompressor.StorageLibrary.Entities.Abstract;

namespace ImageCompressor.StorageLibrary.Entities.Concrete;

public sealed class ImageCompressorQueue : IQueue
{
    public string UserId { get; set; }
    public string ClientId { get; set; }
    public List<QueueImage> Images { get; set; } = new();
}

public sealed class QueueImage
{
    public string ImageId { get; set; }
    public string ImageName { get; set; }
}
