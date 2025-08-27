using MediatR;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.SharedKernel.Messaging.Command;

public interface ICommandHandler<TCommand> 
    : IRequestHandler<TCommand, Result>
    where TCommand : ICommand
{
}

public interface ICommandHandler<TCommand, TResponse> 
    : IRequestHandler<TCommand, Result<TResponse>>
    where TCommand : ICommand<TResponse>
{

}
