using Azure.Data.Tables;
using ImageCompressor.StorageLibrary.Entities.Abstract;
using ImageCompressor.StorageLibrary.Services.Abstract;
using Microsoft.Extensions.Configuration;
using System.Linq.Expressions;

namespace ImageCompressor.StorageLibrary.Services.Concrete;

public sealed class TableStorage<TEntity> : INoSqlStorage<TEntity>
    where TEntity : BaseTableEntity
{
    private readonly TableClient _tableClient;

    public TableStorage(IConfiguration configuration)
    {
        var serviceClient = new TableServiceClient(configuration["AzureStorage"]);

        _tableClient = serviceClient.GetTableClient(typeof(TEntity).Name);

        _tableClient.CreateIfNotExists();
    }

    public async Task<TEntity> AddAsync(TEntity entity)
    {
        var execute = await _tableClient.AddEntityAsync(entity);

        return execute.Content as TEntity;
    }

    public async Task<List<TEntity>> All()
    {
        return await Task.FromResult(_tableClient.Query<TEntity>().ToList());
    }

    public async Task<TEntity> DeleteAsync(string rowKey, string partitionKey)
    {
        var entity = await GetAsync(rowKey, partitionKey);
        await _tableClient.DeleteEntityAsync(partitionKey, rowKey);

        return entity;
    }

    public async Task<TEntity> GetAsync(string rowKey, string partitionKey)
    {
        var execute = await _tableClient.GetEntityIfExistsAsync<TEntity>(partitionKey, rowKey);

        return execute.Value;
    }

    public async Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> query)
    {
        return await Task.FromResult(
            _tableClient.Query<TEntity>().AsQueryable().Where(query).ToList()
        );
    }

    public async Task<TEntity> UpdateAsync(TEntity entity)
    {
        var execute = await _tableClient.UpdateEntityAsync(entity, entity.ETag);

        return execute.Content as TEntity;
    }
}
