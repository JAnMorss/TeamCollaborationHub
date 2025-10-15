using MediatR;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.SharedKernel.Application.Mediator.Command;

public interface ICommand : IRequest<Result>, IBaseCommand { }

public interface ICommand<TResponse> : IRequest<Result<TResponse>>, IBaseCommand { }

public interface IBaseCommand { }
