using ImageCompressor.StorageLibrary.Entities.Abstract;
using System.Linq.Expressions;
using ImageCompressor.StorageLibrary.Utils;

namespace ImageCompressor.StorageLibrary.Services.Abstract;

public interface INoSqlStorage<TEntity> where TEntity : BaseTableEntity
{
    Task<TEntity> AddAsync(TEntity entity);

    Task<TEntity> DeleteAsync(string rowKey, string partitionKey);

    Task<TEntity> UpdateAsync(TEntity entity);

    Task<TEntity> GetAsync(string rowKey, string partitionKey);

    Task<IQueryable<TEntity>> AllAsync(Expression<Func<TEntity, bool>>? query = null);
}