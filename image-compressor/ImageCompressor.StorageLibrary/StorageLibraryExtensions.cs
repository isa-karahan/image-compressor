using ImageCompressor.StorageLibrary.Services.Abstract;
using ImageCompressor.StorageLibrary.Services.Concrete;
using ImageCompressor.StorageLibrary.Services.Helpers;
using Microsoft.Extensions.DependencyInjection;

namespace ImageCompressor.StorageLibrary;

public static class StorageLibraryExtensions
{
    public static IServiceCollection AddAzureStorageServices(this IServiceCollection services)
    {
        services.AddScoped<IBlobStorage, BlobStorage>();
        services.AddScoped(typeof(IAzureQueue<>), typeof(AzureQueue<>));
        services.AddScoped(typeof(INoSqlStorage<>), typeof(TableStorage<>));

        services.AddScoped<AzureStorageSummaryService>();

        return services;
    }
}
