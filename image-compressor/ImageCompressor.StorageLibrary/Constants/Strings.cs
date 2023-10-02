namespace ImageCompressor.StorageLibrary.Constants;

public static class TablePartitionKeys
{
    public const string Users = "users";
    public const string Images = "images";
}

public static class Blobs
{
    public const string Logs = "logs";
    public const string RawImages = "raw-images";
    public const string CompressedImages = "compressed-images";
}

public static class Logs
{
    public const string ImageCompressorLogs = "image-compressor-logs";
}
