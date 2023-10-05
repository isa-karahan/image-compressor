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
}
