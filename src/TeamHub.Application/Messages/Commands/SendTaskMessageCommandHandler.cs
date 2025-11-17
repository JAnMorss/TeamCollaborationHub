using TeamHub.Domain.Messages.Entity;
using TeamHub.Domain.Messages.Interface;
using TeamHub.SharedKernel;
using TeamHub.SharedKernel.Application.Mediator.Command;
using TeamHub.SharedKernel.ErrorHandling;
using TeamHub.SignalR.Interface;

namespace TeamHub.Application.Messages.Commands;

public sealed class SendTaskMessageCommandHandler : ICommandHandler<SendTaskMessageCommand, Guid>
{
    private readonly IChatHubService _chatHubService;
    private readonly IChatMessageRepository _chatMessageRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SendTaskMessageCommandHandler(
        IChatHubService chatHubService, 
        IChatMessageRepository chatMessageRepository, 
        IUnitOfWork unitOfWork)
    {
        _chatHubService = chatHubService;
        _chatMessageRepository = chatMessageRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(SendTaskMessageCommand request, CancellationToken cancellationToken)
    {
        var chatMessage = new ChatMessage
        (
            Guid.NewGuid(),
            request.TaskId,
            request.SenderId,
            request.Message,
            DateTime.UtcNow
        );

        await _chatMessageRepository.AddAsync(chatMessage, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await _chatHubService.SendMessageToTask(request.TaskId, new
        {
            SenderId = chatMessage.SenderId,
            Content = chatMessage.Content,
            CreateAt = chatMessage.CreateAt
        });

        return Result.Success(chatMessage.Id);
    }
}
