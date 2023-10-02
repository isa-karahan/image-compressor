namespace ImageCompressor.StorageLibrary.Services.Abstract;

public interface IBlobStorage
{
    public string BlobUrl { get; }

    Task UploadAsync(Stream stream, string fileName, string containerName);

    Task<Stream> DownloadAsync(string fileName, string containerName);

    Task DeleteAsync(string fileName, string containerName);

    Task SetLogAsync(string text, string fileName);

    Task<List<string>> GetLogAsync(string fileName);

    Task<List<string>> GetNames(string containerName);
}
