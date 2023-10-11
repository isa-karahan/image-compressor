using ImageCompressor.StorageLibrary.Entities.Abstract;

namespace ImageCompressor.StorageLibrary.Utils.Pagination;

public sealed class PagedList<T> where T : BaseTableEntity
{
    private PagedList(List<T> items, int page, int pageSize, int totalCount)
    {
        Items = items;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
    }
    public List<T> Items { get; }

    public int Page { get; }
    public int PageSize { get; }
    public int TotalCount { get; }
    public bool HasNextPage => Page * PageSize < TotalCount;
    public bool HasPreviousPage => Page > 1;

    public static PagedList<T> Create(Azure.Pageable<T> query, int page, int pageSize)
    {
        var totalCount = query.Count();

        var items = query.Skip((page - 1) * pageSize)
            .Take(pageSize).ToList();

        return new(items, page, pageSize, totalCount);
    }
}
