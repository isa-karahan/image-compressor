namespace ImageCompressor.API.DTOs;

public sealed class ImageDto
{
    public string UserName { get; set; }
    public string Name { get; set; }
    public bool IsCompressed { get; set; }
    public double RawSize { get; set; }
    public double CompressedSize { get; set; }
    public string URL { get; set; }
    public string RowKey { get; set; }
    public string PartitionKey { get; set; }
}
