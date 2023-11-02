namespace ImageCompressor.StorageLibrary.Utils;

public sealed class PagedList<T>
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
    public bool HasNextPage => (Page + 1) * PageSize < TotalCount;
    public bool HasPreviousPage => Page > 0;

    public static PagedList<T> Create(IQueryable<T> query, int page = 0, int pageSize = 100)
    {
        var totalCount = query.Count();

        var items = query.Skip(page * pageSize)
            .Take(pageSize).ToList();

        return new PagedList<T>(items, page, pageSize, totalCount);
    }
}