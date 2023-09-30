using ImageCompressor.StorageLibrary.Constants;
using ImageCompressor.StorageLibrary.Entities.Concrete;
using ImageCompressor.StorageLibrary.Services.Abstract;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Runtime.Versioning;

namespace ImageCompressor.Functions;

[SupportedOSPlatform("windows")]
public class Function
{
    private const int CompressQuality = 10;

    private readonly IBlobStorage _blobStorage;
    private readonly ILogger<Function> _logger;
    private readonly INoSqlStorage<Image> _imageStorage;

    public Function(
        IBlobStorage blobStorage,
        ILogger<Function> logger,
        INoSqlStorage<Image> imageStorage)
    {
        _logger = logger;
        _blobStorage = blobStorage;
        _imageStorage = imageStorage;
    }

    [Function(nameof(Function))]
    public async Task Run(
        [QueueTrigger("imagecompressorqueue", Connection = "AzureStorage")] ImageCompressorQueue queueMessage
    )
    {
        foreach (var queueImage in queueMessage.Images)
        {
            var image = await _imageStorage.GetAsync(queueImage.ImageId, queueMessage.UserId);

            var rawImage = await _blobStorage.DownloadAsync(queueImage.ImageName, Blobs.RawImages);

            var compressedImageStream = ImageCompressor.Compress(rawImage, CompressQuality);

            await _blobStorage.UploadAsync(
                compressedImageStream,
                queueImage.ImageName,
                Blobs.CompressedImages);

            image.IsCompressed = true;
            image.CompressedSize = compressedImageStream.Length / 1024;

            await _imageStorage.UpdateAsync(image);
        }

        var log = $"""
            User Id: {queueMessage.UserId}
            Client Id: {queueMessage.ClientId}
            """;

        _logger.LogInformation(log);
        await _blobStorage.SetLogAsync(log, Logs.ImageCompressorLogs);

        var httpClient = new HttpClient();

        await httpClient.GetAsync($"https://localhost:7257/api/notifications/{queueMessage.ClientId}");
    }
}
