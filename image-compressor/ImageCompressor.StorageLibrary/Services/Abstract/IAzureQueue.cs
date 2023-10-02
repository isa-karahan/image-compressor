using Azure.Storage.Queues.Models;
using ImageCompressor.StorageLibrary.Entities.Abstract;

namespace ImageCompressor.StorageLibrary.Services.Abstract;

public interface IAzureQueue<T>
    where T : IQueue
{
    Task DeleteMessageAsync(string messageId, string popReceipt);
    Task<QueueMessage> RetrieveNextMessageAsync();
    Task SendMessageAsync(T message);
}
