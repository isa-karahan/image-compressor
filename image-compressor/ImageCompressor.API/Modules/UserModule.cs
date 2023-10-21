using Carter;
using ImageCompressor.API.Results;
using ImageCompressor.StorageLibrary.Constants;
using ImageCompressor.StorageLibrary.Entities.Concrete;
using ImageCompressor.StorageLibrary.Services.Abstract;

namespace ImageCompressor.API.Modules;

public sealed class UserModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/users");

        group.MapGet(
            "",
            async (
                int? page,
                int? pageSize,
                string? field,
                string? sort,
                string? filterField,
                string? filterValue,
                INoSqlStorage<User> userStorage
            ) =>
            {
                var users = await userStorage.AllAsync(page, pageSize, field, sort, filterField, filterValue);
                return Result.Success(users);
            }
        );

        group.MapPost(
            "",
            async (User user, INoSqlStorage<User> userStorage) =>
            {
                user.PartitionKey = user.Occupation.ToString();
                user.BirthDate = DateTime.SpecifyKind(user.BirthDate, DateTimeKind.Utc);

                await userStorage.AddAsync(user);

                return Result.Success("User created.");
            }
        );

        group.MapDelete(
            "",
            async (string rowKey, string partitionKey, INoSqlStorage<User> userStorage) =>
            {
                await userStorage.DeleteAsync(rowKey, partitionKey);

                return Result.Success("User deleted.");
            }
        );

        group.MapPut(
            "",
            async (User user, INoSqlStorage<User> userStorage) =>
            {
                user.ETag = Azure.ETag.All;
                user.BirthDate = DateTime.SpecifyKind(user.BirthDate, DateTimeKind.Utc);

                await userStorage.UpdateAsync(user);

                return Result.Success("User updated.");
            }
        );
    }
}