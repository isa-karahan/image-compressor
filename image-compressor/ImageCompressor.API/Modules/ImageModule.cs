using Carter;
using ImageCompressor.API.DTOs;
using ImageCompressor.API.Results;
using ImageCompressor.StorageLibrary.Constants;
using ImageCompressor.StorageLibrary.Entities.Concrete;
using ImageCompressor.StorageLibrary.Services.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace ImageCompressor.API.Modules;

public sealed class ImageModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/images");

        group.MapGet(
            "",
            async (INoSqlStorage<Image> imageStorage, INoSqlStorage<User> userStorage) =>
            {
                var images = await imageStorage.AllAsync();

                var imageDtos = new List<ImageDto>(images.Items.Count);

                foreach (var image in images.Items)
                {
                    var user = await userStorage.GetAsync(
                        image.GetUserRowKey(),
                        image.GetUserPartitionKey()
                    );

                    imageDtos.Add(
                        new ImageDto
                        {
                            CompressedSize = image.CompressedSize,
                            IsCompressed = image.IsCompressed,
                            Name = image.Name,
                            PartitionKey = image.PartitionKey,
                            RawSize = image.RawSize,
                            RowKey = image.RowKey,
                            URL = image.URL,
                            UserName = user.FullName
                        }
                    );
                }

                return Result.Success(imageDtos);
            }
        );

        group.MapPost(
            "",
            async (
                string clientId,
                string userRowKey,
                string userPartitionKey,
                [FromForm] IFormFileCollection pictures,
                IAzureQueue<ImageCompressorQueue> queue,
                INoSqlStorage<Image> imageStorage,
                IBlobStorage blobStorage
            ) =>
            {
                var queueMessage = new ImageCompressorQueue
                {
                    ClientId = clientId,
                    UserRowKey = userRowKey,
                    UserPartitionKey = userPartitionKey,
                };

                foreach (var item in pictures)
                {
                    var image = Image.Create(
                        userRowKey,
                        userPartitionKey,
                        item.FileName,
                        item.Length,
                        blobStorage.BlobUrl
                    );

                    await blobStorage.UploadAsync(
                        item.OpenReadStream(),
                        image.Name,
                        Blobs.RawImages
                    );

                    await imageStorage.AddAsync(image);

                    queueMessage.Images.Add(
                        new QueueImage { ImageRowKey = image.RowKey, ImageName = image.Name }
                    );
                }

                await queue.SendMessageAsync(queueMessage);

                return Result.Success("Images uploaded.");
            }
        );

        group.MapDelete(
            "",
            async (
                string rowKey,
                string partitionKey,
                INoSqlStorage<Image> imageStorage,
                IBlobStorage blobStorage
            ) =>
            {
                var image = await imageStorage.DeleteAsync(rowKey, partitionKey);

                await blobStorage.DeleteAsync(image.Name, Blobs.RawImages);

                if (image.IsCompressed)
                    await blobStorage.DeleteAsync(image.Name, Blobs.CompressedImages);

                return Result.Success("Images deleted.");
            }
        );
    }
}