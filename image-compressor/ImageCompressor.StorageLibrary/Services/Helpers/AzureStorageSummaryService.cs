using Azure.Data.Tables;
using Azure.Storage.Blobs;
using Azure.Storage.Queues;
using ImageCompressor.StorageLibrary.Entities.Abstract;
using Microsoft.Extensions.Configuration;

namespace ImageCompressor.StorageLibrary.Services.Helpers;

public class AzureStorageSummaryService
{
    private readonly TableServiceClient _tableServiceClient;
    private readonly QueueServiceClient _queueServiceClient;
    private readonly BlobServiceClient _blobServiceClient;

    public AzureStorageSummaryService(IConfiguration configuration)
    {
        string connectionString = configuration["AzureStorage"];
        _tableServiceClient = new TableServiceClient(connectionString);
        _queueServiceClient = new QueueServiceClient(connectionString);
        _blobServiceClient = new BlobServiceClient(connectionString);
    }

    public async Task<AzureStorageSummary> GetStorageSummary()
    {
        var summary = new AzureStorageSummary();

        // Azure Tables
        await foreach (var table in _tableServiceClient.QueryAsync())
        {
            var tableClient = _tableServiceClient.GetTableClient(table.Name);
            summary.Tables.Add(new Summary
            {
                Name = table.Name,
                Count = tableClient.Query<BaseTableEntity>().Count()
            });
        }

        // Azure Queues
        await foreach (var queueName in _queueServiceClient.GetQueuesAsync())
        {
            var queueClient = _queueServiceClient.GetQueueClient(queueName.Name);
            var properties = await queueClient.GetPropertiesAsync();

            summary.Queues.Add(new Summary
            {
                Name = queueName.Name,
                Count = properties.Value.ApproximateMessagesCount
            });
        }

        // Azure Blob Storage
        foreach (var blobContainerItem in _blobServiceClient.GetBlobContainers())
        {
            var blobContainerClient = _blobServiceClient.GetBlobContainerClient(blobContainerItem.Name);
            summary.Blobs.Add(new Summary
            {
                Name = blobContainerItem.Name,
                Count = blobContainerClient.GetBlobs().Count()
            });
        }

        return summary;
    }
}

public class AzureStorageSummary
{
    public List<Summary> Tables { get; } = new();
    public List<Summary> Queues { get; } = new();
    public List<Summary> Blobs { get; } = new();
}

public class Summary
{
    public string Name { get; set; }
    public int Count { get; set; }
}
