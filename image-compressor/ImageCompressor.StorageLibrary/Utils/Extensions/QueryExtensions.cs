using System.Reflection;

namespace ImageCompressor.StorageLibrary.Utils.Extensions;

public static class QueryExtensions
{
    public static PagedList<T> ToPagedList<T>(this IQueryable<T> query, QueryParameters? queryParameters = null)
    {
        queryParameters ??= new QueryParameters();
        
        if (!string.IsNullOrEmpty(queryParameters.SortField))
        {
            var property = GetProperty<T>(queryParameters.SortField);

            query = queryParameters.IsAscendingSort
                ? query.OrderBy(e => property.GetValue(e))
                : query.OrderByDescending(e => property.GetValue(e));
        }

        if (!string.IsNullOrWhiteSpace(queryParameters.FilterField) &&
            !string.IsNullOrWhiteSpace(queryParameters.FilterValue))
        {
            var property = GetProperty<T>(queryParameters.FilterField);

            query = query.Where(e =>
                property.GetValue(e)!.ToString()!
                    .Contains(queryParameters.FilterValue, StringComparison.OrdinalIgnoreCase));
        }
        
        return PagedList<T>.Create(query, queryParameters.Page, queryParameters.PageSize);
    }
    
    private static PropertyInfo GetProperty<T>(string name)
    {
        var fieldName = char.ToUpper(name[0]) + name[1..];

        var property = typeof(T).GetProperty(fieldName)
                       ?? throw new ArgumentException($"Property {name} not found in entity {typeof(T)}");

        return property;
    }
}