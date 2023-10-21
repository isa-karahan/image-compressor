using Azure.Data.Tables;
using ImageCompressor.StorageLibrary.Entities.Abstract;
using ImageCompressor.StorageLibrary.Services.Abstract;
using ImageCompressor.StorageLibrary.Utils.Pagination;
using Microsoft.Extensions.Configuration;
using System.Linq.Expressions;
using System.Reflection;

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

    public async Task<PagedList<TEntity>> AllAsync(
        int? page = 0,
        int? pageSize = 100,
        string? sortField = null,
        string? sort = "asc",
        string? filterField = null,
        string? filterValue = null,
        Expression<Func<TEntity, bool>>? query = default
    )
    {
        var tableQuery = query is null ?
            _tableClient.Query<TEntity>().AsQueryable() :
            _tableClient.Query(query).AsQueryable();

        if (!string.IsNullOrEmpty(sortField))
        {
            var property = GetProperty(sortField);

            if (sort == "desc")
            {
                tableQuery = tableQuery.OrderByDescending(e => property.GetValue(e));
            }
            else
            {
                tableQuery = tableQuery.OrderBy(e => property.GetValue(e));
            }
        }

        if (!string.IsNullOrWhiteSpace(filterField) && !string.IsNullOrWhiteSpace(filterValue))
        {
            var property = GetProperty(filterField);

            tableQuery = tableQuery.Where(e => 
                property.GetValue(e)!.ToString()!
                    .Contains(filterValue, StringComparison.OrdinalIgnoreCase));
        }

        return await Task.FromResult(
            PagedList<TEntity>.Create(tableQuery, page ?? 0, pageSize ?? 999999)
        );
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

    public async Task<TEntity> UpdateAsync(TEntity entity)
    {
        var execute = await _tableClient.UpdateEntityAsync(entity, entity.ETag);

        return execute.Content as TEntity;
    }

    private static PropertyInfo GetProperty(string name)
    {
        var fieldName = char.ToUpper(name[0]) + name[1..];

        var property = typeof(TEntity).GetProperty(fieldName)
            ?? throw new ArgumentException($"Property {name} not found in entity {typeof(TEntity)}");

        return property;
    }
}
