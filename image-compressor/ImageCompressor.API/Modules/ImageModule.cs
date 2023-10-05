﻿using Carter;
using ImageCompressor.API.DTOs;
using ImageCompressor.API.Results;
using ImageCompressor.StorageLibrary.Constants;
using ImageCompressor.StorageLibrary.Entities.Concrete;
using ImageCompressor.StorageLibrary.Services.Abstract;
using Microsoft.AspNetCore.Mvc;

namespace ImageCompressor.API.Modules;

public class ImageModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("api/images");

        group.MapGet(
            "",
            async (INoSqlStorage<Image> imageStorage, INoSqlStorage<User> userStorage) =>
            {
                var images = await imageStorage.All();

                var imageDtos = new List<ImageDto>(images.Count);

                foreach (var image in images)
                {
                    var user = await userStorage.GetAsync(
                        image.PartitionKey,
                        TablePartitionKeys.Users
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
                            UserName = $"{user.Name} {user.Surname}"
                        }
                    );
                }

                return Result.Success(imageDtos);
            }
        );

        group.MapGet(
            "/users/{id}",
            async (string id, INoSqlStorage<Image> imageStorage) =>
            {
                var userImages = await imageStorage.Query(image => image.PartitionKey == id);

                return Result.Success(userImages);
            }
        );

        group.MapPost(
            "/users/{id}",
            async (
                string id,
                [FromQuery] string clientId,
                [FromForm] IFormFileCollection pictures,
                IAzureQueue<ImageCompressorQueue> queue,
                INoSqlStorage<Image> imageStorage,
                IBlobStorage blobStorage
            ) =>
            {
                var queueMessage = new ImageCompressorQueue { UserId = id, ClientId = clientId };

                foreach (var item in pictures)
                {
                    var image = new Image
                    {
                        PartitionKey = id,
                        ETag = Azure.ETag.All,
                        Timestamp = DateTime.UtcNow,
                        IsCompressed = false,
                        RawSize = item.Length / 1024.0
                    };

                    image.Name = $"{image.RowKey}{Path.GetExtension(item.FileName)}";
                    image.SetUrl(blobStorage.BlobUrl);

                    await blobStorage.UploadAsync(
                        item.OpenReadStream(),
                        image.Name,
                        Blobs.RawImages
                    );

                    await imageStorage.AddAsync(image);

                    queueMessage.Images.Add(
                        new QueueImage { ImageId = image.RowKey, ImageName = image.Name }
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
