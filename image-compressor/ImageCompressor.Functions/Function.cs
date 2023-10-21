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
    private const int CompressQuality = 70;

    private readonly IBlobStorage _blobStorage;
    private readonly ILogger<Function> _logger;
    private readonly INoSqlStorage<Image> _imageStorage;
    private readonly INoSqlStorage<User> _userStorage;

    public Function(
        IBlobStorage blobStorage,
        ILogger<Function> logger,
        INoSqlStorage<Image> imageStorage,
        INoSqlStorage<User> userStorage)
    {
        _logger = logger;
        _blobStorage = blobStorage;
        _imageStorage = imageStorage;
        _userStorage = userStorage;
    }

    [Function(nameof(Function))]
    public async Task Run(
        [QueueTrigger(Queues.ImageCompressor, Connection = "AzureStorage")]
        ImageCompressorQueue queueMessage
    )
    {
        var imagePartitionKey = Image.GeneratePartitionKey(queueMessage.UserRowKey, queueMessage.UserPartitionKey);

        var totalCompressedSize = 0.0;

        foreach (var queueImage in queueMessage.Images)
        {
            var image = await _imageStorage.GetAsync(queueImage.ImageRowKey, imagePartitionKey);

            var rawImage = await _blobStorage.DownloadAsync(queueImage.ImageName, Blobs.RawImages);

            var compressedImageStream = ImageCompressor.Compress(rawImage, CompressQuality);

            await _blobStorage.UploadAsync(
                compressedImageStream,
                queueImage.ImageName,
                Blobs.CompressedImages
            );

            image.UpdateAsCompressed(compressedImageStream.Length, _blobStorage.BlobUrl);

            totalCompressedSize += image.RawSize - image.CompressedSize;

            await _imageStorage.UpdateAsync(image);
        }

        var user = await _userStorage.GetAsync(queueMessage.UserRowKey, queueMessage.UserPartitionKey);

        var log = $"""

                   User Row Key: {user.RowKey}
                   User Partition Key: {user.PartitionKey}
                   User: {user.FullName}
                   Client Id: {queueMessage.ClientId}
                   Gained Space: {totalCompressedSize:N} KB
                   """;

        _logger.LogInformation(log);
        await _blobStorage.SetLogAsync(log, Logs.ImageCompressorLogs);

        var httpClient = new HttpClient();

        await httpClient.GetAsync(
            $"https://localhost:44340/api/notifications/{queueMessage.ClientId}"
        );
    }
}