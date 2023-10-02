using Carter;
using ImageCompressor.API.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ImageCompressor.API.Modules;

public sealed class NotificationModule : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet(
            "api/notifications/{connectionId}",
            async ([FromRoute] string connectionId, IHubContext<NotificationHub> hubContext) =>
            {
                await hubContext.Clients
                    .Client(connectionId)
                    .SendAsync("NotifyCompleteCompressingProcess");
            }
        );
    }
}
