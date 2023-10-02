using System.Linq.Expressions;

namespace ImageCompressor.StorageLibrary.Services.Abstract;

public interface INoSqlStorage<TEntity>
{
    Task<TEntity> AddAsync(TEntity entity);

    Task<TEntity> DeleteAsync(string rowKey, string partitionKey);

    Task<TEntity> UpdateAsync(TEntity entity);

    Task<TEntity> GetAsync(string rowKey, string partitionKey);

    Task<List<TEntity>> All();

    Task<List<TEntity>> Query(Expression<Func<TEntity, bool>> query);
}
