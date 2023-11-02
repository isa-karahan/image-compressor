using Microsoft.AspNetCore.Http;

namespace ImageCompressor.StorageLibrary.Utils;

public sealed class QueryParameters
{
    public int Page { get; set; }
    public int PageSize { get; set; } = int.MaxValue;
    public string SortField { get; set; } = string.Empty;
    public bool IsAscendingSort { get; set; } = true;
    public string FilterField { get; set; } = string.Empty;
    public string FilterValue { get; set; } = string.Empty;

    public static QueryParameters FromRequest(HttpContext context)
    {
        var query = context.Request.Query;

        return new QueryParameters
        {
            Page = query.ContainsKey("page") ? int.Parse(query["page"].First()) : 0,
            PageSize = query.ContainsKey("pageSize") ? int.Parse(query["pageSize"].First()) : 100,
            SortField = query["field"].FirstOrDefault() ?? string.Empty,
            IsAscendingSort = !query.ContainsKey("sort") || query["sort"].First() == "asc",
            FilterField = query["filterField"].FirstOrDefault() ?? string.Empty,
            FilterValue = query["filterValue"].FirstOrDefault() ?? string.Empty,
        };
    }
}