using Carter;
using ImageCompressor.API.Results;
using ImageCompressor.StorageLibrary.Constants;
using ImageCompressor.StorageLibrary.Entities.Concrete;
using ImageCompressor.StorageLibrary.Services.Abstract;

namespace ImageCompressor.API.Modules;

public class UserModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/users");

        group.MapGet(
            "",
            async (int? page, int? pageSize, INoSqlStorage<User> userStorage) =>
            {
                var users = await userStorage.AllAsync(page, pageSize);
                return Result.Success(users);
            }
        );

        group.MapGet(
            "/{id}",
            async (string id, INoSqlStorage<User> userStorage) =>
            {
                var user = await userStorage.GetAsync(id, TablePartitionKeys.Users);
                return Result.Success(user);
            }
        );

        group.MapGet(
            "/query",
            async (string query, INoSqlStorage<User> userStorage) =>
            {
                var result = await userStorage.AllAsync(
                    query: u =>
                           u.Name.Contains(query)
                           || u.Surname.Contains(query)
                           || u.Email.Contains(query)
                );

                return Result.Success(result);
            }
        );

        group.MapPost(
            "",
            async (User user, INoSqlStorage<User> userStorage) =>
            {
                user.PartitionKey = TablePartitionKeys.Users;
                user.BirthDate = DateTime.SpecifyKind(user.BirthDate, DateTimeKind.Utc);

                await userStorage.AddAsync(user);

                return Result.Success("User created.");
            }
        );

        group.MapDelete(
            "/{id}",
            async (string id, INoSqlStorage<User> userStorage) =>
            {
                await userStorage.DeleteAsync(id, TablePartitionKeys.Users);

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

        group.MapGet(
            "/profession",
            async () =>
            {
                var occupations = await Task.FromResult(Enum.GetNames(typeof(Profession)));

                return Result.Success(occupations);
            }
        );
    }
}
