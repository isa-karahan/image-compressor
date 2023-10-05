using Azure.Storage.Queues;
using Azure.Storage.Queues.Models;
using ImageCompressor.StorageLibrary.Entities.Abstract;
using ImageCompressor.StorageLibrary.Services.Abstract;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Text.Json;

namespace ImageCompressor.StorageLibrary.Services.Concrete;

public sealed class AzureQueue<T> : IAzureQueue<T>
    where T : IQueue
{
    private readonly QueueClient _queueClient;

    public AzureQueue(IConfiguration configuration)
    {
        _queueClient = new QueueClient(configuration["AzureStorage"], typeof(T).Name.ToLower());
        _queueClient.CreateIfNotExists();
    }

    public async Task SendMessageAsync(T message)
    {
        var serializedMessage = SerializeMessage(message);
        await _queueClient.SendMessageAsync(serializedMessage);
    }

    public async Task<QueueMessage> RetrieveNextMessageAsync()
    {
        QueueProperties properties = await _queueClient.GetPropertiesAsync();

        if (properties.ApproximateMessagesCount <= 0) return null;
        
        QueueMessage queueMessage = await _queueClient.ReceiveMessageAsync(
            TimeSpan.FromMinutes(1)
        );

        if (queueMessage != null)
            return queueMessage;

        return null;
    }

    public async Task DeleteMessageAsync(string messageId, string popReceipt)
    {
        await _queueClient.DeleteMessageAsync(messageId, popReceipt);
    }

    private static string SerializeMessage(T message)
    {
        var jsonString = JsonSerializer.Serialize(message);

        var jsonStringBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(jsonString));

        return jsonStringBase64;
    }
}
