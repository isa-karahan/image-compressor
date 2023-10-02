using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Specialized;
using ImageCompressor.StorageLibrary.Constants;
using ImageCompressor.StorageLibrary.Services.Abstract;
using Microsoft.Extensions.Configuration;

namespace ImageCompressor.StorageLibrary.Services.Concrete;

public sealed class BlobStorage : IBlobStorage
{
    private readonly BlobServiceClient _blobServiceClient;

    public string BlobUrl { get; init; }

    public BlobStorage(IConfiguration configuration)
    {
        _blobServiceClient = new BlobServiceClient(configuration["AzureStorage"]);
        BlobUrl = _blobServiceClient.Uri.AbsoluteUri;
    }

    public async Task DeleteAsync(string fileName, string containerName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

        var blobClient = containerClient.GetBlobClient(fileName);

        await blobClient.DeleteAsync();
    }

    public async Task<Stream> DownloadAsync(string fileName, string containerName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

        var blobClient = containerClient.GetBlobClient(fileName);

        var info = await blobClient.DownloadStreamingAsync();

        return info.Value.Content;
    }

    public async Task<List<string>> GetLogAsync(string fileName)
    {
        var logs = new List<string>();

        var containerClient = _blobServiceClient.GetBlobContainerClient(Blobs.Logs);

        await containerClient.CreateIfNotExistsAsync();

        var appendClient = containerClient.GetAppendBlobClient(fileName);

        await appendClient.CreateIfNotExistsAsync();

        var info = await appendClient.DownloadStreamingAsync();

        using var sr = new StreamReader(info.Value.Content);

        string line = string.Empty;

        while ((line = sr.ReadLine()) != null)
        {
            logs.Add(line);
        }

        return logs;
    }

    public async Task<List<string>> GetNames(string containerName)
    {
        var blobNames = new List<string>();

        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

        await containerClient.CreateIfNotExistsAsync();

        var blobs = containerClient.GetBlobs();

        blobs
            .ToList()
            .ForEach(x =>
            {
                blobNames.Add(x.Name);
            });

        return blobNames;
    }

    public async Task SetLogAsync(string text, string fileName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(Blobs.Logs);

        await containerClient.CreateIfNotExistsAsync();

        var appendClient = containerClient.GetAppendBlobClient(fileName);

        await appendClient.CreateIfNotExistsAsync();

        using var ms = new MemoryStream();
        using var sw = new StreamWriter(ms);

        sw.Write($"{DateTime.Now} : {text} \n ");

        sw.Flush();

        ms.Position = 0;

        await appendClient.AppendBlockAsync(ms);
    }

    public async Task UploadAsync(Stream stream, string fileName, string containerName)
    {
        var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);

        await containerClient.CreateIfNotExistsAsync();

        await containerClient.SetAccessPolicyAsync(
            Azure.Storage.Blobs.Models.PublicAccessType.BlobContainer
        );

        var blobClient = containerClient.GetBlobClient(fileName);

        await blobClient.UploadAsync(stream, true);
    }
}
