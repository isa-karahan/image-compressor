using ImageCompressor.StorageLibrary.Constants;
using ImageCompressor.StorageLibrary.Entities.Abstract;

namespace ImageCompressor.StorageLibrary.Entities.Concrete;

public sealed class Image : BaseTableEntity
{
    public string Name { get; set; }
    public bool IsCompressed { get; set; }
    public double RawSize { get; set; }
    public double CompressedSize { get; set; }
    public string URL { get; set; }

    public void SetUrl(string blobUrl) =>
        URL = IsCompressed
            ? $"{blobUrl}{Blobs.CompressedImages}/{Name}"
            : $"{blobUrl}{Blobs.RawImages}/{Name}";

    public static string GeneratePartitionKey(string rowKey, string partitionKey)
        => $"{partitionKey}@{rowKey}";

    public string GetUserPartitionKey() => PartitionKey.Split("@")[0];
    public string GetUserRowKey() => PartitionKey.Split("@")[1];

    public static string GetUserPartitionKey(string partitionKey) => partitionKey.Split("@")[0];
    public static string GetUserRowKey(string partitionKey) => partitionKey.Split("@")[1];

    public void UpdateAsCompressed(long compressedSize, string blobUrl)
    {
        IsCompressed = true;
        CompressedSize = compressedSize / 1024.0;
        SetUrl(blobUrl);
    }

    public static Image Create(
        string userRowKey,
        string userPartitionKey,
        string name,
        long size,
        string blobUrl,
        bool isCompressed = false,
        long compressedSize = 0)
    {
        var image = new Image
        {
            Name = name,
            IsCompressed = isCompressed,
            RawSize = size / 1024.0,
            CompressedSize = compressedSize,
            ETag = Azure.ETag.All,
            PartitionKey = GeneratePartitionKey(userRowKey, userPartitionKey),
        };

        image.SetUrl(blobUrl);

        return image;
    }
}