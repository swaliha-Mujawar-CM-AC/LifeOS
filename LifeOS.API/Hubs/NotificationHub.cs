using Microsoft.AspNetCore.SignalR;

namespace LifeOS.API.Hubs
{
    public class NotificationHub : Hub
    {
        /// <summary>
        /// When a client connects, they join a group named after their userId.
        /// Frontend calls: connection.invoke("JoinUserGroup", userId.toString())
        /// </summary>
        public async Task JoinUserGroup(string userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        }

        public async Task LeaveUserGroup(string userId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
        }
    }
}
