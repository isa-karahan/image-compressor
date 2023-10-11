using ImageCompressor.StorageLibrary.Entities.Abstract;
using ImageCompressor.StorageLibrary.Utils.Pagination;
using System.Linq.Expressions;

namespace ImageCompressor.StorageLibrary.Services.Abstract;

public interface INoSqlStorage<TEntity> where TEntity : BaseTableEntity
{
    Task<TEntity> AddAsync(TEntity entity);

    Task<TEntity> DeleteAsync(string rowKey, string partitionKey);

    Task<TEntity> UpdateAsync(TEntity entity);

    Task<TEntity> GetAsync(string rowKey, string partitionKey);

    Task<PagedList<TEntity>> AllAsync(
        int? page = 1,
        int? pageSize = 100,
        Expression<Func<TEntity, bool>>? query = default
    );
}
