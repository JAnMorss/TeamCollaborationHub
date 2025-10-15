using MediatR;
using TeamHub.SharedKernel.ErrorHandling;

namespace TeamHub.SharedKernel.Application.Mediator.Query;

public interface IQuery<TResponse> : IRequest<Result<TResponse>> { }
