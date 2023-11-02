using Carter;
using ImageCompressor.API.Results;
using ImageCompressor.StorageLibrary.Services.Helpers;

namespace ImageCompressor.API.Modules;

public sealed class AzureStorageSummaryModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/summary");

        group.MapGet(
            "",
            async (AzureStorageSummaryService summaryService) =>
            {
                var summary = await summaryService.GetStorageSummary();
                return Result.Success(summary);
            });
    }
}